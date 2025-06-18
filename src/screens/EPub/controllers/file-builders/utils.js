export function epubIsText(content) {
  return typeof content === "string" || (typeof content === "object" && "text" in content);
}

export function epubIsImage(content) {
  return typeof content === "object" && "src" in content;
}