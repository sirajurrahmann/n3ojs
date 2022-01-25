import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DonationOptionRes } from "@n3oltd/umbraco-donations-client/src/index";
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
import { DonationFormMode, Frequency } from "./types";

import "./components/FundSelector";
import "./components/Loading";
import "./components/FrequencySelector";
import "./components/AmountSelector";
import "./components/OtherAmount";
import { MoneyReq } from "@n3oltd/umbraco-cart-client";

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
        // @ts-ignore
        this.donationItems = res.result.value || [];
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
        // @ts-ignore
        this.sponsorshipSchemes = res.result.value || [];
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
            .onChange="${(option: DonationOptionRes) =>
              (this._option = option)}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .options="${this.options}"
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

          <other-amount
            .onChange="${(amount?: MoneyReq) => {
              console.log({ amount });
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
      </div>
    `;
  }
}
