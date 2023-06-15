import { css } from "@emotion/css";
import {
  FastForwardOutlined,
  FastRewindOutlined,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import { ClipData } from "../data/ClipData";
import ComponentList from "../debug/ComponentList";
import createSetStateForKey from "../hooks/createSetStateForKey";
import useLocalStorageBackedState from "../hooks/useLocalStorageBackedState";
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

function getVideo(): HTMLVideoElement | undefined {
  return document.querySelector("video") as HTMLVideoElement | undefined;
}

export function App() {
  const [data, setData] = useLocalStorageBackedState<State>("data", {
    skipLevels: [1, 5, 10],
    selectedClipId: undefined,
    clips: [],
  });

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
    const video = getVideo();
    if (video) {
      video.playbackRate = speed;
    }
  }

  function skip(event: React.MouseEvent<HTMLElement>): void {
    const seconds = parseFloat(event.currentTarget.dataset.seconds as string);
    const video = getVideo();
    if (video) {
      video.currentTime += seconds;
    }
  }

  return (
    <>
      <div
        className={css`
          min-height: 100vh;
          display: flex;
          flex-flow: column;
        `}
      >
        <div
          className={css`
            height: 60%;
            display: flex;
            flex-flow: row;
          `}
        >
          <div
            className={css`
              width: 40%;
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
              defaultValue="21:30:20.23"
              width="12ch"
            />

            <IconButton
              level="1"
              showShape="always"
              onClick={async () => {
                const video = getVideo();
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
              {getVideo()?.paused ?? true ? <PlayArrow /> : <Pause />}
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
                  <SecondsInput defaultValue={seconds} width="6ch" />
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

          <video
            className={css`
              background: black;
              flex: 1 0 0;
            `}
          />
        </div>

        <div
          className={css`
            padding: 8px;

            display: flex;
            flex-flow: column;
            align-items: stretch;

            gap: 12px;
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
            <TextButton level="4" shape="long" showShape="always">
              Export
            </TextButton>
          </div>

          {clips.map((clip) => (
            <div key={clip.id}>
              <Clip
                data={clip}
                onPlay={() => {
                  console.log("onPlay");
                }}
                onChange={changeClip}
                onRemove={removeClip}
                getVideo={getVideo}
              />
            </div>
          ))}
        </div>
      </div>

      <hr />
      <ComponentList />
    </>
  );
}
