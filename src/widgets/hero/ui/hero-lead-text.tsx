export function HeroLeadText({ text }: { text: string }) {
  const cut = text.indexOf(". ");
  if (cut === -1) {
    return <span className="text-foreground/80">{text}</span>;
  }
  return (
    <>
      <span className="text-foreground/85">{text.slice(0, cut + 1)}</span>
      <span className="text-muted">{text.slice(cut + 1)}</span>
    </>
  );
}
