import useFormattedText from "./useFormattedText";

export default function useHmsfText(props: {
  value: number | undefined;
  onChange: (newValue: number | undefined) => void;
}) {
  return useFormattedText<number | undefined>({
    value: props.value,

    onChange: props.onChange,

    toString: (value) => {
      if (value === undefined) return "";

      let hours = Math.floor(value / 3600)
        .toString()
        .padStart(1, "0");
      let minutes = Math.floor((value % 3600) / 60)
        .toString()
        .padStart(2, "0");
      let seconds = (value % 60).toFixed(2).padStart(5, "0");

      return `${hours}:${minutes}:${seconds}`;
    },

    fromString: (text) => {
      if (text.trim() === "") return undefined;

      let parts = text.split(":").map(Number);
      while (parts.length < 3) {
        parts.unshift(0);
      }
      let [hours, minutes, seconds] = parts;

      let result = hours * 3600 + minutes * 60 + seconds;
      if (Number.isNaN(result)) return undefined;

      return result;
    },
  });
}
