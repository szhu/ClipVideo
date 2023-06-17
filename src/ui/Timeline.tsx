import { css } from "@emotion/css";

const Timeline: React.FC<{
  start: number;
  end: number;
  current: number;
}> = (props) => {
  let duration = props.end - props.start;
  let fromStart = props.current - props.start;
  let frac = duration === 0 ? 0 : fromStart / duration;

  return (
    <div
      className={css`
        position: relative;
        width: 100%;

        height: 6rem;
        max-height: 100%;

        background: rgba(255, 255, 255, 0.5);
        border-radius: 999999px;
        overflow: hidden;
      `}
    >
      <div
        style={{
          width: `${frac * 100}%`,
        }}
        className={css`
          height: 100%;
          background: linear-gradient(to bottom, #ffda1e, #d6b10d);
          border-radius: 999999px;
          border-right: 1px solid #0000007a;
        `}
      />
    </div>
  );
};

export default Timeline;
