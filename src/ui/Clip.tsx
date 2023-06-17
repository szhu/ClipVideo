import { css } from "@emotion/css";
import {
  DeleteOutlined,
  GpsNotFixed,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { useRef } from "react";
import { useVideoActions } from "../actions/useVideoActions";
import { ClipData } from "../data/ClipData";
import useHmsfText from "../hooks/useHmsfText";
import IconButton from "./IconButton";
import TextField from "./TextInput";
import Timeline from "./Timeline";

const Clip: React.FC<{
  data: ClipData;
  checked: boolean;
  onChangeChecked: (checked: boolean) => void;
  onSeek: (time: number) => void;
  onChange: (newData: ClipData) => void;
  onRemove: (data: ClipData) => void;
  video: HTMLVideoElement | undefined | null;
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  let { playPause, isPlaying } = useVideoActions(props.video);

  const isWithinTimeBounds =
    props.video != null &&
    props.video.currentTime != null &&
    props.data.start != null &&
    props.video.currentTime >= props.data.start &&
    props.data.end != null &&
    props.video.currentTime <= props.data.end;

  const isAtEnd =
    props.video != null &&
    props.video.currentTime != null &&
    props.data.end != null &&
    props.video.currentTime >= props.data.end;

  return (
    <div
      ref={ref}
      data-allowkeys=""
      className={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        padding: 0 16rem 4rem;
        gap: 32rem;

        height: 100rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10rem;

        box-sizing: border-box;
        width: 100%;

        box-shadow: ${props.checked &&
        "inset 0 0 60rem 0 rgba(255, 255, 255, 0.4)"};

        outline: none;

        position: relative;
      `}
      onClick={() => props.onChangeChecked(true)}
      onPointerDown={() => props.onChangeChecked(true)}
      onBlur={(e) => {
        let newlyFocusedElement = e.relatedTarget;
        if (newlyFocusedElement instanceof HTMLElement) {
          if (ref.current?.contains(newlyFocusedElement)) return;
        }

        props.onChangeChecked(false);
      }}
      tabIndex={-1}
    >
      <div
        className={css`
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: ${isWithinTimeBounds ? "block" : "none"};
        `}
      >
        <Timeline
          start={props.data.start ?? 0}
          end={props.data.end ?? 0}
          current={props.video?.currentTime ?? 0}
        />
      </div>

      <div
        className={css`
          display: flex;
          flex-flow: row;
          align-items: center;
        `}
      >
        <IconButton
          level="2"
          onClick={() =>
            props.data.start != null && props.onSeek(props.data.start)
          }
          className={css`
            visibility: ${props.data.start != null ? "visible" : "hidden"};
          `}
        >
          <SkipPrevious />
        </IconButton>
        <IconButton
          level="1"
          onClick={
            props.video == null || props.data.start == null
              ? undefined
              : () => {
                  if (props.video == null || props.data.start == null) return;

                  if (isWithinTimeBounds && !isAtEnd) {
                    playPause();
                  } else {
                    props.video.currentTime = props.data.start;
                    props.video.play();
                  }
                }
          }
          className={css`
            visibility: ${props.data.start != null ? "visible" : "hidden"};
          `}
          showShape={isWithinTimeBounds ? "always" : "hover"}
        >
          {isWithinTimeBounds && isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          level="2"
          onClick={() => props.data.end != null && props.onSeek(props.data.end)}
          className={css`
            visibility: ${props.data.end != null ? "visible" : "hidden"};
          `}
        >
          <SkipNext />
        </IconButton>
      </div>

      <div
        className={css`
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 4rem;
        `}
      >
        {(["start", "end"] as const).map((key) => (
          <div
            key={key}
            className={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              padding: 0;
              gap: 8rem;
            `}
          >
            <TextField
              level="3"
              type="text"
              placeholder="00:00:00.00"
              {...useHmsfText({
                value: props.data[key],
                onChange: (newValue) => {
                  props.onChange({
                    ...props.data,
                    [key]: newValue,
                  });
                },
              })}
              width="12ch"
            />
            <IconButton
              level="4"
              onClick={() => {
                let video = props.video;
                if (!video) return;

                props.onChange({
                  ...props.data,
                  [key]: video.currentTime,
                });
              }}
            >
              <GpsNotFixed />
            </IconButton>
          </div>
        ))}
      </div>

      <TextField
        level="3"
        type="text"
        value={props.data.name}
        onChange={(event) => {
          props.onChange({
            ...props.data,
            name: event.target.value,
          });
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            let input = event.currentTarget;
            await new Promise((resolve) => setTimeout(resolve, 0));
            input.select();
          }
        }}
        align="left"
        className={css`
          flex: 1 0 0;
        `}
      />

      <IconButton level="3" onClick={() => props.onRemove(props.data)}>
        <DeleteOutlined />
      </IconButton>
    </div>
  );
};
export default Clip;
