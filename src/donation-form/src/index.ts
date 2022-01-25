import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  DonationOptionRes,
  FixedOrDefaultFundDimensionOptionRes,
} from "@n3oltd/umbraco-donations-client/src/index";
import { donationFormStyles } from "./styles/donationFormStyles";
import { styleMap } from "lit/directives/style-map.js";
import {
  DonationsClient,
  PriceHandleRes,
} from "@n3oltd/umbraco-donations-client";
import {
  AllocationsClient,
  DonationItemRes,
  NamedLookupRes,
} from "@n3oltd/umbraco-allocations-client";
import { MoneyReq } from "@n3oltd/umbraco-cart-client";
import { DonationFormMode, Frequency } from "./types";

import "./components/FundSelector";
import "./components/Loading";
import "./components/FrequencySelector";
import "./components/AmountSelector";
import "./components/OtherAmount";
import "./components/FundDimension";
import { FundDimensionOptionRes } from "@n3oltd/umbraco-allocations-client/src/index";

@customElement("data-donation-form")
class DonationForm extends LitElement {
  static styles = donationFormStyles;

  @property({ attribute: false })
  data: {
    baseUrl: string;
    formId: string;
    mode: DonationFormMode;
    primaryColor: string;
    showFrequencyFirst: boolean;
    singleText?: string;
    regularText?: string;
    showCurrencyText?: boolean;
  } = {
    baseUrl: "",
    formId: "",
    mode: DonationFormMode.full,
    primaryColor: "",
    showFrequencyFirst: false,
    singleText: "Single",
    regularText: "Regular",
    showCurrencyText: false,
  };

  @property()
  options: DonationOptionRes[] = [];

  @property()
  donationItems: DonationItemRes[] = [];

  @property()
  sponsorshipSchemes: NamedLookupRes[] = [];

  @property()
  formTitle: string = "";

  @state()
  _loading: boolean = true;

  @state()
  _frequency: Frequency = Frequency.single;

  @state()
  _option?: DonationOptionRes;

  @state()
  _amount?: PriceHandleRes;

  @state()
  _otherAmount?: MoneyReq;

  @state()
  _dimension1?: FundDimensionOptionRes;

  @state()
  _dimension2?: FundDimensionOptionRes;

  @state()
  _dimension3?: FundDimensionOptionRes;

  @state()
  _dimension4?: FundDimensionOptionRes;

