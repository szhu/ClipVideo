import styled from "@emotion/styled";
import { ButtonStyle } from "./ButtonStyle";

export default styled.a<{
  level: "1" | "2" | "3" | "4";
  shape: "round" | "long";
  showShape?: "always" | "hover";
}>`
  ${(props) =>
    ButtonStyle({
      showShape: "hover",
      ...props,
    })}
`;
