import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AllocationsClient } from "@n3oltd/umbraco-allocations-client";
import { FundDimensionOptionRes } from "@n3oltd/umbraco-allocations-client/src/index";
import { selectStyles } from "../styles/donationFormStyles";

@customElement("fund-dimension")
class FundDimension extends LitElement {
  static styles = [selectStyles];

  @property()
  dimensionNumber?: number;

  @property()
  value?: FundDimensionOptionRes;

  @property()
  default?: FundDimensionOptionRes;

  @property()
  onChange?: (dim?: FundDimensionOptionRes) => void;

  @property()
  baseUrl: string = "";

  @state()
  _loading: boolean = true;

  @state()
  _dimensions: FundDimensionOptionRes[] = [];

  getFundDimensions1() {
    const client = new AllocationsClient(this.baseUrl);
    return client.getLookupFundDimension1Options().then((r) => {
      this._dimensions = r;
    });
  }

  getFundDimensions2() {
    const client = new AllocationsClient(this.baseUrl);
    return client.getLookupFundDimension2Options().then((r) => {
      this._dimensions = r;
    });
  }

  getFundDimensions3() {
    const client = new AllocationsClient(this.baseUrl);
    return client.getLookupFundDimension3Options().then((r) => {
      this._dimensions = r;
    });
  }

  getFundDimensions4() {
    const client = new AllocationsClient(this.baseUrl);
    return client.getLookupFundDimension4Options().then((r) => {
      this._dimensions = r;
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      if (!this.value && this.default) {
        this.onChange?.(this.default);
      }

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
              this._dimensions?.find(
                (d) => d.id === (e.target as HTMLSelectElement).value,
              ),
            );
          }}"
        >
          ${this._dimensions?.map((dim) => {
            return html`<option
              .selected="${dim.id === this.value?.id ||
              dim.id === this.default?.id}"
              value="${dim.id}"
            >
              ${dim.name}
            </option>`;
          })}
        </select>
      </div>
    `;
  }
}
