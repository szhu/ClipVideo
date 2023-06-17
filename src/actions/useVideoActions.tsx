export function useVideoActions(video: HTMLVideoElement | undefined | null) {
  const self = {
    // https://stackoverflow.com/a/6877530
    isPlaying: Boolean(
      video && video.currentTime > 0 && !video.paused && !video.ended,
      //  && video.readyState > 2,
    ),

    changeSpeed(event: React.MouseEvent<HTMLElement>): void {
      const speed = parseFloat(event.currentTarget.dataset.speed as string);

      if (video) {
        try {
          video.playbackRate = speed;
        } catch (error) {
          console.error(error);
        }
      }
    },

    async playPause() {
      if (video) {
        try {
          if (self.isPlaying) {
            video.pause();
          } else {
            await video.play();
          }
        } catch (error) {
          console.error(error);
        }
      }
    },

    skip(seconds: number) {
      if (video) {
        video.currentTime += seconds;
      }
    },
  };

  return self;
}
