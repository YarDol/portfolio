export type Seg =
  | { t: "plain"; text: string }
  | { t: "key"; id: string; text: string };

export interface Sp {
  v: number;
  vel: number;
}

export interface Pt {
  x: number;
  y: number;
  px: number;
  py: number;
}

export interface Rope {
  pts: Pt[];
  linkLen: number;
  op: Sp;
  active: boolean;
}
