import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ApiErrorResponse } from "./types";
import { modalStyles } from "./styles";

@customElement("error-modal")
class ErrorModal extends LitElement {
  static styles = modalStyles;

  @property({ attribute: false })
  data: {
    error?: ApiErrorResponse;
    genericErrorText?: string;
    onClose?: () => void;
  } = {};

  @property()
  showing?: "true" | "false";

  @property()
  error?: ApiErrorResponse;

  hasSpecificErrors() {
    return this.data.error?.errors
      ? Object.keys(this.data.error.errors).length > 0
      : false;
  }

  renderErrors() {
    if (this.data.error?.errors) {
      return html` <div>
        <ul class="n3o-errors-list">
          ${Object.entries(this.data.error.errors).map(([key, val]) => {
            return html`<li>${val}</li>`;
          })}
        </ul>
      </div>`;
    }
  }

  render() {
    //language=HTML
    if (this.showing === "true")
      return html`
        <div class="n3o-modal-mask">
          <div class="n3o-modal-dialog">
            <div class="n3o-modal-content">
              <div class="n3o-modal-header">
                <h5>${this.data.error?.title || "Something went wrong"}</h5>
                <button
                  @click="${() => this.data.onClose?.()}"
                  type="button"
                  class="n3o-modal-close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div class="n3o-modal-body">
                ${this.hasSpecificErrors()
                  ? this.renderErrors()
                  : html`<p class="n3o-generic-error">
                      ${this.data.genericErrorText ||
                      "Sorry, an error has occurred. If you continue to experience difficulties please contact support."}
                    </p>`}
              </div>
            </div>
          </div>
        </div>
      `;
    else return undefined;
  }
}
