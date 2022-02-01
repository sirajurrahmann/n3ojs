import { css } from "lit";

export const labelStyles = css`
  * {
    box-sizing: border-box;
  }

  :host {
    font-family: var(--label-font);
    font-size: var(--label-font-size);
    text-transform: var(--label-text-transform);
    color: var(--label-text-color);
    font-weight: var(--label-font-weight);
  }
`;