  getDonationForm() {
    const client = new DonationsClient(this.data.baseUrl);
    return client
      .getForm(this.data.formId)
      .then((res) => {
        this.options = res.options || [];
        this.formTitle = res.title || "Donate Now";
        this._option = res.options?.[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getDonationItems() {
    const client = new AllocationsClient(this.data.baseUrl);
    return client
      .getLookupDonationItems()
      .then((res) => {
        this.donationItems = res || [];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getSponsorshipSchemes() {
    const client = new AllocationsClient(this.data.baseUrl);
    return client
      .getLookupSponsorshipSchemes()
      .then((res) => {
        this.sponsorshipSchemes = res || [];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  shouldShowPriceHandles(): boolean {
    // TODO: remove
    return true;

    if (this._frequency === Frequency.single)
      return this._option?.sponsorship
        ? false
        : Boolean(this._option?.fund?.singlePriceHandles?.length);
    if (this._frequency === Frequency.regular)
      return this._option?.sponsorship
        ? false
        : Boolean(this._option?.fund?.regularPriceHandles?.length);
    return false;
  }

  shouldPickFundDimensions(): boolean {
    if (!this._option) return false;
    else {
      let shouldPick = false;
      if (this._option.type === "fund") {
        // If any of the dimensions have a default but are not fixed, donor needs to pick
        if (
          this._option.fund?.dimension1?.default &&
          !this._option.fund?.dimension1?.fixed
        )
          shouldPick = true;

        if (
          this._option.fund?.dimension2?.default &&
          !this._option.fund?.dimension2?.fixed
        )
          shouldPick = true;

        if (
          this._option.fund?.dimension3?.default &&
          !this._option.fund?.dimension3?.fixed
        )
          shouldPick = true;

        if (
          this._option.fund?.dimension4?.default &&
          !this._option.fund?.dimension4?.fixed
        )
          shouldPick = true;

        return shouldPick;
      } else {
        // TODO: Check this
        return false;
      }
    }
  }

  shouldShowDimension(dim?: FixedOrDefaultFundDimensionOptionRes): boolean {
    if (!dim) return false;
    else return !!dim.default && !dim.fixed;
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      Promise.all([
        this.getDonationForm(),
        this.getDonationItems(),
        this.getSponsorshipSchemes(),
      ]).then(() => {
        this._loading = false;
      });
    });
  }

  renderFrequencyFirst() {
    //language=HTML
    return html`
      <div>
        <div class="n3o-donation-form-row">
          <frequency-selector
            .singleText="${this.data.singleText}"
            .regularText="${this.data.regularText}"
            .onChange="${(frequency: Frequency) =>
              (this._frequency = frequency)}"
            .selected="${this._frequency}"
            .disableSingle="${this._option?.type === "fund"
              ? this._option?.fund?.hideSingle
              : false}"
            .disableRegular="${this._option?.type === "fund"
              ? this._option?.fund?.hideRegular
              : false}"
          ></frequency-selector>
        </div>

        <div class="n3o-donation-form-row">
          <fund-selector
            .donationItems="${this.donationItems}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
            }}"
            .value="${this._option}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .options="${this.options.filter((opt) => {
              if (opt.type === "fund")
                return this._frequency === Frequency.single
                  ? !opt.fund?.hideSingle
                  : !opt.fund?.hideRegular;
              if (opt.fund === "sponsorship") return true;
            })}"
          ></fund-selector>
        </div>
      </div>
    `;
  }

  renderFundFirst() {
    //language=HTML
    return html`
      <div>
        <div class="n3o-donation-form-row">
          <fund-selector
            .donationItems="${this.donationItems}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
            }}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .options="${this.options}"
            .value="${this._option}"
          ></fund-selector>
        </div>

        <div class="n3o-donation-form-row">
          <frequency-selector
            .singleText="${this.data.singleText}"
            .regularText="${this.data.regularText}"
            .onChange="${(frequency: Frequency) =>
              (this._frequency = frequency)}"
            .selected="${this._frequency}"
          ></frequency-selector>
        </div>
      </div>
    `;
  }

  render() {
    const containerStyle = styleMap({
      border: `4px solid ${this.data.primaryColor}`,
      textAlign: "center",
      fontSize: "20px",
      fontFamily: "Arial, sans-serif",
      color: this.data.primaryColor,
    });

    const cardStyle = styleMap({
      borderTop: `4px solid ${this.data.primaryColor}`,
    });

    if (this._loading) {
      return html`<donation-form-loading></donation-form-loading>`;
    }

    //language=HTML
    return html`
      <div style="${containerStyle}" id="n3o-donation-form-${this.data.formId}">
        <div class="n3o-donation-form-title">
          ${this.formTitle.toUpperCase()}
        </div>
        <div class="n3o-donation-form-card" style="${cardStyle}">
          ${this.data.showFrequencyFirst
            ? this.renderFrequencyFirst()
            : this.renderFundFirst()}
          ${this.shouldShowPriceHandles()
            ? html`<div class="n3o-donation-form-row">
                <amount-selector
                  .onChange="${(amount: PriceHandleRes) => {
                    this._amount = amount;
                    if (amount) {
                      this._otherAmount = undefined;
                    }
                  }}"
                  .value="${this._amount}"
                  .priceHandles="${this._frequency === Frequency.single
                    ? this._option?.fund?.singlePriceHandles
                    : this._option?.fund?.regularPriceHandles}"
                ></amount-selector>
              </div>`
            : null}

          <div class="n3o-donation-form-row">
            <other-amount
              .onChange="${(amount?: MoneyReq) => {
                this._otherAmount = amount;
                if (amount) {
                  this._amount = undefined;
                }
              }}"
              .value="${this._otherAmount}"
              .showCurrencyText="${this.data.showCurrencyText}"
              .currency="${{ symbol: "£", text: "GBP" }}"
              .currencies="${[{ symbol: "£", text: "GBP" }]}"
            ></other-amount>
          </div>

          ${this.shouldPickFundDimensions()
            ? html`
                <div>
                  ${this.shouldShowDimension(this._option?.fund?.dimension1)
                    ? html`<div class="n3o-donation-form-row">
                        <fund-dimension
                          .baseUrl="${this.data.baseUrl}"
                          .dimensionNumber="${1}"
                          .value="${this._dimension1}"
                          .onChange="${(dim?: FundDimensionOptionRes) =>
                            (this._dimension1 = dim)}"
                          .default="${this._option?.fund?.dimension1?.default}"
                        ></fund-dimension>
                      </div>`
                    : undefined}
                  ${this.shouldShowDimension(this._option?.fund?.dimension2)
                    ? html`<div class="n3o-donation-form-row">
                        <fund-dimension
                          .baseUrl="${this.data.baseUrl}"
                          .dimensionNumber="${2}"
                          .value="${this._dimension2}"
                          .onChange="${(dim?: FundDimensionOptionRes) =>
                            (this._dimension1 = dim)}"
                          .default="${this._option?.fund?.dimension2?.default}"
                        ></fund-dimension>
                      </div>`
                    : undefined}
                  ${this.shouldShowDimension(this._option?.fund?.dimension3)
                    ? html`<div class="n3o-donation-form-row">
                        <fund-dimension
                          .baseUrl="${this.data.baseUrl}"
                          .dimensionNumber="${3}"
                          .value="${this._dimension3}"
                          .onChange="${(dim?: FundDimensionOptionRes) =>
                            (this._dimension1 = dim)}"
                          .default="${this._option?.fund?.dimension3?.default}"
                        ></fund-dimension>
                      </div>`
                    : undefined}
                  ${this.shouldShowDimension(this._option?.fund?.dimension4)
                    ? html`<div class="n3o-donation-form-row">
                        <fund-dimension
                          .baseUrl="${this.data.baseUrl}"
                          .dimensionNumber="${4}"
                          .value="${this._dimension4}"
                          .onChange="${(dim?: FundDimensionOptionRes) =>
                            (this._dimension1 = dim)}"
                          .default="${this._option?.fund?.dimension4?.default}"
                        ></fund-dimension>
                      </div>`
                    : undefined}
                </div>
              `
            : undefined}
        </div>
      </div>
    `;
  }
}