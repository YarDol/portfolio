export function splitSentences(text: string): {
  complete: string[];
  remaining: string;
} {
  const re = /[^.!?]+[.!?]+\s*/g;
  const complete: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    complete.push(match[0].trim());
    lastIndex = re.lastIndex;
  }
  return { complete, remaining: text.slice(lastIndex) };
}
