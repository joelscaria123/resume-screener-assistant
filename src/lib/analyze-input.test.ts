
import { describe, expect, it } from "vitest";
import {
  MAX_FILE_SIZE,
  MAX_JOB_DESCRIPTION_LENGTH,
  validateJobDescription,
  validateResumeFile,
} from "./analyze-input";

describe("Job Description Validation", () => {
  it("accepts a valid job description", () => {
    const result = validateJobDescription(
      "We are looking for a React developer."
    );

    expect(result.success).toBe(true);
  });

  it("rejects an empty job description", () => {
    const result = validateJobDescription("");

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only job description", () => {
    const result = validateJobDescription("   ");

    expect(result.success).toBe(false);
  });

  it("rejects a job description exceeding 20,000 characters", () => {
    const result = validateJobDescription(
      "A".repeat(MAX_JOB_DESCRIPTION_LENGTH + 1)
    );

    expect(result.success).toBe(false);
  });

  it("trims whitespace from a valid job description", () => {
    const result = validateJobDescription("  React Developer  ");

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toBe("React Developer");
    }
  });
});

describe("Resume File Validation", () => {
  it("accepts a valid PDF file", async () => {
    const file = new File(
      ["%PDF-1.7 sample PDF content"],
      "resume.pdf"
    );

    const result = await validateResumeFile(file);

    expect(result.extension).toBe(".pdf");
    expect(result.file.name).toBe("resume.pdf");
  });

  it("accepts a valid DOCX ZIP signature", async () => {
    const bytes = new Uint8Array([
      0x50, 0x4b, 0x03, 0x04,
      0x00, 0x00, 0x00, 0x00,
    ]);

    const file = new File([bytes], "resume.docx");

    const result = await validateResumeFile(file);

    expect(result.extension).toBe(".docx");
  });

  it("accepts a valid UTF-8 TXT file", async () => {
    const file = new File(
      ["Resume content for testing."],
      "resume.txt"
    );

    const result = await validateResumeFile(file);

    expect(result.extension).toBe(".txt");
  });

  it("rejects a missing file", async () => {
    await expect(
      validateResumeFile(null)
    ).rejects.toThrow("Please upload a candidate resume.");
  });

  it("rejects an empty file", async () => {
    const file = new File([], "resume.txt");

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow("The uploaded file is empty.");
  });

  it("rejects files larger than 5 MB", async () => {
    const file = new File(
      [new Uint8Array(MAX_FILE_SIZE + 1)],
      "resume.txt"
    );

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow("Resume file must be smaller than 5 MB.");
  });

  it("rejects unsupported file extensions", async () => {
    const file = new File(["content"], "resume.doc");

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow(
      "Only PDF, DOCX, and TXT files are supported."
    );
  });

  it("rejects an invalid PDF signature", async () => {
    const file = new File(
      ["This is not a PDF"],
      "resume.pdf"
    );

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow(
      "The uploaded file is not a valid PDF file."
    );
  });

  it("rejects an invalid DOCX signature", async () => {
    const file = new File(
      ["This is not a ZIP archive"],
      "resume.docx"
    );

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow(
      "The uploaded file is not a valid DOCX archive."
    );
  });

  it("rejects invalid UTF-8 in TXT files", async () => {
    const bytes = new Uint8Array([0xff, 0xfe, 0xfd]);

    const file = new File([bytes], "resume.txt");

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow(
      "The TXT file must contain valid UTF-8 text."
    );
  });

  it("rejects binary content in TXT files", async () => {
    const bytes = new Uint8Array([
      0x48, 0x65, 0x00, 0x6c, 0x6f,
    ]);

    const file = new File([bytes], "resume.txt");

    await expect(
      validateResumeFile(file)
    ).rejects.toThrow(
      "The TXT file must contain valid UTF-8 text."
    );
  });

  it("accepts uppercase file extensions", async () => {
    const file = new File(
      ["%PDF-1.7 sample PDF content"],
      "resume.PDF"
    );

    const result = await validateResumeFile(file);

    expect(result.extension).toBe(".pdf");
  });
});
