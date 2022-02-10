import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { FundDimensionValueRes } from "@n3oltd/umbraco-giving-client";
import { selectStyles, selectCustomArrowStyles } from "../styles/donationFormStyles";

@customElement("fund-dimension")
class FundDimension extends LitElement {
  static styles = [selectStyles, selectCustomArrowStyles];

  @property()
  dimensionNumber?: number;

  @property()
  value?: FundDimensionValueRes;

  @property()
  default?: FundDimensionValueRes;

  @property()
  onChange?: (dim?: FundDimensionValueRes) => void;

  @property()
  baseUrl: string = "";

  @property()
  options: FundDimensionValueRes[] = [];

  @state()
  _loading: boolean = true;

  render() {
    //language=HTML
    return html`
      <div>
        <select
          @change="${(e: Event) => {
            this.onChange?.(
              this.options?.find((d) => d.id === (e.target as HTMLSelectElement).value),
            );
          }}"
        >
          ${this.options?.map((dim) => {
            return html`<option .selected="${dim.id === this.value?.id}" value="${dim.id}">
              ${dim.name}
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
