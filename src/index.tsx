import { css } from "@emotion/css";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <h1
      className={css`
        color: blue;
      `}
    >
      Hello world!
    </h1>
  );
}

const root = createRoot(document.querySelector("#app")!);
root.render(<App />);
