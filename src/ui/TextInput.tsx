import styled from "@emotion/styled";
import { FontSizeByLevel } from "./TextSpan";

const OuterSizeByLevel = {
  2: "56px",
  3: "36px",
  4: "24px",
};

export default styled.input<{
  level: "2" | "3" | "4";
  align?: "left" | "center" | "right";
  width?: string;
}>`
  box-sizing: border-box;
  width: ${(props) => props.width ?? "100%"};
  padding: 0px 1ch;
  gap: 10px;

  height: ${(props) => OuterSizeByLevel[props.level]};

  font: unset;
  font-variant-numeric: tabular-nums;
  border: unset;

  background: rgba(0, 0, 0, 0.25);
  color: white;
  box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.25);

  font-size: ${(props) => FontSizeByLevel[props.level]};
  text-align: ${(props) => props.align ?? "center"};

  border-radius: 4px;

  &:focus {
    outline: none;
    box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.5);
  }
`;
