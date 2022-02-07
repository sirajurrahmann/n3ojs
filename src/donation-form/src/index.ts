import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import Cookies from "js-cookie";
import { donationFormStyles } from "./styles/donationFormStyles";
import {
  AllocationType,
  CurrencyRes,
  DonationItemRes,
  DonationOptionRes,
  FixedOrDefaultFundDimensionValueRes,
  FundDimensionValueRes,
  FundStructureRes,
  GivingClient,
  NamedLookupRes,
  PriceHandleRes,
  SponsorshipSchemeRes,
} from "@n3oltd/umbraco-giving-client";
import { AddToCartReq, CartClient, GivingType, MoneyReq } from "@n3oltd/umbraco-cart-client";
import { ApiErrorResponse, DonationFormType } from "./types";

import "./components/FundSelector";
import "./components/Loading";
import "./components/FrequencySelector";
import "./components/AmountSelector";
import "./components/OtherAmount";
import "./components/FundDimension";
import "./components/DonateButton";
import "./components/Quick/QuickDonationType";

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
  sponsorshipSchemes: SponsorshipSchemeRes[] = [];

  @property()
  formTitle: string = "";

  @property()
  currencies: CurrencyRes[] = [];

  @property()
  givingTypes: NamedLookupRes[] = [];

  @property()
  fundStructure?: FundStructureRes;

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
  _dimension1?: FundDimensionValueRes;

  @state()
  _dimension2?: FundDimensionValueRes;

  @state()
  _dimension3?: FundDimensionValueRes;

  @state()
  _dimension4?: FundDimensionValueRes;

  @state()
  _selectedCurrencyId?: string; // The currency ID, keep in sync with ID stored in cookies

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
              amount: this._amount?.amount,
              currency: "GBP", // TODO: use this._amount.currencyValues
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

  getDonationForm(fundStructure: FundStructureRes | void) {
    const client = new GivingClient(this.data.baseUrl);
    return client
      .getDonationForm(this.data.formId)
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
    const client = new GivingClient(this.data.baseUrl);
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
    const client = new GivingClient(this.data.baseUrl);
    return client
      .getLookupDonationItems()
      .then((res) => {
        this.donationItems = res || [];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFundStructure(): Promise<void | FundStructureRes> {
    const client = new GivingClient(this.data.baseUrl);
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
    const client = new GivingClient(this.data.baseUrl);
    return client
      .getLookupSponsorshipSchemes()
      .then((res) => {
        this.sponsorshipSchemes = res || [];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCurrencies() {
    const client = new GivingClient(this.data.baseUrl);
    return client
      .getLookupCurrencies()
      .then((res) => {
        this.currencies = res || [];

        // Currency should have already been set in the Cookies by previous requests, it is
        // included as a header all responses from Umbraco.
        const currentCurrency = Cookies.get("Currency");
        if (currentCurrency) {
          this._selectedCurrencyId = currentCurrency;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  shouldShowPriceHandles(): boolean {
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

  shouldShowDimension(dim?: FixedOrDefaultFundDimensionValueRes): boolean {
    if (!dim) return false;
    else return !dim.fixed;
  }

  selectedOptionIsFixed(): boolean {
    // Returns boolean depending on whether the amount of the item is fixed ("locked")

    // Logic here is - if the item has a price and the price is locked, return true
    // Otherwise return false
    // If there is a price but it is NOT fixed, then it will have been set
    // as the _otherAmount value when the donor changed the fund.

    let pricing;
    if (this._option?.type === AllocationType.Fund) {
      pricing = this.donationItems.find((d) => d.id === this._option?.fund?.donationItem)?.pricing;
    } else {
      pricing = this.sponsorshipSchemes
        .find((s) => s.id === this._option?.sponsorship)
        ?.components?.find((c) => c.mandatory)?.pricing;
    }
    return !!pricing?.locked;
  }

  getFixedOtherAmount(option: DonationOptionRes): MoneyReq | undefined {
    // Logic here is: If the option has a price (whether it is locked or not), return it.
    let pricing;
    if (option.type === AllocationType.Fund) {
      pricing = this.donationItems.find((d) => d.id === option.fund?.donationItem)?.pricing;
    } else {
      pricing = this.sponsorshipSchemes
        .find((s) => s.id === option.sponsorship)
        ?.components?.find((c) => c.mandatory)?.pricing;
    }
    if (pricing?.amount)
      return {
        amount: pricing.amount,
        currency: "GBP", // TODO: Use correct currency amounts from pricing.currencyValues
      };
    return undefined;
  }

  fundsCanBeInferred(opt: DonationOptionRes, fundStructure: FundStructureRes | void): boolean {
    if (!fundStructure) return false;

    let canBeInferred = true;
    if (
      fundStructure?.dimension1?.isActive &&
      !(opt.dimension1?.default || opt.dimension1?.fixed)
    ) {
      canBeInferred = false;
    }
    if (
      fundStructure?.dimension2?.isActive &&
      !(opt.dimension2?.default || opt.dimension2?.fixed)
    ) {
      canBeInferred = false;
    }
    if (
      fundStructure?.dimension3?.isActive &&
      !(opt.dimension3?.default || opt.dimension3?.fixed)
    ) {
      canBeInferred = false;
    }
    if (
      fundStructure?.dimension4?.isActive &&
      !(opt.dimension4?.default || opt.dimension4?.fixed)
    ) {
      canBeInferred = false;
    }

    return canBeInferred;
  }

  setCurrency(currencyId: string) {
    this._selectedCurrencyId = currencyId;

    // Calling this enpoint will set the cookie on the response headers
    const client = new GivingClient(this.data.baseUrl);
    client.setCurrency(currencyId).catch((err) => {
      console.log(err);
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      this.getFundStructure()
        .then((fundStructure: FundStructureRes | void) => {
          return Promise.all([
            this.getGivingTypes(),
            this.getDonationItems(),
            this.getSponsorshipSchemes(),
            this.getDonationForm(fundStructure),
            this.getCurrencies(),
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
            .onCurrencyChange="${(currency: CurrencyRes) => {
              if (currency?.id) {
                this.setCurrency(currency.id);
              }
            }}"
            .onChange="${(amount?: MoneyReq) => {
              this._otherAmount = amount;
              if (amount) {
                this._amount = undefined;
              }
            }}"
            .value="${this._otherAmount}"
            .fixed="${this.selectedOptionIsFixed()}"
            .showCurrencyText="${this.data.showCurrencyText}"
            .selectedCurrencyId="${this._selectedCurrencyId}"
            .currencies="${this.currencies}"
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
                    .selectedCurrencyId="${this._selectedCurrencyId}"
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
             .onCurrencyChange="${(currency: CurrencyRes) => {
               if (currency?.id) {
                 this.setCurrency(currency.id);
               }
             }}"
            .onChange="${(amount?: MoneyReq) => {
              this._otherAmount = amount;
              if (amount) {
                this._amount = undefined;
              }
            }}"
              .value="${this._otherAmount}"
              .showCurrencyText="${this.data.showCurrencyText}"
              .selectedCurrencyId="${this._selectedCurrencyId}"
              .currencies="${this.currencies}"
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
                            .onChange="${(dim?: FundDimensionValueRes) => (this._dimension1 = dim)}"
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
                            .onChange="${(dim?: FundDimensionValueRes) => (this._dimension2 = dim)}"
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
                            .onChange="${(dim?: FundDimensionValueRes) => (this._dimension3 = dim)}"
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
                            .onChange="${(dim?: FundDimensionValueRes) => (this._dimension4 = dim)}"
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
