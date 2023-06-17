import { useCallback, useEffect, useRef, useState } from "react";

function useRequestAnimationFrameIdempotent() {
  const requestAnimationFrameIdRef = useRef<number | undefined>(undefined);

  return function requestAnimationFrameIdempotent(
    callback: FrameRequestCallback,
  ) {
    if (requestAnimationFrameIdRef.current != null) {
      cancelAnimationFrame(requestAnimationFrameIdRef.current);
    }

    requestAnimationFrameIdRef.current = requestAnimationFrame(callback);
  };
}

export default function useVideo(video: HTMLVideoElement | null) {
  const [, setDummy] = useState(0);
  const requestAnimationFrameIdempotent = useRequestAnimationFrameIdempotent();

  const setVideoAndRender = useCallback((newVideo?: HTMLVideoElement | any) => {
    if (newVideo instanceof HTMLVideoElement) {
      video = newVideo;
    }
    setDummy((x) => x + 1);

    let isVideoPlaying =
      video &&
      video.currentTime > 0 &&
      !video.paused &&
      !video.ended &&
      video.readyState > 2;

    if (isVideoPlaying) {
      requestAnimationFrameIdempotent(setVideoAndRender);
    }
  }, []);

  useEffect(() => {
    if (video === null) return;

    const theVideo = video;

    theVideo.addEventListener("ended", setVideoAndRender);
    theVideo.addEventListener("loadedmetadata", setVideoAndRender);
    theVideo.addEventListener("load", setVideoAndRender);
    theVideo.addEventListener("loadeddata", setVideoAndRender);
    theVideo.addEventListener("loadstart", setVideoAndRender);
    theVideo.addEventListener("pause", setVideoAndRender);
    theVideo.addEventListener("play", setVideoAndRender);
    theVideo.addEventListener("playing", setVideoAndRender);
    theVideo.addEventListener("progress", setVideoAndRender);
    theVideo.addEventListener("ratechange", setVideoAndRender);
    theVideo.addEventListener("seeked", setVideoAndRender);
    theVideo.addEventListener("seeking", setVideoAndRender);
    theVideo.addEventListener("timeupdate", setVideoAndRender);
    theVideo.addEventListener("error", setVideoAndRender);

    setVideoAndRender();

    return () => {
      theVideo.removeEventListener("ended", setVideoAndRender);
      theVideo.removeEventListener("loadedmetadata", setVideoAndRender);
      theVideo.removeEventListener("load", setVideoAndRender);
      theVideo.removeEventListener("loadeddata", setVideoAndRender);
      theVideo.removeEventListener("loadstart", setVideoAndRender);
      theVideo.removeEventListener("pause", setVideoAndRender);
      theVideo.removeEventListener("play", setVideoAndRender);
      theVideo.removeEventListener("playing", setVideoAndRender);
      theVideo.removeEventListener("progress", setVideoAndRender);
      theVideo.removeEventListener("ratechange", setVideoAndRender);
      theVideo.removeEventListener("seeked", setVideoAndRender);
      theVideo.removeEventListener("seeking", setVideoAndRender);
      theVideo.removeEventListener("timeupdate", setVideoAndRender);
      theVideo.removeEventListener("error", setVideoAndRender);
    };
  }, [video]);

  return [video, setVideoAndRender] as const;
}
