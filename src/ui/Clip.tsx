import { css } from "@emotion/css";
import {
  DeleteOutlined,
  GpsNotFixed,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from "@mui/icons-material";
import { useRef } from "react";
import { ClipData } from "../data/ClipData";
import useHmsfText from "../hooks/useHmsfText";
import IconButton from "./IconButton";
import TextField from "./TextInput";

const Clip: React.FC<{
  data: ClipData;
  checked: boolean;
  onChangeChecked: (checked: boolean) => void;
  onPlay: (() => void) | undefined;
  onSeek: (time: number) => void;
  onChange: (newData: ClipData) => void;
  onRemove: (data: ClipData) => void;
  video: HTMLVideoElement | undefined | null;
}> = (props) => {
  let ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      data-allowkeys=""
      className={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        padding: 0 16rem;
        gap: 32rem;

        height: 100rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10rem;

        box-sizing: border-box;
        width: 100%;

        box-shadow: ${props.checked &&
        "inset 0 0 60rem 0 rgba(255, 255, 255, 0.4)"};

        outline: none;
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
          onClick={props.onPlay}
          className={css`
            visibility: ${props.onPlay ? "visible" : "hidden"};
          `}
        >
          <PlayArrow />
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
            <IconButton level="4">
              <GpsNotFixed
                onClick={() => {
                  let video = props.video;
                  if (!video) return;

                  props.onChange({
                    ...props.data,
                    [key]: video.currentTime,
                  });
                }}
              />
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
