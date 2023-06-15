import { ClipData } from "../data/ClipData";

function q(s: string | number) {
  return JSON.stringify("" + s);
}

function roundToDigits(n: number, digits: number) {
  let factor = Math.pow(10, digits);
  return Math.round(n * factor) / factor;
}

export default function generateCommands(src: string, clips: ClipData[]) {
  // ffmpeg -ss 30 -i input.wmv -c copy -t 10 output.wmv
  clips = clips.slice().reverse();
  return clips.map((clip, index) => {
    let start = roundToDigits(clip.start ?? NaN, 3);
    let end = roundToDigits(clip.end ?? NaN, 3);
    let duration = roundToDigits(end - start, 3);

    let dst =
      "./" + (clip.name.trim().replace("/", ":") || "clip-" + index) + ".mp4";

    let command = [
      "ffmpeg",
      "-hide_banner",
      "-loglevel",
      "error",
      "-ss",
      q(start),
      "-i",
      q(src),
      "-filter:v",
      "fps=10",
      // "-c",
      // "copy",
      "-t",
      q(duration),
      q(dst),
    ].join(" ");

    if (Number.isNaN(duration)) {
      command = "# " + command;
    }

    return command;
  });
}
