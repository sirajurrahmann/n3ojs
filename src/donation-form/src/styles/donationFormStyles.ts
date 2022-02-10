import { css } from "lit";

export const donationFormStyles = css`
  * {
    font-family: var(--font-family);
  }
  :host {
    width: 100%;
  }
  div[id*="n3o-donation-form"] {
    border: 4px solid var(--theme-color);
    color: var(--text-color);
  }

  .n3o-quick-donate-form {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: none !important;
  }

  .n3o-quick-donate-form .n3o-quick-donate-title {
    padding: 0 30px;
  }
  .n3o-quick-donate-form .n3o-quick-donate-form-selects {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: none !important;
    flex-grow: 1;
  }
  .n3o-quick-donate-form .n3o-quick-donate-form-selects .n3o-quick-donate-col {
    width: 22%;
    padding: 0 2%;
  }

  .n3o-donation-form-title {
    text-align: center;
    font-size: var(--header-font-size);
    color: var(--theme-color);
  }

  .n3o-donation-form-card {
    border-top: 4px solid var(--theme-color);
  }

  .n3o-donation-form-footer {
    font-size: 10px;
    text-align: center;
    color: var(--text-muted-color, #6c757d);
  }

  .n3o-donation-form-row {
    margin-bottom: var(--row-spacing, 24px);
  }
  .n3o-donation-form-title,
  .n3o-donation-form-card {
    padding: 8px 16px;
  }

  @media (max-width: 992px) {
    .n3o-quick-donate-form {
      display: block;
    }
    .n3o-quick-donate-form .n3o-quick-donate-title {
      margin-bottom: 32px;
    }
    .n3o-quick-donate-form .n3o-quick-donate-form-selects {
      flex-wrap: wrap;
    }
    .n3o-quick-donate-form .n3o-quick-donate-form-selects .n3o-quick-donate-col {
      width: 46%;
      padding: 12px 2%;
    }
  }

  @media (max-width: 576px) {
    .n3o-quick-donate-form .n3o-quick-donate-form-selects .n3o-quick-donate-col {
      width: 94%;
      padding: 12px 3%;
    }
  }
`;

export const buttonStyles = css`
  * {
    font-family: "Raleway", sans-serif;
  }
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

  .n3o-button-disabled {
    background: lightgray;
    cursor: not-allowed;
  }
`;

export const amountSelectorStyles = css`
  * {
    font-family: "Raleway", sans-serif;
  }
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
  * {
    font-family: var(--font-family);
  }
  .n3o-donation-frequency-container {
    display: flex;
    justify-content: space-between;
  }
`;

export const selectStyles = css`
  * {
    font-family: var(--font-family);
  }
  select {
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

export const utilStyles = css`
  .n3o-hide-border {
    border: none;
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

export const otherAmountStyles = css`
  * {
    font-family: var(--font-family);
  }
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
  .n3o-amount-input:focus {
    background-color: #fff;
    border-color: var(--theme-color);
    outline: 0;
    box-shadow: var(--input-box-shadow);
  }

  .n3o-amount-input-inner {
    flex-grow: 1;
    display: flex;
  }

  .n3o-amount-input .n3o-select-currency {
    font-size: var(--input-font-size);
    height: calc(var(--input-height) - 1px);
    border: none;
    width: 38px;
    background-position-y: 2px;
  }
  .n3o-amount-input .n3o-select-currency:focus-visible {
    border: none;
    outline: none;
  }
  .n3o-input-amount-symbol {
    padding-left: 5px;
    padding-right: 5px;
  }
  .n3o-input-amount-text {
    margin-right: 5px;
    width: 40px;
  }
  input,
  select {
    border: none;
    outline: none;
    box-shadow: none;
    background: #fff;
    padding: 0;
    height: var(--input-height);
    font-size: var(--input-font-size);
    width: calc(100% - 50px);
  }
  input:focus,
  input:focus-visible,
  input:focus-within,
  input:active,
  input:target,
  select:focus,
  select:focus-visible,
  select:focus-within,
  select:active,
  select:target {
    outline: none;
    border: none;
    box-shadow: var(--input-box-shadow);
  }

  .n3o-amount-disabled {
    background-color: rgba(246, 246, 246, 1);
  }
  .n3o-amount-disabled input {
    background: none;
  }
`;

export const iconStyle = css`
  .material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: "liga";
    -webkit-font-smoothing: antialiased;
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

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .n3o-donate-button button .icon {
    margin-right: 10px;
    color: var(--donate-button-icon-color);
  }
  .n3o-donate-button button:hover,
  .n3o-donate-button button:active {
    color: var(--donate-button-hover-text-color);
    background: var(--donate-button-hover-background);
    border: var(--donate-button-hover-border);
    box-shadow: var(--donate-button-hover-box-shadow);
  }
`;
