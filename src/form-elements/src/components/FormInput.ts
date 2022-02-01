import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { inputStyles } from "../styles/FormInput.styles";

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
  validateInput?: (target: HTMLInputElement) => void;

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
              this.onChange?.((e.target as HTMLInputElement).value);
            } else {
              this.onChange?.();
            }
          }}"
        />
      </div>
    `;
  }
}
