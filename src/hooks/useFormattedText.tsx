import { useState } from "react";

export default function useFormattedText<T>(props: {
  value: T;
  onChange: (newValue: T) => void;
  toString: (value: T) => string;
  fromString: (value: string) => T;
}) {
  const [draft, setDraft] = useState<string | undefined>(undefined);

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setDraft(event.target.value);
  }

  function onBlur(): void {
    if (draft !== undefined) {
      props.onChange(props.fromString(draft));
      setDraft(undefined);
    }
  }

  async function onKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> {
    if (event.key === "Enter") {
      let input = event.currentTarget;
      onBlur();
      await new Promise((resolve) => setTimeout(resolve, 0));
      input.select();
    }
  }

  return {
    value: draft ?? props.toString(props.value),
    onChange,
    onBlur,
    onKeyDown,
  };
}
