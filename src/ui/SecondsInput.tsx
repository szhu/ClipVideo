import { useState } from "react";
import TextInput from "./TextInput";
import TextSpan from "./TextSpan";

const SecondsInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    onChangeValue: (value: number) => void;
  }
> = (props) => {
  const [draft, setDraft] = useState<string | undefined>();

  const displayed = draft ?? props.value;

  return (
    <span>
      <TextInput
        type="text"
        {...props}
        value={displayed}
        placeholder={props.value?.toString()}
        onChange={(e) => {
          setDraft(e.target.value);
        }}
        onFocus={() => {
          setDraft("");
        }}
        onBlur={() => {
          if (draft == null) return;
          let value = parseFloat(draft);
          if (!Number.isNaN(value)) {
            props.onChangeValue(value);
          }
          setDraft(undefined);
        }}
        width="6ch"
        level="4"
      ></TextInput>
      <TextSpan level="4"> &nbsp; s</TextSpan>
    </span>
  );
};

export default SecondsInput;
