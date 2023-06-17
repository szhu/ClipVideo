import styled from "@emotion/styled";

export const FontSizeByLevel = {
  2: "36rem",
  3: "24rem",
  4: "12rem",
};

export default styled.span<{
  level: "2" | "3" | "4";
}>`
  font-size: ${(props) => FontSizeByLevel[props.level]};
`;
