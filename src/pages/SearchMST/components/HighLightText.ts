export function findOccurrences(text: any, searchTerm: any) {
  const regexText = /<[^>]+>/g;
  const textWithoutTags = text?.replace(regexText, "");
  const regex = new RegExp(`\\b${searchTerm}\\b`, "gi");
  return Array.from(
    textWithoutTags?.matchAll(regex),
    (match: any) => match?.index
  );
}

export function generateOutputWithOccurrences(
  input: any,
  occurrences: any,
  contextLength: any,
  searchTerm: any
) {
  const regex = /<[^>]+>/g;
  const textWithoutTags = input?.replace(regex, "");
  const highlightedStart = '<mark style="color: red;">';
  const highlightedEnd = "</mark>";

  let output = "";
  for (const index of occurrences) {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(
      index + searchTerm?.length + contextLength,
      textWithoutTags.length
    );

    const before = textWithoutTags?.substring(start, index);
    const highlighted = textWithoutTags?.substring(
      index,
      index + searchTerm?.length
    );
    const after = textWithoutTags?.substring(index + searchTerm?.length, end);

    const context = `${before}${highlightedStart}${highlighted}${highlightedEnd}${after}`;
    output += `...${context}...`;
  }
  return output;
}
