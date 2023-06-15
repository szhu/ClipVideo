export interface ClipData {
  id: string;
  start: number | undefined;
  end: number | undefined;
  name: string;
}

export const DemoClip: ClipData = {
  id: "demo-1",
  start: 5,
  end: 6.12,
  name: "Bob doing something funny",
};
