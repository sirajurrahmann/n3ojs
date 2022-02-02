import { css } from "lit";

export const helpTooltipStyles = css`
  .n3o-help-tooltip {
    font-size: 0.8em;
    margin-left: 8px;
    background: var(--theme-color);
    padding: 1px 5px 1px 4px;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    position: relative;
    bottom: 2px;
  }

  *[data-tooltip] {
    position: relative;
  }

  *[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    top: -35px;
    right: -206px;
    width: 200px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease-in-out 0s;
    display: block;
    font-size: 12px;
    line-height: 16px;
    background: var(--tooltip-background);
    padding: 4px;
    box-shadow: rgb(0 0 0 / 4%) 2px 4px 4px;
    border-radius: 5px;
    color: var(--text-muted-color);
  }

  *[data-tooltip]:hover::after {
    opacity: 1;
  }
`;
