import { css } from "lit";

export const nameFormStyles = css`
  * {
    box-sizing: border-box;
  }

  .n3o-name-form-container,
  .n3o-name-form-row {
    width: 100%;
  }
  .n3o-name-form-row {
    display: flex;
  }
  .n3o-form-horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .n3o-form-vertical {
    flex-direction: column;
  }
  .n3o-name-form-item-row {
    width: 100%;
  }

  .n3o-form-vertical {
    width: 100%;
  }

  .n3o-form-vertical .n3o-name-form-col {
    margin-bottom: var(--row-gutter-vertical);
  }

  /* TITLE COL */
  .n3o-form-horizontal .n3o-name-form-title-col {
    width: 100%;
    margin-bottom: var(--row-gutter-vertical);
  }

  @media (min-width: 576px) {
    .n3o-form-horizontal .n3o-name-form-title-col {
      width: 100%;
    }
  }
  @media (min-width: 768px) {
    .n3o-form-horizontal .n3o-name-form-title-col {
      width: 20%;
      margin-bottom: 0;
      padding-right: var(--row-gutter-horizontal);
    }
  }
  @media (min-width: 992px) {
    .n3o-form-horizontal .n3o-name-form-title-col {
      width: 20%;
      margin-bottom: 0;
      padding-right: var(--row-gutter-horizontal);
    }
  }
  @media (min-width: 1200px) {
    .n3o-form-horizontal .n3o-name-form-title-col {
      width: 20%;
      margin-bottom: 0;
      padding-right: var(--row-gutter-horizontal);
    }
  }

  /* FIRST NAME COLUMN */
  .n3o-form-horizontal .n3o-name-form-firstName-col {
    width: 100%;
    margin-bottom: var(--row-gutter-vertical);
  }
  @media (min-width: 576px) {
    .n3o-form-horizontal .n3o-name-form-firstName-col {
      width: 100%;
    }
  }
  @media (min-width: 768px) {
    .n3o-form-horizontal .n3o-name-form-firstName-col {
      width: 40%;
      margin-bottom: 0;
      padding-right: var(--row-gutter-horizontal);
    }
  }
  @media (min-width: 992px) {
    .n3o-form-horizontal .n3o-name-form-firstName-col {
      width: 40%;
      margin-bottom: 0;
      padding-right: var(--row-gutter-horizontal);
    }
  }
  @media (min-width: 1200px) {
    .n3o-form-horizontal .n3o-name-form-firstName-col {
      width: 40%;
      margin-bottom: 0;
      padding-right: var(--row-gutter-horizontal);
    }
  }

  /* LAST NAME COLUMN */
  .n3o-form-horizontal .n3o-name-form-lastName-col {
    width: 100%;
    margin-bottom: var(--row-gutter-vertical);
  }
  @media (min-width: 576px) {
    .n3o-form-horizontal .n3o-name-form-lastName-col {
      width: 100%;
    }
  }
  @media (min-width: 768px) {
    .n3o-form-horizontal .n3o-name-form-lastName-col {
      width: 40%;
      margin-bottom: 0;
    }
  }
  @media (min-width: 992px) {
    .n3o-form-horizontal .n3o-name-form-lastName-col {
      width: 40%;
      margin-bottom: 0;
    }
  }
  @media (min-width: 1200px) {
    .n3o-form-horizontal .n3o-name-form-lastName-col {
      width: 40%;
      margin-bottom: 0;
    }
  }

  .n3o-form-label-required::after {
    content: "*";
  }

  .n3o-form-item-label-col {
    width: 100%;
    font-family: var(--label-font);
    font-size: var(--label-font-size);
    text-transform: var(--label-text-transform);
    color: var(--label-text-color);
    font-weight: var(--label-font-weight);
    padding-bottom: var(--label-padding-bottom);
    padding-left: var(--label-padding-left);
  }

  .n3o-form-vertical .n3o-form-item-field-col {
    width: var(--vertical-field-col-width-xs);
  }
  @media (min-width: 576px) {
    .n3o-form-vertical .n3o-form-item-field-col {
      width: var(--vertical-field-col-width-sm);
    }
  }
  @media (min-width: 768px) {
    .n3o-form-vertical .n3o-form-item-field-col {
      width: var(--vertical-field-col-width-md);
    }
  }
  @media (min-width: 992px) {
    .n3o-form-vertical .n3o-form-item-field-col {
      width: var(--vertical-field-col-width-lg);
    }
  }
  @media (min-width: 1200px) {
    .n3o-form-vertical .n3o-form-item-field-col {
      width: var(--vertical-field-col-width-xl);
    }
  }

  select,
  input {
    width: 100%;
  }
`;
