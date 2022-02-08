import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { GivingClient, FundDimensionValueRes } from "@n3oltd/umbraco-giving-client";
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

  @state()
  _loading: boolean = true;

  @state()
  _dimensions: FundDimensionValueRes[] = [];

  // TODO: Options here should be taken from donation item, no need to fetch them
  getFundDimensions1() {
    const client = new GivingClient(this.baseUrl);
    return client.getLookupFundDimension1Values().then((r) => {
      this._dimensions = r;
    });
  }

  getFundDimensions2() {
    const client = new GivingClient(this.baseUrl);
    return client.getLookupFundDimension2Values().then((r) => {
      this._dimensions = r;
    });
  }

  getFundDimensions3() {
    const client = new GivingClient(this.baseUrl);
    return client.getLookupFundDimension3Values().then((r) => {
      this._dimensions = r;
    });
  }

  getFundDimensions4() {
    const client = new GivingClient(this.baseUrl);
    return client.getLookupFundDimension4Values().then((r) => {
      this._dimensions = r;
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      if (this.dimensionNumber === 1) {
        this.getFundDimensions1().then(() => {
          this._loading = false;
        });
      } else if (this.dimensionNumber === 2) {
        this.getFundDimensions2().then(() => {
          this._loading = false;
        });
      } else if (this.dimensionNumber === 3) {
        this.getFundDimensions3().then(() => {
          this._loading = false;
        });
      }
      if (this.dimensionNumber === 4) {
        this.getFundDimensions4().then(() => {
          this._loading = false;
        });
      }
    });
  }

  render() {
    //language=HTML
    return html`
      <div>
        <select
          @change="${(e: Event) => {
            this.onChange?.(
              this._dimensions?.find((d) => d.id === (e.target as HTMLSelectElement).value),
            );
          }}"
        >
          ${this._dimensions?.map((dim) => {
            return html`<option .selected="${dim.id === this.value?.id}" value="${dim.id}">
              ${dim.name}
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
