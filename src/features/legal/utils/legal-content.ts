export type PublicLegalSection = {
  title: string;
  content?: string[];
  items?: string[];
};

/**
 * Converts the plain-text legal content managed from the Admin Dashboard
 * into the same section structure used by the public legal pages.
 *
 * Recommended editor format:
 *
 * 1. Section title
 * Paragraph text.
 * - Bullet item
 * - Bullet item
 *
 * 2. Next section
 * Paragraph text.
 */
export function parseLegalContent(
  value: string,
): PublicLegalSection[] {
  const normalized = value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  if (!normalized) {
    return [];
  }

  const lines = normalized.split("\n");
  const sections: PublicLegalSection[] = [];
  let current: PublicLegalSection | null = null;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (!current || paragraphBuffer.length === 0) {
      paragraphBuffer = [];
      return;
    }

    const paragraph = paragraphBuffer
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (paragraph) {
      current.content ??= [];
      current.content.push(paragraph);
    }

    paragraphBuffer = [];
  };

  const ensureSection = () => {
    if (!current) {
      current = {
        title: "",
        content: [],
        items: [],
      };
      sections.push(current);
    }

    return current;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const isHeading =
      /^\d+\s*[\.\-–—:]\s+\S/.test(line) ||
      /^\d+\.\s*\S/.test(line);

    if (isHeading) {
      flushParagraph();

      current = {
        title: line,
        content: [],
        items: [],
      };

      sections.push(current);
      continue;
    }

    const bulletMatch = line.match(
      /^(?:[-*•–—]|(?:\d+[\)\-]))\s+(.*)$/,
    );

    if (bulletMatch) {
      flushParagraph();

      const section = ensureSection();
      section.items ??= [];
      section.items.push(bulletMatch[1].trim());
      continue;
    }

    ensureSection();
    paragraphBuffer.push(line);
  }

  flushParagraph();

  return sections
    .map((section, index) => ({
      ...section,
      title:
        section.title ||
        (index === 0 ? "1." : `${index + 1}.`),
      content:
        section.content && section.content.length > 0
          ? section.content
          : undefined,
      items:
        section.items && section.items.length > 0
          ? section.items
          : undefined,
    }))
    .filter(
      (section) =>
        section.title ||
        section.content?.length ||
        section.items?.length,
    );
}