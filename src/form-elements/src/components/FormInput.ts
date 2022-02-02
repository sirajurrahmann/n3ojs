import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { inputStyles } from "../styles/FormInput.styles";
// TODO: These should come from an n3o package
import { CapitalizationOption } from "../types";

import "./internal/ErrorMessage";
import "./internal/HelpText";

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
  requiredMessage: string = "";

  @property()
  error: string = "";

  @property()
  validateInput?: (target: HTMLInputElement) => void;

  @property()
  capitalizationOption?: CapitalizationOption;

  @property()
  helpText?: string = "";

  @state()
  _touched: boolean = false;

  @state()
  _requiredError: boolean = false;

  @state()
  _capitalizationChangeApplied: boolean = false;

  @state()
  _autoCapitalizationOverwritten: boolean = false;

  applyCapitalizationChange(value: string) {
    if (!this.capitalizationOption) return;
    if (!value) return;
    if (this._autoCapitalizationOverwritten) return;

    // If the current input has been auto-corrected, and then the user has changed it
    // If the value is cleared completely then capitalizationOptionOverwritten must be set to false

    this._capitalizationChangeApplied = true;
    switch (this.capitalizationOption) {
      case CapitalizationOption.Capitalize: {
        const newVal = value[0]?.toUpperCase() + value.slice(1);
        this.value = newVal;
        this.onChange?.(newVal);
        break;
      }
      case CapitalizationOption.Uppercase: {
        const newVal = value.toUpperCase();
        this.value = newVal;
        this.onChange?.(newVal);
        break;
      }
      case CapitalizationOption.Lowercase: {
        const newVal = value.toLowerCase();
        this.value = newVal;
        this.onChange?.(newVal);
        break;
      }
    }
  }

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
          .value="${this.value || ""}"
          @blur="${(e: Event) => {
            this.applyCapitalizationChange(
              (e.target as HTMLSelectElement).value,
            );
          }}"
          @input="${(e: Event) => {
            if (this._capitalizationChangeApplied) {
              this._autoCapitalizationOverwritten = true;
              this._capitalizationChangeApplied = false;
            }

            if ((e.target as HTMLInputElement).value && this.validateInput) {
              this.validateInput?.(e.target as HTMLInputElement);
            }

            if ((e.target as HTMLInputElement).value) {
              this._touched = true;
              this._requiredError = false;
              this.onChange?.((e.target as HTMLInputElement).value);
            } else {
              this._requiredError = true;
              this._autoCapitalizationOverwritten = false;
              this.onChange?.();
            }
          }}"
        />
        ${this._requiredError
          ? html`<error-message
              .message="${this.requiredMessage}"
            ></error-message>`
          : undefined}
        ${this.error
          ? html`<error-message .message="${this.error}"></error-message>`
          : undefined}
        ${this.helpText
          ? html`<help-text .text="${this.helpText}"></help-text>`
          : undefined}
      </div>
    `;
  }
}
