import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  selectCustomArrowStyles,
  selectStyles,
} from "../styles/FormSelect.styles";

@customElement("form-element-select")
class FormElementSelect extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

  @property()
  disabled?: boolean;

  @property()
  value?: { id: string; value: string };

  @property()
  default?: { id: string; value: string };

  @property()
  onChange?: (option?: { id: string; value: string }) => void;

  @property()
  options: { id: string; value: string }[] = [];

  render() {
    // language=html
    return html`
      <div>
        <select
          @change="${(e: Event) => {
            this.onChange?.(
              this.options.find(
                (d) => d.id === (e.target as HTMLSelectElement).value,
              ),
            );
          }}"
        >
          ${this.options?.map((opt) => {
            return html`<option
              .selected="${opt.id === this.value?.id ||
              opt.id === this.default?.id}"
              value="${opt.id}"
            >
              ${opt.value}
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
