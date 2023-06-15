import { ClipData } from "../data/ClipData";

function q(s: string | number) {
  return JSON.stringify("" + s);
}

function roundToDigits(n: number, digits: number) {
  let factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
}

export default function generateCommands(filename: string, clips: ClipData[]) {
  // ffmpeg -ss 30 -i input.wmv -c copy -t 10 output.wmv
  return clips.map((clip, index) => {
    let start = roundToDigits(clip.start ?? NaN, 3);
    let end = roundToDigits(clip.end ?? NaN, 3);
    let duration = roundToDigits(end - start, 3);
    let command =
      [
        "ffmpeg",
        "-ss",
        q(start),
        "-i",
        q(filename),
        "-c",
        "copy",
        "-t",
        q(duration),
        q(clip.name + ".mp4"),
      ].join(" ") + "\n";

    if (Number.isNaN(duration)) {
      command = "# " + command;
    }

    return command;
  });
}
