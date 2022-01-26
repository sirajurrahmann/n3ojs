import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  DonationOptionRes,
  FixedOrDefaultFundDimensionOptionRes,
} from "@n3oltd/umbraco-donations-client/src/index";
import { donationFormStyles } from "./styles/donationFormStyles";
import {
  Currency,
  DonationsClient,
  PriceHandleRes,
} from "@n3oltd/umbraco-donations-client";
import {
  AllocationsClient,
  DonationItemRes,
  NamedLookupRes,
} from "@n3oltd/umbraco-allocations-client";
import {
  AddToCartReq,
  CartClient,
  DonationType,
  MoneyReq,
} from "@n3oltd/umbraco-cart-client";
import { ApiErrorResponse, DonationFormMode, DonationFormType } from "./types";
import { FundDimensionOptionRes } from "@n3oltd/umbraco-allocations-client/src/index";

import "./components/FundSelector";
import "./components/Loading";
import "./components/FrequencySelector";
import "./components/AmountSelector";
import "./components/OtherAmount";
import "./components/FundDimension";
import "./components/DonateButton";

// TODO: where to get currencies?

@customElement("data-donation-form")
class DonationForm extends LitElement {
  static styles = donationFormStyles;

  @property({ attribute: false })
  data: {
    baseUrl: string;
    formId: string;
    mode: DonationFormMode;
    showFrequencyFirst: boolean;
    singleText?: string;
    regularText?: string;
    showCurrencyText?: boolean;
    footerText?: string;
  } = {
    baseUrl: "",
    formId: "",
    mode: DonationFormMode.full,
    showFrequencyFirst: false,
    singleText: "Single",
    regularText: "Regular",
    showCurrencyText: false,
    footerText: "",
  };

  @property()
  type: DonationFormType = DonationFormType.Full;

  @property()
  options: DonationOptionRes[] = [];

  @property()
  donationItems: DonationItemRes[] = [];

  @property()
  sponsorshipSchemes: NamedLookupRes[] = [];

  @property()
  formTitle: string = "";

  @property()
  currencies = [
    { symbol: "£", text: "GBP", selected: true },
    { symbol: "€", text: "EUR", selected: false },
  ];

  @state()
  _loading: boolean = true;

  @state()
  _frequency: DonationType = DonationType.Single;

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

  @state()
  _saving: boolean = false;

  @state()
  _error?: ApiErrorResponse;

  handleError(err: ApiErrorResponse) {
    if (err.status === 400) {
      this._error = err;
    } else {
      this._error = {
        title: err.title || "Something went wrong",
        errors: err.errors || {},
        status: err.status,
      };
    }
  }

  donate() {
    // TODO: How much frontend validation to do?
    if (!this._option) return;

    this._saving = true;

    const client = new CartClient(this.data.baseUrl);

    const req: AddToCartReq = {
      donationType: this._frequency,
      allocation: {
        type: this._option.type,
        value: this._otherAmount
          ? {
              amount: this._otherAmount.amount,
              currency: this._otherAmount.currency,
            }
          : {
              amount: this._amount?.amount?.amount,
              currency: this._amount?.amount?.currency,
            },
        dimension1: this._dimension1,
        dimension2: this._dimension2,
        dimension3: this._dimension3,
        dimension4: this._dimension4,
        fund:
          this._option.type === "fund"
            ? {
                donationItem: this._option.fund?.donationItem,
              }
            : undefined,
        sponsorship:
          this._option.type === "sponsorship"
            ? {
                scheme: this._option.sponsorship?.scheme,
              }
            : undefined,
      },
      quantity: 1, // TODO: Does this apply to sponsorships only?
    };

    client
      .add(req)
      .then((res) => {
        this._saving = false;
      })
      .catch((err) => {
        this.handleError(err);
        this._saving = false;
      });
  }

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

    if (this._frequency === DonationType.Single)
      return this._option?.sponsorship
        ? false
        : Boolean(this._option?.fund?.singlePriceHandles?.length);
    if (this._frequency === DonationType.Regular)
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
            .onChange="${(frequency: DonationType) =>
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
                return this._frequency === DonationType.Single
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
            .onChange="${(frequency: DonationType) =>
              (this._frequency = frequency)}"
            .selected="${this._frequency}"
          ></frequency-selector>
        </div>
      </div>
    `;
  }

  renderQuickDonationContents() {
    return html`
      <div>Donation Type Selector</div>

      <div>Donation Item</div>

      <div>Donation Amount</div>

      <div>
        <button>Donate</button>
      </div>
    `;
  }

  renderDonationCardContents() {
    return html`
    <div class="n3o-donation-form-card">
          ${
            this.data.showFrequencyFirst
              ? this.renderFrequencyFirst()
              : this.renderFundFirst()
          }
          ${
            this.shouldShowPriceHandles()
              ? html`<div class="n3o-donation-form-row">
                  <amount-selector
                    .onChange="${(amount: PriceHandleRes) => {
                      this._amount = amount;
                      if (amount) {
                        this._otherAmount = undefined;
                      }
                    }}"
                    .value="${this._amount}"
                    .priceHandles="${this._frequency === DonationType.Single
                      ? this._option?.fund?.singlePriceHandles
                      : this._option?.fund?.regularPriceHandles}"
                  ></amount-selector>
                </div>`
              : null
          }

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
              .currency="${this.currencies.find((c) => c.selected)}"
              .currencies="${this.currencies}"
              .onCurrencyChange="${(selected: Currency) => {
                this.currencies = this.currencies.map((c) =>
                  c.text === selected
                    ? { ...c, selected: true }
                    : { ...c, selected: false },
                );
              }}"
            ></other-amount>
          </div>

          ${
            this.shouldPickFundDimensions()
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
                            .default="${this._option?.fund?.dimension1
                              ?.default}"
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
                            .default="${this._option?.fund?.dimension2
                              ?.default}"
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
                            .default="${this._option?.fund?.dimension3
                              ?.default}"
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
                            .default="${this._option?.fund?.dimension4
                              ?.default}"
                          ></fund-dimension>
                        </div>`
                      : undefined}
                  </div>
                `
              : undefined
          }

          <div class="n3o-donation-form-row">
            <donate-button
              .saving="${this._saving}"
              .onClick="${() => this.donate()}"
            ></donate-button>
          </div>

          ${
            this.data.footerText
              ? html`<div class="n3o-donation-form-footer">
                  ${this.data.footerText}
                </div>`
              : undefined
          }
        </div>
      </div>`;
  }

  render() {
    if (this._loading) {
      // TODO: style
      return html`<donation-form-loading></donation-form-loading>`;
    }

    //language=HTML
    return html`
      <div
        id="n3o-donation-form-${this.data.formId}"
        class="${this.type === DonationFormType.Quick
          ? "n3o-quick-donate-form"
          : ""}"
      >
        ${this._error ? html`<error-modal></error-modal>` : undefined}

        <div class="n3o-donation-form-title">
          ${this.formTitle.toUpperCase()}
        </div>

        ${this.type === DonationFormType.Full
          ? html`
              <div class="n3o-donation-form-card">
                ${this.renderDonationCardContents()}
              </div>
            `
          : this.renderQuickDonationContents()}
      </div>
    `;
  }
}
