import styled from "@emotion/styled";

export default styled.fieldset`
  margin: 16px;

  display: inline-flex;
  flex-flow: column;
  align-items: flex-start;

  padding: 12px 16px;
  gap: 16px;

  border: 1px dotted #9747ff;
  border-radius: 1rem;

  > legend {
    font: 10px "Inter", sans-serif;
    color: #c592ff;
    user-select: none;
  }
`;
