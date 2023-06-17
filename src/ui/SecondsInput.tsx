import { useState } from "react";
import TextInput from "./TextInput";
import TextSpan from "./TextSpan";

function removeKeysFromObject<T extends object>(
  obj: T,
  ...keysToRemove: (keyof T)[]
): Partial<T> {
  let result: Partial<T> = {};
  for (let key in obj) {
    if (keysToRemove.includes(key as keyof T)) continue;
    result[key] = obj[key];
  }
  return result;
}

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
        {...removeKeysFromObject(props, "onChangeValue")}
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
