export function extractHashTags(content: string) {
  const regex = /#\w+/g;
  const hashTags = content.match(regex);
  return hashTags;
}
