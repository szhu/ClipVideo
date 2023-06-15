import styled from "@emotion/styled";

export const FontSizeByLevel = {
  2: "36px",
  3: "24px",
  4: "12px",
};

export default styled.span<{
  level: "2" | "3" | "4";
}>`
  font-size: ${(props) => FontSizeByLevel[props.level]};
`;
