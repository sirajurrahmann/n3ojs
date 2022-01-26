import { css } from "lit";

export const donationFormStyles = css`
  div[id*="n3o-donation-form"] {
    font-family: var(--font-family);
  }

  .n3o-donation-form-row {
    margin-bottom: var(--row-spacing, 24px);
  }
  .n3o-donation-form-title,
  .n3o-donation-form-card {
    padding: 8px 16px;
  }
`;

export const buttonStyles = css`
  .n3o-donation-form-button {
    width: 48%;
    font-size: var(--button-text-size, 18px);
    text-transform: var(--type-button-text-transform);
    padding: var(--type-button-padding, 6px 12px);
  }
  .n3o-donation-form-button-unselected {
    background: var(--button-background-color);
    border: var(--button-border);
    color: var(--button-text-color);
    box-shadow: var(--button-box-shadow);
  }
  .n3o-donation-form-button:hover {
    background: var(--button-hover-background-color);
    border: var(--button-hover-border);
    color: var(--button-hover-text-color);
    box-shadow: var(--button-hover-box-shadow);
    cursor: pointer;
  }
  .n3o-donation-form-button-selected {
    background-color: var(--button-selected-background-color);
    border: var(--button-selected-border);
    color: var(--button-selected-text-color);
    box-shadow: var(--button-selected-box-shadow);
  }
`;

export const amountSelectorStyles = css`
  .n3o-donation-form-price-select {
    display: flex;
    justify-content: space-between;
  }
  .n3o-donation-form-price-select button {
    width: 32%;
  }
  .n3o-donation-form-price-desc {
    text-align: center;
    font-size: 14px;
    margin-top: 12px;
    color: var(--default-text-color);
  }
`;

export const frequencyStyles = css`
  .n3o-donation-frequency-container {
    display: flex;
    justify-content: space-between;
  }
`;

export const selectStyles = css`
  select {
    width: 100%;
    height: var(--input-height);
    font-size: var(--input-font-size);
  }
`;

export const otherAmountStyles = css`
  .n3o-amount-input {
    background-color: #fff;
    color: #888;
    height: var(--input-height);
    border: 1px #888 solid;
    font-size: var(--input-font-size);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .n3o-input-amount-symbol {
    padding-left: 5px;
    padding-right: 5px;
  }
  .n3o-input-amount-text {
    padding-right: 5px;
  }
  input,
  input:focus,
  input:focus-visible,
  input:focus-within,
  input:active,
  input:target {
    outline: none;
    border: none;
    box-shadow: none;
  }
  input {
    padding: 0;
    height: var(--input-height);
    font-size: var(--input-font-size);
  }
`;

export const donateButtonStyles = css`
  .n3o-donate-button button {
    width: 100%;
    border: none;
    box-shadow: none;
    font-size: var(--button-text-size);
    transition: background-color 0.5s ease;
    color: var(--donate-button-text-color);
    background: var(--donate-button-background);
  }
  .n3o-donate-button button:hover,
  .n3o-donate-button button:active {
    color: var(--donate-button-hover-text-color);
    background: var(--donate-button-hover-background);
    border: var(--donate-button-hover-border);
    box-shadow: var(--donate-button-hover-box-shadow);
  }
`;
