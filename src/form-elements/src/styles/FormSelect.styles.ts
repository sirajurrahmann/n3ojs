import { css } from "lit";

export const selectStyles = css`
  * {
    box-sizing: border-box;
  }

  select {
    border-radius: var(--input-border-radius);
    background-color: #fff;
    width: 100%;
    height: var(--input-height);
    font-size: var(--input-font-size);
  }
  select:focus,
  select:focus-visible,
  select:focus-within,
  select:active,
  select:target {
    outline: none;
    border: none;
    box-shadow: var(--input-box-shadow);
  }
`;

export const selectCustomArrowStyles = css`
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: var(--select-dropdown-url);
    background-repeat: no-repeat;
    background-position-x: 100%;
    padding: 0 5px;
  }
`;
