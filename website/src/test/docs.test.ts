import { describe, expect, it } from "vitest";
import { isAllowedPath, resolveDocPdfPath, toDoc } from "@/lib/docs";

describe("docs", () => {
  it("only accepts PDFs under output/", () => {
    expect(toDoc("README.md", 1, "output")).toBeNull();
    expect(toDoc("other/a.pdf", 1, "output")).toBeNull();
  });
  it("derives category and date from the path", () => {
    const d = toDoc("output/Verbali/Verbali interni/verbale_interno_2026-10-15/verbale_interno_2026-10-15.pdf", 1, "output")!;
    expect(d.category).toBe("Verbali / Verbali interni");
    expect(d.date).toBe("2026-10-15");
  });
  it("pdf proxy rejects paths outside output/", () => {
    expect(isAllowedPath("output/../secret.pdf")).toBe(false);
    expect(isAllowedPath("src/a.pdf")).toBe(false);
    expect(isAllowedPath("output/a.pdf")).toBe(true);
  });
  it("resolves document URL paths directly to repo PDF paths", () => {
    const docUrlPath =
      "/documenti/Verbali/Verbali%20interni/verbale_interno_2026-10-26/verbale_interno_2026-10-26.pdf";
    const expectedRepoPath =
      "output/Verbali/Verbali interni/verbale_interno_2026-10-26/verbale_interno_2026-10-26.pdf";

    expect(resolveDocPdfPath(docUrlPath)).toBe(expectedRepoPath);
    expect(resolveDocPdfPath("/documenti/Verbali")).toBeNull();
  });
});
