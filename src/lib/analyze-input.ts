import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_JOB_DESCRIPTION_LENGTH = 20_000;

export const jobDescriptionSchema = z
  .string()
  .trim()
  .min(1, "Job description is required.")
  .max(
    MAX_JOB_DESCRIPTION_LENGTH,
    `Job description cannot exceed ${MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()} characters.`
  );

const allowedExtensions = [".pdf", ".docx", ".txt"];

export type ValidatedResume = {
  file: File;
  extension: string;
};

export function validateJobDescription(value: unknown) {
  return jobDescriptionSchema.safeParse(value);
}

export async function validateResumeFile(
  value: unknown
): Promise<ValidatedResume> {
  if (!(value instanceof File)) {
    throw new Error("Please upload a candidate resume.");
  }

  if (value.size === 0) {
    throw new Error("The uploaded file is empty.");
  }

  if (value.size > MAX_FILE_SIZE) {
    throw new Error("Resume file must be smaller than 5 MB.");
  }

  const extension = value.name
    .slice(value.name.lastIndexOf("."))
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    throw new Error("Only PDF, DOCX, and TXT files are supported.");
  }

  const buffer = await value.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (extension === ".pdf") {
    const header = new TextDecoder().decode(bytes.slice(0, 5));

    if (header !== "%PDF-") {
      throw new Error("The uploaded file is not a valid PDF file.");
    }
  }

  if (extension === ".docx") {
    const isZipFile =
      bytes.length >= 4 &&
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      bytes[2] === 0x03 &&
      bytes[3] === 0x04;

    if (!isZipFile) {
      throw new Error("The uploaded file is not a valid DOCX archive.");
    }
  }

  if (extension === ".txt") {
    try {
      const text = new TextDecoder("utf-8", {
        fatal: true,
      }).decode(bytes);

      if (text.includes("\0")) {
        throw new Error("Binary content detected.");
      }
    } catch {
      throw new Error("The TXT file must contain valid UTF-8 text.");
    }
  }

  return {
    file: value,
    extension,
  };
}