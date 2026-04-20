export function RoleLabel({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] tracking-widest text-muted/50 uppercase">
      {`
      // ${label}`}
    </span>
  );
}
