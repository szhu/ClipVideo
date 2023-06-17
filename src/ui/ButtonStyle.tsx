import { css } from "@emotion/react";

const OuterSizeByLevel = {
  1: "72rem",
  2: "56rem",
  3: "44rem",
  4: "32rem",
};

const InnerSizeByLevel = {
  1: "40rem",
  2: "32rem",
  3: "24rem",
  4: "18rem",
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

    padding: ${props.shape === "long" ? "0 20rem" : "0"};

    gap: 16rem;

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
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 3rem rgba(0, 0, 0, 0.25);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 3rem rgba(0, 0, 0, 0.25);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 4rem 4rem rgba(255, 255, 255, 0.5);
    }

    > svg {
      font-size: ${InnerSizeByLevel[props.level]};
      opacity: 0.9;
    }
  `;
}
