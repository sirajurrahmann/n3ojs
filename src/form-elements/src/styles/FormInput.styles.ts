import { css } from "lit";

export const inputStyles = css`
  * {
    box-sizing: border-box;
    font-family: var(--font);
  }
  .n3o-element-input {
    border-radius: var(--input-border-radius);
    background-color: #fff;
    color: var(--text-color);
    height: var(--input-height);
    border: 1px #888 solid;
    font-size: var(--input-font-size);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .n3o-element-input:focus {
    background-color: #fff;
    border-color: var(--theme-color);
    outline: 0;
    box-shadow: var(--input-box-shadow);
  }
  .n3o-element-input-disabled {
    color: var(--disabled-text-color);
  }
`;
