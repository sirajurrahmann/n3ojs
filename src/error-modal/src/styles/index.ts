import { css } from "lit";

export const modalStyles = css`
  .n3o-modal-mask {
    background: rgba(0, 0, 0, 0.3);
    display: block;
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    width: 100%;
    height: 100%;
    outline: 0;
  }
  .n3o-modal-dialog {
    -webkit-transform: none;
    transform: none;
    transition: -webkit-transform 0.3s ease-out;
    position: relative;
    width: auto;
    pointer-events: none;
  }

  @media (min-width: 576px) {
    .n3o-modal-dialog {
      max-width: 500px;
      margin: 30vh auto;
    }
  }

  .n3o-modal-content {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: none;
    border-radius: var(--border-radius);
    outline: 0;
    font-family: var(--font-family);
    color: var(--default-text-color);
  }
  .n3o-modal-header {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: start;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
    font-size: 1.25rem;
  }
  .n3o-modal-header h5 {
    margin: 0;
  }
  .n3o-modal-body {
    position: relative;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1rem;
  }
  .n3o-generic-error {
    font-size: 1.15rem;
  }
  .n3o-errors-list {
    line-height: 32px;
    color: var(--error-text-color);
  }
  .n3o-modal-close {
    cursor: pointer;
    padding: 1rem 1rem;
    margin: -1rem -1rem -1rem auto;
    float: right;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.5;
    background-color: transparent;
    border: 0;
  }
`;
