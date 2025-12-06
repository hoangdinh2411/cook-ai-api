export function extractImageUrlFromHTMLContent(content: string) {
  if (!content) return [];
  return Array.from(content.matchAll(/<img [^>]*src="([^"]+)"[^>]*>/g)).map(
    (match) => match[1],
  );
}

export function extractPublicIdsFromHtml(content: string) {
  const urls = extractImageUrlFromHTMLContent(content);
  return urls
    ? urls.map((url) => {
        const match = url.match(/uploads\/[^]+/);
        return match ? match[0] : '';
      })
    : [];
}
