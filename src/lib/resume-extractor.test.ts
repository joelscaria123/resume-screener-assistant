
import { describe, expect, it } from "vitest";
import { extractResumeText } from "./resume-extractor";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

describe("Resume Text Extraction", () => {
  it("extracts text from a TXT file", async () => {
    const content = "Experienced Full Stack Developer with React and Node.js.";

    const file = new File([content], "resume.txt", {
      type: "text/plain",
    });

    const result = await extractResumeText(file);

    expect(result).toBe(content);
  });

  it("removes unnecessary whitespace around extracted text", async () => {
    const file = new File(
      ["   React Developer with Node.js experience.   "],
      "resume.txt",
      { type: "text/plain" }
    );

    const result = await extractResumeText(file);

    expect(result).toBe("React Developer with Node.js experience.");
  });

  it("rejects unsupported file formats", async () => {
    const file = new File(["Some content"], "resume.doc", {
      type: "application/msword",
    });

    await expect(extractResumeText(file)).rejects.toThrow(
      "Unsupported resume file format."
    );
  });

  it("rejects empty text files", async () => {
    const file = new File(["   "], "resume.txt", {
      type: "text/plain",
    });

    await expect(extractResumeText(file)).rejects.toThrow(
      "No readable text found in the resume."
    );
  });

  it("rejects text files exceeding 30,000 characters", async () => {
    const content = "A".repeat(30_001);

    const file = new File([content], "resume.txt", {
      type: "text/plain",
    });

    await expect(extractResumeText(file)).rejects.toThrow(
      "Extracted resume text exceeds the maximum limit of 30,000 characters."
    );
  });

  it("rejects invalid UTF-8 text files", async () => {
    const invalidBytes = new Uint8Array([0xff, 0xfe, 0xfd]);

    const file = new File([invalidBytes], "resume.txt", {
      type: "text/plain",
    });

    await expect(extractResumeText(file)).rejects.toThrow();
  });

  it("extracts text from a PDF file", async () => {
  const filePath = join(
    process.cwd(),
    "src",
    "lib",
    "fixtures",
    "sample-resume.pdf"
  );

  const buffer = await readFile(filePath);

  const file = new File([buffer], "sample-resume.pdf", {
    type: "application/pdf",
  });

  const result = await extractResumeText(file);

  expect(result.length).toBeGreaterThan(0);
});

it("extracts text from a DOCX file", async () => {
  const filePath = join(
    process.cwd(),
    "src",
    "lib",
    "fixtures",
    "sample-resume.docx"
  );

  const buffer = await readFile(filePath);

  const file = new File([buffer], "sample-resume.docx", {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const result = await extractResumeText(file);

  expect(result.length).toBeGreaterThan(0);
});
});
