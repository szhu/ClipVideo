import { createRoot } from "react-dom/client";
import { App } from "./ui/App";

const root = createRoot(document.querySelector("#app")!);
root.render(<App />);

window.addEventListener("dragover", (e) => {
  if (e.target instanceof HTMLElement) {
    if (e.target.matches(`input[type="file"]`)) return;
  }
  e.preventDefault();
});

window.addEventListener("drop", (e) => {
  if (e.target instanceof HTMLElement) {
    if (e.target.matches(`input[type="file"]`)) return;
  }
  e.preventDefault();
});
