import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  DonationOptionRes,
  FixedOrDefaultFundDimensionOptionRes,
} from "@n3oltd/umbraco-donations-client/src/index";
import { donationFormStyles } from "./styles/donationFormStyles";
import { DonationsClient, PriceHandleRes } from "@n3oltd/umbraco-donations-client";
import {
  AllocationsClient,
  DonationItemRes,
  NamedLookupRes,
} from "@n3oltd/umbraco-allocations-client";
import { AddToCartReq, CartClient, GivingType, MoneyReq } from "@n3oltd/umbraco-cart-client";
import { ApiErrorResponse, DonationFormType } from "./types";
import {
  FundDimensionOptionRes,
  FundStructure,
} from "@n3oltd/umbraco-allocations-client/src/index";

import "./components/FundSelector";
import "./components/Loading";
import "./components/FrequencySelector";
import "./components/AmountSelector";
import "./components/OtherAmount";
import "./components/FundDimension";
import "./components/DonateButton";
import "./components/Quick/QuickGivingType";

@customElement("data-donation-form")
class DonationForm extends LitElement {
  static styles = [donationFormStyles];

  @property({ attribute: false })
  data: {
    baseUrl: string;
    formId: string;
    mode: DonationFormType;
    showFrequencyFirst: boolean;
    showCurrencyText?: boolean;
    footerText?: string;
  } = {
    baseUrl: "",
    formId: "",
    mode: DonationFormType.Full,
    showFrequencyFirst: false,
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

  // TODO: should come from API
  @property()
  currencies = [
    { symbol: "£", text: "GBP", selected: true },
    { symbol: "€", text: "EUR", selected: false },
  ];

  @property()
  givingTypes: NamedLookupRes[] = [];

  @property()
  fundStructure?: FundStructure;

  @state()
  _loading: boolean = true;

  @state()
  _givingType: GivingType = GivingType.Donation;

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
      givingType: this._givingType,
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
        dimension1: this._dimension1?.id,
        dimension2: this._dimension2?.id,
        dimension3: this._dimension3?.id,
        dimension4: this._dimension4?.id,
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

  quickDonate() {
    console.log("quick donate");
  }

  getDonationForm(fundStructure: FundStructure | void) {
    const client = new DonationsClient(this.data.baseUrl);
    return client
      .getForm(this.data.formId)
      .then((res) => {
        this.options =
          this.type === DonationFormType.Full
            ? res.options || []
            : res.options?.filter?.((opt) => this.fundsCanBeInferred(opt, fundStructure)) || [];
        this.formTitle = res.title || "Donate Now";
        this._option = res.options?.[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getGivingTypes() {
    const client = new AllocationsClient(this.data.baseUrl);
    return client
      .getLookupGivingTypes()
      .then((res) => {
        this.givingTypes = res || [];
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

  getFundStructure(): Promise<void | FundStructure> {
    const client = new AllocationsClient(this.data.baseUrl);
    return client
      .getFundStructure()
      .then((res) => {
        this.fundStructure = res || [];
        return res;
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

    if (this._givingType === GivingType.Donation)
      return this._option?.sponsorship
        ? false
        : Boolean(this._option?.fund?.donationPriceHandles?.length);
    if (this._givingType === GivingType.RegularGiving)
      return this._option?.sponsorship
        ? false
        : Boolean(this._option?.fund?.regularGivingPriceHandles?.length);
    return false;
  }

  shouldPickFundDimensions(): boolean {
    if (!this._option) return false;
    else {
      let shouldPick = false;
      // If any of the dimensions have a default but are not fixed, donor needs to pick
      if (this._option.dimension1?.default && !this._option.dimension1?.fixed) shouldPick = true;

      if (this._option.dimension2?.default && !this._option.dimension2?.fixed) shouldPick = true;

      if (this._option.dimension3?.default && !this._option.dimension3?.fixed) shouldPick = true;

      if (this._option.dimension4?.default && !this._option.dimension4?.fixed) shouldPick = true;

      return shouldPick;
    }
  }

  shouldShowDimension(dim?: FixedOrDefaultFundDimensionOptionRes): boolean {
    if (!dim) return false;
    else return !dim.fixed;
  }

  selectedOptionIsFixed(): boolean {
    // TODO: Fix when response includes this info
    // Returns boolean depending on whether the amount of the item is fixed ("locked")

    // Logic here is - if the item has a price and the price is locked, return true
    // Otherwise return false
    // If there is a price but it is NOT fixed, then it will have been set
    // as the _otherAmount value when the donor changed the fund.
    return false;
  }

  getFixedOtherAmount(option: DonationOptionRes): MoneyReq | undefined {
    // TODO: Fix when response includes this info
    // Logic here is: If the option has a price (whether it is locked or not), return it. Otherwise undefined.
    return undefined;
  }

  fundsCanBeInferred(opt: DonationOptionRes, fundStructure: FundStructure | void): boolean {
    if (!fundStructure) return false;

    let canBeInferred = true;
    if (
      fundStructure?.dimension1?.isActive &&
      !(opt.fund?.dimension1?.default || opt.fund?.dimension1?.fixed)
    ) {
      canBeInferred = false;
    }
    if (
      fundStructure?.dimension2?.isActive &&
      !(opt.fund?.dimension2?.default || opt.fund?.dimension2?.fixed)
    ) {
      canBeInferred = false;
    }
    if (
      fundStructure?.dimension3?.isActive &&
      !(opt.fund?.dimension3?.default || opt.fund?.dimension3?.fixed)
    ) {
      canBeInferred = false;
    }
    if (
      fundStructure?.dimension4?.isActive &&
      !(opt.fund?.dimension4?.default || opt.fund?.dimension4?.fixed)
    ) {
      canBeInferred = false;
    }

    return canBeInferred;
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      this.getFundStructure()
        .then((fundStructure: FundStructure | void) => {
          return Promise.all([
            this.getGivingTypes(),
            this.getDonationItems(),
            this.getSponsorshipSchemes(),
            this.getDonationForm(fundStructure),
          ]);
        })
        .then(() => {
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
            .singleText="${this.givingTypes.find((d) => d.id === GivingType.Donation)?.name}"
            .regularText="${this.givingTypes.find((d) => d.id === GivingType.RegularGiving)?.name}"
            .onChange="${(frequency: GivingType) => (this._givingType = frequency)}"
            .selected="${this._givingType}"
            .disableRegular="${this._option?.type === "fund"
              ? this._option?.hideRegularGiving
              : false}"
          ></frequency-selector>
        </div>

        <div class="n3o-donation-form-row">
          <fund-selector
            .variation="${DonationFormType.Full}"
            .donationItems="${this.donationItems}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
              this._otherAmount = this.getFixedOtherAmount(option);
            }}"
            .value="${this._option}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .options="${this.options.filter((opt) => {
              return this._givingType === GivingType.Donation ? true : !opt.hideRegularGiving;
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
            .variation="${DonationFormType.Full}"
            .donationItems="${this.donationItems}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
            }}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .options="${this.options.filter((opt) => {
              return this._givingType === GivingType.Donation ? true : !opt.hideRegularGiving;
            })}"
            .value="${this._option}"
          ></fund-selector>
        </div>

        <div class="n3o-donation-form-row">
          <frequency-selector
            .singleText="${this.givingTypes.find((d) => d.id === GivingType.Donation)?.name}"
            .regularText="${this.givingTypes.find((d) => d.id === GivingType.RegularGiving)?.name}"
            .onChange="${(frequency: GivingType) => (this._givingType = frequency)}"
            .selected="${this._givingType}"
            disableRegular="${this._option?.type === "fund"
              ? this._option?.hideRegularGiving
              : false}"
          ></frequency-selector>
        </div>
      </div>
    `;
  }

  renderQuickDonationContents() {
    //language=html
    return html`
      <div class="n3o-quick-donate-form-selects">
        <div class="n3o-quick-donate-col">
          <quick-donation-type
            .onChange="${(t: GivingType) => (this._givingType = t)}"
            .value="${this._givingType}"
            .options="${this.givingTypes}"
          ></quick-donation-type>
        </div>

        <div class="n3o-quick-donate-col">
          <fund-selector
            .variation="${DonationFormType.Quick}"
            .donationItems="${this.donationItems}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
            }}"
            .options="${this.options}"
            .value="${this._option}"
          ></fund-selector>
        </div>

        <div class="n3o-quick-donate-col">
          <other-amount
            .onChange="${(amount?: MoneyReq) => {
              this._otherAmount = amount;
              if (amount) {
                this._amount = undefined;
              }
            }}"
            .value="${this._otherAmount}"
            .fixed="${this.selectedOptionIsFixed()}"
            .showCurrencyText="${this.data.showCurrencyText}"
            .currency="${this.currencies.find((c) => c.selected)}"
            .currencies="${this.currencies}"
            .onCurrencyChange="${(selected: string) => {
              this.currencies = this.currencies.map((c) =>
                c.text === selected ? { ...c, selected: true } : { ...c, selected: false },
              );
            }}"
          ></other-amount>
        </div>

        <div class="n3o-quick-donate-col">
          <donate-button
            .saving="${this._saving}"
            .onClick="${() => this.quickDonate()}"
          ></donate-button>
        </div>
      </div>
    `;
  }

  renderDonationCardContents() {
    //language=html
    return html`
    <div>
          ${this.data.showFrequencyFirst ? this.renderFrequencyFirst() : this.renderFundFirst()}
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
                    .priceHandles="${this._givingType === GivingType.Donation
                      ? this._option?.fund?.donationPriceHandles
                      : this._option?.fund?.regularGivingPriceHandles}"
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
              .onCurrencyChange="${(selected: any) => {
                // TODO: change any type
                this.currencies = this.currencies.map((c) =>
                  c.text === selected ? { ...c, selected: true } : { ...c, selected: false },
                );
              }}"
            ></other-amount>
          </div>

          ${
            this.shouldPickFundDimensions()
              ? html`
                  <div>
                    ${this.shouldShowDimension(this._option?.dimension1) &&
                    this.fundStructure?.dimension1?.isActive
                      ? html`<div class="n3o-donation-form-row">
                          <fund-dimension
                            .baseUrl="${this.data.baseUrl}"
                            .dimensionNumber="${1}"
                            .value="${this._dimension1}"
                            .onChange="${(dim?: FundDimensionOptionRes) =>
                              (this._dimension1 = dim)}"
                            .default="${this._option?.dimension1?.default}"
                          ></fund-dimension>
                        </div>`
                      : undefined}
                    ${this.shouldShowDimension(this._option?.dimension2) &&
                    this.fundStructure?.dimension2?.isActive
                      ? html`<div class="n3o-donation-form-row">
                          <fund-dimension
                            .baseUrl="${this.data.baseUrl}"
                            .dimensionNumber="${2}"
                            .value="${this._dimension2}"
                            .onChange="${(dim?: FundDimensionOptionRes) =>
                              (this._dimension1 = dim)}"
                            .default="${this._option?.dimension2?.default}"
                          ></fund-dimension>
                        </div>`
                      : undefined}
                    ${this.shouldShowDimension(this._option?.dimension3) &&
                    this.fundStructure?.dimension3?.isActive
                      ? html`<div class="n3o-donation-form-row">
                          <fund-dimension
                            .baseUrl="${this.data.baseUrl}"
                            .dimensionNumber="${3}"
                            .value="${this._dimension3}"
                            .onChange="${(dim?: FundDimensionOptionRes) =>
                              (this._dimension1 = dim)}"
                            .default="${this._option?.dimension3?.default}"
                          ></fund-dimension>
                        </div>`
                      : undefined}
                    ${this.shouldShowDimension(this._option?.dimension4) &&
                    this.fundStructure?.dimension4?.isActive
                      ? html`<div class="n3o-donation-form-row">
                          <fund-dimension
                            .baseUrl="${this.data.baseUrl}"
                            .dimensionNumber="${4}"
                            .value="${this._dimension4}"
                            .onChange="${(dim?: FundDimensionOptionRes) =>
                              (this._dimension1 = dim)}"
                            .default="${this._option?.dimension4?.default}"
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
              ? html`<div class="n3o-donation-form-footer">${this.data.footerText}</div>`
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
        class="${this.type === DonationFormType.Quick ? "n3o-quick-donate-form" : ""}"
      >
        ${this._error ? html`<error-modal></error-modal>` : undefined}

        <div
          class="n3o-donation-form-title ${this.type === DonationFormType.Quick
            ? "n3o-quick-donate-title"
            : ""}"
        >
          ${this.formTitle.toUpperCase()}
        </div>

        ${this.type === DonationFormType.Full
          ? html` <div class="n3o-donation-form-card">${this.renderDonationCardContents()}</div> `
          : this.renderQuickDonationContents()}
      </div>
    `;
  }
}
