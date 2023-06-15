import { css } from "@emotion/react";

const OuterSizeByLevel = {
  1: "72px",
  2: "56px",
  3: "44px",
  4: "32px",
};

const InnerSizeByLevel = {
  1: "40px",
  2: "32px",
  3: "24px",
  4: "18px",
};

interface ButtonProps {
  level: "1" | "2" | "3" | "4";
  showShape: "always" | "hover";
  shape: "round" | "long";
}

export function ButtonStyle(props: ButtonProps) {
  return css`
    width: ${props.shape === "long" ? "auto" : OuterSizeByLevel[props.level]};
    height: ${OuterSizeByLevel[props.level]};

    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;

    padding: ${props.shape === "long" ? "0 20px" : "0px"};

    gap: 16px;

    cursor: pointer;
    user-select: none;

    border: unset;
    background: unset;
    color: unset;

    border-radius: ${OuterSizeByLevel[props.level]};

    transition: background-color 0.1s ease-in-out;

    & {
      background-color: ${props.showShape === "always"
        ? "rgba(255, 255, 255, 0.2)"
        : "transparent"};
      background-color: ${props.showShape === "always"
        ? "box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);"
        : "transparent"};
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);
    }

    &:focus {
      outline: none;
      box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.5);
    }

    > svg {
      font-size: ${InnerSizeByLevel[props.level]};
      opacity: 0.9;
    }
  `;
}
