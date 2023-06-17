import { ClipData } from "../data/ClipData";

export function useClipActions(
  _clips: ClipData[],
  setClips: React.Dispatch<React.SetStateAction<ClipData[]>>,
) {
  return {
    newClip(): void {
      setClips((clips) => [
        ...clips,
        {
          id: "" + Math.random(),
          start: undefined,
          end: undefined,
          name: "",
        },
      ]);
    },

    changeClip(clipToChange: ClipData): void {
      setClips((clips) =>
        clips.map((clip) =>
          clip.id === clipToChange.id ? clipToChange : clip,
        ),
      );
    },

    removeClip(clipToRemove: ClipData): void {
      setClips((clips) => clips.filter((clip) => clip.id !== clipToRemove.id));
    },
  };
}
