
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

const MAX_EXTRACTED_TEXT_LENGTH = 30_000;

export async function extractResumeText(file: File): Promise<string> {
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText = "";

  try {
    if (extension === ".pdf") {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));

      // Prevent excessively large documents from consuming resources.
      if (pdf.numPages > 30) {
        throw new Error(
          "Resume PDF cannot contain more than 30 pages."
        );
      }

      const result = await extractText(pdf, {
        mergePages: true,
      });

      extractedText = result.text;
    } else if (extension === ".docx") {
      const result = await mammoth.extractRawText({ buffer });

      extractedText = result.value;
    } else if (extension === ".txt") {
      extractedText = new TextDecoder("utf-8", {
        fatal: true,
      }).decode(buffer);
    } else {
      throw new Error("Unsupported resume file format.");
    }

    extractedText = extractedText.trim();

    if (!extractedText) {
      throw new Error(
        "No readable text found in the resume. Please upload a text-based document."
      );
    }

    if (extractedText.length > MAX_EXTRACTED_TEXT_LENGTH) {
      throw new Error(
        "Extracted resume text exceeds the maximum limit of 30,000 characters."
      );
    }

    return extractedText;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to extract text from the resume.");
  }
}
