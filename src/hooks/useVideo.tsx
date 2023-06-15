import { useCallback, useEffect, useState } from "react";

export default function useVideo(video: HTMLVideoElement | null) {
  const [, setDummy] = useState(0);

  const forceRender = useCallback(() => {
    setDummy((x) => x + 1);
  }, []);

  useEffect(() => {
    if (video === null) return;

    video.addEventListener("ended", forceRender);
    video.addEventListener("loadedmetadata", forceRender);
    video.addEventListener("load", forceRender);
    video.addEventListener("loadeddata", forceRender);
    video.addEventListener("loadstart", forceRender);
    video.addEventListener("pause", forceRender);
    video.addEventListener("play", forceRender);
    video.addEventListener("playing", forceRender);
    video.addEventListener("progress", forceRender);
    video.addEventListener("ratechange", forceRender);
    video.addEventListener("seeked", forceRender);
    video.addEventListener("seeking", forceRender);
    video.addEventListener("timeupdate", forceRender);
    video.addEventListener("error", forceRender);

    forceRender();

    return () => {
      video.removeEventListener("ended", forceRender);
      video.removeEventListener("loadedmetadata", forceRender);
      video.removeEventListener("load", forceRender);
      video.removeEventListener("loadeddata", forceRender);
      video.removeEventListener("loadstart", forceRender);
      video.removeEventListener("pause", forceRender);
      video.removeEventListener("play", forceRender);
      video.removeEventListener("playing", forceRender);
      video.removeEventListener("progress", forceRender);
      video.removeEventListener("ratechange", forceRender);
      video.removeEventListener("seeked", forceRender);
      video.removeEventListener("seeking", forceRender);
      video.removeEventListener("timeupdate", forceRender);
      video.removeEventListener("error", forceRender);
    };
  }, [video]);

  return [video, forceRender] as const;
}
