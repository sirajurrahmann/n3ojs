import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { modalStyles } from "../styles";

@customElement("error-modal")
class ErrorModal extends LitElement {
  static styles = modalStyles;

  @property()
  genericErrorText: string =
    "Sorry, something went wrong. If you continue to experience difficulties please contact our donor care team.";

  @property()
  onClose?: () => void;

  @property()
  showing: boolean = false;

  @property()
  errors: string[] = [];

  @property()
  title: string = "Something's not right";

  hasSpecificErrors() {
    return this.errors.length > 0;
  }

  renderErrors() {
    if (this.errors.length) {
      return html` <div>
        <ul class="n3o-errors-list">
          ${this.errors.map((err) => {
            return html`<li>${err}</li>`;
          })}
        </ul>
      </div>`;
    }
  }

  render() {
    //language=HTML
    if (this.showing)
      return html`
        <div class="n3o-modal-mask">
          <div class="n3o-modal-dialog">
            <div class="n3o-modal-content">
              <div class="n3o-modal-header">
                <h5>${this.title}</h5>
                <button
                  @click="${() => this.onClose?.()}"
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
                      ${this.genericErrorText}
                    </p>`}
              </div>
            </div>
          </div>
        </div>
      `;
    else return undefined;
  }
}
