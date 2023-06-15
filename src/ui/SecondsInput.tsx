import TextInput from "./TextInput";
import TextSpan from "./TextSpan";

const SecondsInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => {
  return (
    <span>
      <TextInput type="text" {...props} width="6ch" level="4"></TextInput>
      <TextSpan level="4"> &nbsp; s</TextSpan>
    </span>
  );
};

export default SecondsInput;
