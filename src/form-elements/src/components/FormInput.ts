import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { inputStyles } from "../styles/FormInput.styles";

import "./internal/ErrorMessage";

@customElement("form-element-input")
class FormElementInput extends LitElement {
  static styles = inputStyles;

  @property()
  disabled?: boolean;

  @property()
  value?: string;

  @property()
  onChange?: (val?: string) => void;

  @property()
  required: boolean = false;

  @property()
  errorMessage: string = "";

  @property()
  validateInput?: (target: HTMLInputElement) => void;

  @state()
  _touched: boolean = false;

  @state()
  _requiredError: boolean = false;

  render() {
    // language=html
    return html`
      <div>
        <input
          class="n3o-element-input ${this.disabled
            ? "n3o-element-input-disabled"
            : ""}"
          .disabled="${this.disabled}"
          value="${this.value || ""}"
          @input="${(e: Event) => {
            if ((e.target as HTMLInputElement).value && this.validateInput) {
              this.validateInput?.(e.target as HTMLInputElement);
            } else if ((e.target as HTMLInputElement).value) {
              this._touched = true;
              this._requiredError = false;
              this.onChange?.((e.target as HTMLInputElement).value);
            } else {
              this._requiredError = true;
              this.onChange?.();
            }
          }}"
        />
        ${this._requiredError
          ? html`<error-message
              .message="${this.errorMessage}"
            ></error-message>`
          : undefined}
      </div>
    `;
  }
}
