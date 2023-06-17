import styled from "@emotion/styled";
import { FontSizeByLevel } from "./TextSpan";

const OuterSizeByLevel = {
  2: "56rem",
  3: "36rem",
  4: "24rem",
};

export default styled.input<{
  level: "2" | "3" | "4";
  align?: "left" | "center" | "right";
  width?: string;
}>`
  box-sizing: border-box;
  width: ${(props) => props.width ?? "100%"};
  padding: 0 1ch;
  gap: 10rem;

  height: ${(props) => OuterSizeByLevel[props.level]};

  font: unset;
  font-variant-numeric: tabular-nums;
  border: unset;

  background: rgba(0, 0, 0, 0.25);
  color: white;
  box-shadow: inset 0 1rem 3rem rgba(0, 0, 0, 0.25);

  font-size: ${(props) => FontSizeByLevel[props.level]};
  text-align: ${(props) => props.align ?? "center"};

  border-radius: 4rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 4rem 4rem rgba(255, 255, 255, 0.5);
  }
`;
