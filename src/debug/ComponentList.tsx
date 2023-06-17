import { FastRewindOutlined } from "@mui/icons-material";
import { DemoClip } from "../data/ClipData";
import Clip from "../ui/Clip";
import IconButton from "../ui/IconButton";
import SecondsInput from "../ui/SecondsInput";
import TextButton from "../ui/TextButton";
import TextField from "../ui/TextInput";
import ComponentSet from "./ComponentSet";

const ComponentList: React.FC = () => {
  return (
    <>
      <ComponentSet>
        <legend>Icon Button</legend>

        <IconButton level="4">
          <FastRewindOutlined />
        </IconButton>
        <IconButton level="3">
          <FastRewindOutlined />
        </IconButton>
        <IconButton level="2">
          <FastRewindOutlined />
        </IconButton>
        <IconButton level="1">
          <FastRewindOutlined />
        </IconButton>
      </ComponentSet>

      <ComponentSet>
        <legend>Text Button</legend>

        <TextButton level="3" shape="round">
          0.1&times;
        </TextButton>
        <TextButton level="3" shape="long" showShape="always">
          Create Clip
        </TextButton>
        <TextButton level="4" shape="long" showShape="always">
          Create Clip
        </TextButton>
      </ComponentSet>

      <ComponentSet>
        <legend>Text Field</legend>

        <TextField
          level="4"
          type="text"
          defaultValue="1"
          width="6ch"
        ></TextField>
        <TextField
          level="3"
          type="text"
          defaultValue="00:00:06.12"
          width="12ch"
        ></TextField>
        <TextField
          level="2"
          type="text"
          defaultValue="00:00:06.12"
          width="12ch"
        ></TextField>
      </ComponentSet>

      <ComponentSet>
        <legend>Seconds Input</legend>

        <SecondsInput defaultValue="1" onChangeValue={() => undefined} />

        <TextButton level="3" shape="long" showShape="always">
          <SecondsInput defaultValue="1" onChangeValue={() => undefined} />
        </TextButton>
      </ComponentSet>

      <ComponentSet>
        <legend>Clip</legend>

        <Clip
          data={DemoClip}
          onChange={() => {
            console.log("change");
          }}
          onRemove={() => {
            console.log("remove");
          }}
          checked={false}
          onChangeChecked={(checked) => {
            console.log("checked", checked);
          }}
          onSeek={() => {
            console.log("seek");
          }}
          video={undefined}
        />
      </ComponentSet>
    </>
  );
};

export default ComponentList;
