import { css } from "@emotion/css";
import {
  FastForwardOutlined,
  FastRewindOutlined,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import { useState } from "react";
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
  const [video, forceRender] = useVideo(
    document.querySelector("video") as HTMLVideoElement | null,
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

  function newClip(): void {
    setClips((clips) => [
      {
        id: "" + Math.random(),
        start: undefined,
        end: undefined,
        name: "",
      },
      ...clips,
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

  function skip(event: React.MouseEvent<HTMLElement>): void {
    const seconds = parseFloat(event.currentTarget.dataset.seconds as string);

    if (video) {
      video.currentTime += seconds;
    }
  }

  useEventListener(window, "keydown", async (e) => {
    if (e.key === " " && e.target === document.body) {
      e.preventDefault();

      if (!video) return;

      try {
        if (video.paused) {
          await video.play();
        } else {
          video.pause();
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (e.key === "Escape") {
      if (e.target instanceof HTMLElement) {
        e.target.blur();
      }
    }
  });

  return (
    <>
      <div
        className={css`
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-flow: column;
          gap: 12px;
        `}
      >
        <div
          className={css`
            max-height: 80vh;
            display: flex;
            flex-flow: row;
          `}
        >
          <div
            className={css`
              width: 280px;
              display: flex;
              flex-flow: column;
              align-items: center;
              justify-content: center;
              gap: 12px;
            `}
          >
            <TextInput
              type="text"
              level="2"
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

            <IconButton
              level="1"
              showShape="always"
              onClick={async () => {
                if (!video) return;

                try {
                  if (video.paused) {
                    await video.play();
                  } else {
                    video.pause();
                  }
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              {video?.paused ?? true ? <PlayArrow /> : <Pause />}
            </IconButton>

            <div>
              {skipLevels.map((seconds, i) => (
                <div
                  key={i}
                  className={css`
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    gap: 16px;
                  `}
                >
                  <IconButton level="3" onClick={skip} data-seconds={-seconds}>
                    <FastRewindOutlined />
                  </IconButton>
                  <SecondsInput
                    value={seconds}
                    onChange={(e) => {
                      let newValue = parseFloat(e.currentTarget.value);
                      setSkipLevels((skipLevels) => {
                        const newSkipLevels = //
                          [...skipLevels] as [number, number, number];
                        newSkipLevels[i] = newValue;
                        return newSkipLevels;
                      });
                    }}
                    width="6ch"
                  />
                  <IconButton level="3" onClick={skip} data-seconds={seconds}>
                    <FastForwardOutlined />
                  </IconButton>
                </div>
              ))}
            </div>

            <div
              className={css`
                display: flex;
                flex-flow: row wrap;
                max-width: 240px;

                > * {
                  width: 25%;
                  display: flex;
                  flex-flow: row;
                  justify-content: center;
                }
              `}
            >
              {[0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 5, 10, 20].map(
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
          </div>

          {video?.src ? null : (
            <input
              type="file"
              accept="video/*"
              className={css`
                flex: 1 0 0;

                & {
                  padding: 0 50px;
                  position: relative;
                  cursor: pointer;
                }

                /* When dragged over */

                &::after {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  text-align: center;
                  content: "Select a video";
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  color: white;
                  background: black;
                  border: 1px solid black;
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
                console.log(file.name);
              }}
            />
          )}
          <video
            ref={forceRender}
            controls
            className={css`
              background: black;
              flex: 1 0 0;
              width: 0;

              display: ${video?.src ? "block" : "none"};
            `}
          />
        </div>

        <div
          className={css`
            padding: 8px;

            display: flex;
            flex-flow: column;
            align-items: stretch;

            margin: 0 auto;
            box-sizing: border-box;
            width: 1400px;
            max-width: 100%;

            gap: 12px;
            overflow: hidden;
          `}
        >
          <div
            className={css`
              display: flex;
              flex-flow: row;
              gap: 16px;
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
              New Clip
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
                let commands = generateCommands(videoName, clips);
                navigator.clipboard.writeText(commands.join(""));
                await new Promise((resolve) => setTimeout(resolve, 0));
                alert(
                  "Copied to commands to clipboard! Paste into your terminal to export the clips.",
                );
              }}
            >
              Export
            </TextButton>
          </div>

          <div
            className={css`
              display: flex;
              flex-flow: column;
              align-items: stretch;

              gap: 12px;
              overflow-y: auto;
            `}
          >
            {clips.map((clip) => (
              <div key={clip.id}>
                <Clip
                  data={clip}
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
                  onChange={changeClip}
                  onRemove={removeClip}
                  video={video}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr />
      <ComponentList />
    </>
  );
}
