import { css } from "@emotion/css";
import {
  AddCircle,
  FastForward,
  FastRewind,
  IosShare,
  Pause,
  PlayArrow,
  SettingsBackupRestore,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ClipData } from "../data/ClipData";
import ComponentList from "../debug/ComponentList";
import generateCommands from "../export/generateCommands";
import createSetStateForKey from "../hooks/createSetStateForKey";
import useEventListener from "../hooks/useEventListener";
import useHmsfText from "../hooks/useHmsfText";
import useLocalStorageBackedState from "../hooks/useLocalStorageBackedState";
import useVideo from "../hooks/useVideo";
import Clip from "./Clip";
import IconButton from "./IconButton";
import SecondsInput from "./SecondsInput";
import TextButton from "./TextButton";
import TextInput from "./TextInput";
import TextSpan from "./TextSpan";

interface State {
  skipLevels: [number, number, number];
  selectedClipId: string | undefined;
  clips: ClipData[];
}

export function App() {
  const [data, setData] = useLocalStorageBackedState<State>("data", {
    skipLevels: [1, 5, 10],
    selectedClipId: undefined,
    clips: [],
  });
  const [video, setVideo] = useVideo(
    document.querySelector("video") as HTMLVideoElement | null,
  );
  // https://stackoverflow.com/a/6877530
  const isVideoPlaying = Boolean(
    video && video.currentTime > 0 && !video.paused && !video.ended,
    //  && video.readyState > 2,
  );

  const [videoName, setVideoName] = useState<string>("video.mp4");

  const [skipLevels, setSkipLevels] = [
    data.skipLevels,
    createSetStateForKey(setData, "skipLevels"),
  ] as const;
  const [selectedClipId, setSelectedClipId] = [
    data.selectedClipId,
    createSetStateForKey(setData, "selectedClipId"),
  ] as const;
  const [clips, setClips] = [
    data.clips,
    createSetStateForKey(setData, "clips"),
  ] as const;

  const clipsReversed = [...clips].reverse();

  function newClip(): void {
    setClips((clips) => [
      ...clips,
      {
        id: "" + Math.random(),
        start: undefined,
        end: undefined,
        name: "",
      },
    ]);
  }

  function changeClip(clipToChange: ClipData): void {
    setClips((clips) =>
      clips.map((clip) => (clip.id === clipToChange.id ? clipToChange : clip)),
    );
  }

  function removeClip(clipToRemove: ClipData): void {
    setClips((clips) => clips.filter((clip) => clip.id !== clipToRemove.id));
  }

  function changeSpeed(event: React.MouseEvent<HTMLElement>): void {
    const speed = parseFloat(event.currentTarget.dataset.speed as string);

    if (video) {
      try {
        video.playbackRate = speed;
      } catch (error) {
        console.error(error);
      }
    }
  }

  function skipButton(event: React.MouseEvent<HTMLElement>): void {
    const seconds = parseFloat(event.currentTarget.dataset.seconds as string);
    skip(seconds);
  }

  async function playPause() {
    if (video) {
      try {
        if (isVideoPlaying) {
          video.pause();
        } else {
          await video.play();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  function skip(seconds: number) {
    if (video) {
      video.currentTime += seconds;
    }
  }

  useEventListener(window, "keydown", async (e) => {
    if (e.key === "Escape") {
      if (e.target instanceof HTMLElement) {
        e.target.blur();
      }
    } else if (
      e.target === document.body ||
      (e.target instanceof HTMLElement && e.target.dataset.allowkeys != null)
    ) {
      if (e.key === " ") {
        e.preventDefault();
        playPause();
      } else if (e.key === "q" || e.key === "ArrowLeft") {
        skip(-skipLevels[0]);
      } else if (e.key === "w" || e.key === "ArrowRight") {
        skip(skipLevels[0]);
      } else if (e.key === "a") {
        skip(-skipLevels[1]);
      } else if (e.key === "s") {
        skip(skipLevels[1]);
      } else if (e.key === "z") {
        skip(-skipLevels[2]);
      } else if (e.key === "x") {
        skip(skipLevels[2]);
      }
    }
  });

  useEffect(() => {
    let selectedClip = clips.find((clip) => clip.id === selectedClipId);

    if (video && isVideoPlaying && selectedClip) {
      if (
        selectedClip.start != null &&
        video.currentTime < selectedClip.start
      ) {
        video.currentTime = selectedClip.start;
      } else if (
        selectedClip.end != null &&
        video.currentTime > selectedClip.end
      ) {
        video.pause();
        video.currentTime = selectedClip.end;
      }
    }
  }, [video?.currentTime, selectedClipId, clips]);

  return (
    <>
      {new URLSearchParams(location.search).get("showDesignSystem") === "1" && (
        <>
          <ComponentList />
          <hr />
        </>
      )}

      <div
        className={css`
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-flow: column;
          gap: 12rem;
        `}
      >
        <div
          className={css`
            label: -Top;

            height: 0;
            flex: 3 0 0;
            overflow: hidden;

            display: flex;
            flex-flow: row;
            align-items: stretch;
          `}
        >
          <div
            className={css`
              display: ${video?.src ? "contents" : "none"};
            `}
          >
            <div
              className={css`
                label: -Spacer;
                flex: 1 0 0;
              `}
            />
            <div
              className={css`
                label: -Top-Left;

                overflow-y: auto;
                flex: 1 0 340rem;

                display: ${video?.src ? "flex" : "none"};
                flex-flow: column;
                align-items: center;

                padding: 10rem 0;
                gap: 12px;
              `}
            >
              <div
                className={css`
                  label: -Spacer;
                  flex: 1 0 0;
                `}
              />
              <TextInput
                type="text"
                level="2"
                placeholder="00:00:00.00"
                {...useHmsfText({
                  value: video?.currentTime ?? 0,
                  onChange: (newValue) => {
                    if (!video) return;

                    if (newValue === undefined) {
                      video.currentTime = 0;
                    } else {
                      video.currentTime = newValue;
                    }
                  },
                })}
                width="12ch"
              />

              <div
                className={css`
                  display: flex;
                  flex-flow: row;
                  align-items: center;
                  gap: 4rem;
                `}
              >
                <IconButton
                  level="2"
                  onClick={() => {
                    if (!video) return;

                    video.currentTime = 0;
                  }}
                >
                  <SkipPrevious />
                </IconButton>

                <IconButton
                  level="1"
                  showShape="always"
                  onClick={async () => {
                    if (!video) return;

                    try {
                      if (isVideoPlaying) {
                        video.pause();
                      } else {
                        await video.play();
                      }
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  {isVideoPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>

                <IconButton
                  level="2"
                  onClick={() => {
                    if (!video) return;

                    video.currentTime = video.duration;
                  }}
                >
                  <SkipNext />
                </IconButton>
              </div>

              <div
                className={css`
                  flex: 0.3 0 0;
                `}
              />

              <div>
                {skipLevels.map((seconds, i) => (
                  <div
                    key={i}
                    className={css`
                      display: flex;
                      flex-flow: row;
                      align-items: center;
                      gap: 16rem;
                    `}
                  >
                    <IconButton
                      level="3"
                      onClick={skipButton}
                      data-seconds={-seconds}
                    >
                      <FastRewind />
                    </IconButton>
                    <SecondsInput
                      value={seconds}
                      onChangeValue={(value) => {
                        setSkipLevels((skipLevels) => {
                          const newSkipLevels = //
                            [...skipLevels] as [number, number, number];
                          newSkipLevels[i] = value;
                          return newSkipLevels;
                        });
                      }}
                      width="6ch"
                    />
                    <IconButton
                      level="3"
                      onClick={skipButton}
                      data-seconds={seconds}
                    >
                      <FastForward />
                    </IconButton>
                  </div>
                ))}
              </div>

              <div
                className={css`
                  flex: 0.3 0 0;
                `}
              />

              <div
                className={css`
                  display: flex;
                  flex-flow: row wrap;
                  max-width: 240rem;

                  > * {
                    width: 25%;
                    display: flex;
                    flex-flow: row;
                    justify-content: center;
                  }
                `}
              >
                {[0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 5, 10, 15].map(
                  (speed) => (
                    <div key={speed}>
                      <TextButton
                        shape="round"
                        showShape={
                          video?.playbackRate === speed ? "always" : "hover"
                        }
                        level="3"
                        onClick={changeSpeed}
                        data-speed={speed}
                      >
                        {speed}&times;
                      </TextButton>
                    </div>
                  ),
                )}
              </div>
              <div
                className={css`
                  label: -Spacer;
                  flex: 1 0 0;
                `}
              />
            </div>

            <div
              className={css`
                label: -Top-Right;

                padding: 8rem;
                display: flex;
                flex-flow: column;
                align-items: stretch;
                justify-content: stretch;
              `}
            >
              <video
                ref={setVideo}
                controls={!isVideoPlaying}
                playsInline
                className={css`
                  height: 100%;
                  width: 100%;

                  background: black;
                  border-radius: 8rem;

                  /* flex: 1 0 0; */
                  /* height: 100%; */
                  /* max-height: 100%; */

                  display: ${video?.src ? "block" : "none"};
                `}
              />
            </div>

            <div
              className={css`
                label: -Spacer;
                flex: 1 0 0;
              `}
            />
          </div>

          {!video?.src && (
            <input
              type="file"
              accept="video/*"
              className={css`
                height: 100%;
                flex: 1 0 0;
                border: 4rem solid transparent;

                & {
                  position: relative;
                  cursor: pointer;
                }

                &::after {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  text-align: center;
                  font-size: 24rem;
                  content: "No video";
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  color: white;
                  background: black;
                  border: 1rem solid black;
                }

                &:active {
                  opacity: 0.8;
                }
              `}
              onChange={(e) => {
                if (e.currentTarget.files === null) return;

                let file = e.currentTarget.files[0];
                let video = document.querySelector("video") as HTMLVideoElement;
                video.src = URL.createObjectURL(file);
                setVideoName(file.name);
              }}
            />
          )}
        </div>

        <div
          className={css`
            label: -Bottom;

            height: 0;
            flex: 1 0 250rem;

            box-sizing: border-box;
            margin: 0 auto;
            width: 1400rem;
            max-width: 100%;

            display: flex;
            flex-flow: column;
            align-items: stretch;

            padding: 8rem;
            gap: 12rem;

            overflow: hidden;
          `}
        >
          <div
            className={css`
              display: flex;
              flex-flow: row;
              padding: 0 8rem;
              gap: 16rem;
              align-items: center;
            `}
          >
            <TextSpan level="3">Clips</TextSpan>
            <TextButton
              level="4"
              shape="long"
              showShape="always"
              onClick={newClip}
            >
              <AddCircle /> Add
            </TextButton>
            <div
              className={css`
                flex-grow: 1;
              `}
            />

            <TextButton
              level="4"
              shape="long"
              showShape="always"
              onClick={async () => {
                let json = JSON.stringify(clips, null, 2);
                await navigator.clipboard.writeText(json);
                await new Promise((resolve) => setTimeout(resolve, 0));

                let newJson = prompt(
                  "Copy data JSON to clipboard.\n\nEnter new data below to import.",
                );
                if (newJson) {
                  setClips(JSON.parse(newJson));
                }
              }}
            >
              <SettingsBackupRestore />
              Back Up Data
            </TextButton>
            <TextButton
              level="4"
              shape="long"
              showShape="always"
              onClick={async () => {
                let commands = generateCommands(videoName, clips);
                await navigator.clipboard.writeText(commands.join("\n"));
                await new Promise((resolve) => setTimeout(resolve, 0));
                alert(
                  "Copied to commands to clipboard! Paste into your terminal to export the clips.",
                );
              }}
            >
              <IosShare />
              Export All
            </TextButton>
          </div>

          <div
            className={css`
              display: flex;
              flex-flow: column;
              align-items: stretch;

              gap: 12rem;
              overflow-y: auto;
            `}
          >
            {clipsReversed.map((clip) => (
              <div key={clip.id}>
                <Clip
                  checked={clip.id === selectedClipId}
                  data={clip}
                  onChangeChecked={(checked) =>
                    setSelectedClipId(checked ? clip.id : undefined)
                  }
                  onPlay={
                    clip.start == null
                      ? undefined
                      : () => {
                          if (video) {
                            video.currentTime = clip.start ?? 0;
                            video.play();
                          }
                        }
                  }
                  onSeek={(time) => {
                    if (video) {
                      video.pause();
                      video.currentTime = time;
                    }
                  }}
                  onChange={changeClip}
                  onRemove={removeClip}
                  video={video}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
