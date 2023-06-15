import { css } from "@emotion/css";
import {
  DeleteOutlined,
  GpsNotFixed,
  PlayArrowOutlined,
} from "@mui/icons-material";
import { ClipData } from "../data/ClipData";
import useHmsfText from "../hooks/useHmsfText";
import IconButton from "./IconButton";
import TextField from "./TextInput";

const Clip: React.FC<{
  data: ClipData;
  onPlay: (() => void) | undefined;
  onChange: (newData: ClipData) => void;
  onRemove: (data: ClipData) => void;
  video: HTMLVideoElement | undefined | null;
}> = (props) => {
  return (
    <div
      className={css`
        display: flex;
        flex-flow: row;
        align-items: center;
        padding: 0px 16px;
        gap: 32px;

        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;

        box-sizing: border-box;
        width: 100%;
      `}
    >
      <IconButton
        level="1"
        onClick={props.onPlay}
        className={css`
          visibility: ${props.onPlay ? "visible" : "hidden"};
        `}
      >
        <PlayArrowOutlined />
      </IconButton>

      <div
        className={css`
          display: flex;
          flex-flow: column;
          align-items: center;
          gap: 4px;
        `}
      >
        {(["start", "end"] as const).map((key) => (
          <div
            key={key}
            className={css`
              display: flex;
              flex-direction: row;
              align-items: center;
              padding: 0px;
              gap: 8px;
            `}
          >
            <TextField
              level="3"
              type="text"
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
