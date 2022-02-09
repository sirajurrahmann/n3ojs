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
  SponsorshipDuration,
  SponsorshipDurationRes,
  SponsorshipSchemeRes,
} from "@n3oltd/umbraco-giving-client";
import { AddToCartReq, CartClient, GivingType, MoneyReq } from "@n3oltd/umbraco-giving-cart-client";
import { ApiErrorResponse, DonationFormType, IconDefinitions } from "./types";
import { DonationFormHelpers } from "./helpers";

import "./components/FundSelector";
import "./components/Loading";
import "./components/FrequencySelector";
import "./components/AmountSelector";
import "./components/OtherAmount";
import "./components/FundDimension";
import "./components/DonateButton";
import "./components/SponsorshipDuration";
import "./components/Quick/QuickDonationType";
import defaultIcons from "./config/icons";

@customElement("data-donation-form")
class DonationForm extends LitElement {
  static styles = [donationFormStyles];

  @property({ attribute: false })
  data: {
    baseUrl: string;
    formId: string;
    mode: DonationFormType;
    icons?: IconDefinitions;

    // If true, first 2 rows of Donation Form are:
    // 1) Frequency (One Off/Regular), 2) Fund choice
    // else 1) Fund Choice, 2) Frequency (One Off/Regular)
    showFrequencyFirst: boolean;

    // If true, after the frequency and fund rows, show
    // 1) Fund Dimension choices, if necessary 2) Amount selector
    // else 1) Amount selector, 2) Fund Dimension choices, if necessary
    showFundDimensionsFirst: boolean;

    showCurrencyText?: boolean;
    footerText?: string;
  } = {
    baseUrl: "",
    formId: "",
    mode: DonationFormType.Full,
    showFrequencyFirst: false,
    showCurrencyText: false,
    showFundDimensionsFirst: false,
    footerText: "",
    icons: defaultIcons,
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
  _otherAmountLocked: boolean = false;

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
  _duration?: SponsorshipDurationRes;

  @state()
  _quantity: number = 1;

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

    const client = new CartClient(this.data.baseUrl);

    const req: AddToCartReq = {
      givingType: this._givingType,
      allocation: {
        type: this._option.type,
        value: DonationFormHelpers.getDonationValue(
          1,
          this._selectedCurrencyId || "",
          this._otherAmount,
          this._amount,
        ),
        fundDimensions: {
          dimension1: this._dimension1?.id,
          dimension2: this._dimension2?.id,
          dimension3: this._dimension3?.id,
          dimension4: this._dimension4?.id,
        },
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
                duration:
                  this._givingType === GivingType.Donation
                    ? (this._duration?.id as SponsorshipDuration)
                    : undefined,
                components: [
                  {
                    component: DonationFormHelpers.getMandatoryComponent(
                      this.sponsorshipSchemes,
                      this._option.sponsorship?.scheme,
                    )?.id,
                    // Currently the component value is the value of the whole donation because we only support the 1 mandatory component
                    value: DonationFormHelpers.getDonationValue(
                      this._duration?.months || 1,
                      this._selectedCurrencyId || "",
                      this._otherAmount,
                      this._amount,
                    ),
                  },
                ],
              }
            : undefined,
      },
      quantity: this._quantity || 1,
    };

    this._saving = true;

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

        this.updateFundDimensions(this._option);
        this.setOtherAmount(this._option);
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
    // Don't show price handles for sponsorships
    // If we're dealing with a donation item and the item has a price (or a pricing rule matches)
    // then we should not show price handles

    // NB. Technically the check of whether a donation has price is redundant - if the donation item had
    // a price/pricing rules, should never have been allowed to configure price handles in Umbraco anyway.

    if (this._givingType === GivingType.Donation)
      return this._option?.sponsorship
        ? false
        : !this.donationHasPrice(this._option?.fund?.donationItem) &&
            Boolean(this._option?.fund?.donationPriceHandles?.length);
    if (this._givingType === GivingType.RegularGiving)
      return this._option?.sponsorship
        ? false
        : !this.donationHasPrice(this._option?.fund?.donationItem) &&
            Boolean(this._option?.fund?.regularGivingPriceHandles?.length);
    return false;
  }

  donationHasPrice(donationItem?: string): boolean {
    const item = this.donationItems.find((d) => d.id === donationItem);

    if (
      item?.pricing?.amount ||
      Boolean(
        DonationFormHelpers.getMatchingPricingRule(item?.pricing?.priceRules || [], {
          dimension1: this._dimension1,
          dimension2: this._dimension2,
          dimension3: this._dimension3,
          dimension4: this._dimension4,
        }),
      )
    )
      return true;

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

  setOtherAmount(option?: DonationOptionRes): void {
    if (!option) return;

    // Invoked when the fund is changed.
    // Also invoked when the currency is changed, so that if there is a matching rule, the value is updated to the new currency value

    // This function assumes that the new fund dimensions values have already been set after the fund has been changed.

    // This function sets the _otherAmount field (if it can) and also the _otherAmountLocked

    // We need to check whether the fund dimensions which are initially selected for this fund match
    // any pricing rules, and if not we can also consider the fallback price on the donation item too.

    // If there are price handles we can exit early - there would never be price handles AND a set price
    // on the donation item.

    // If there are price handles then there cannot also be a price on the donation item,
    // so unLock any amount previously entered by the user.
    if (option?.type === AllocationType.Fund) {
      if (this._givingType === GivingType.Donation) {
        if (option.fund?.donationPriceHandles?.length) {
          this._otherAmountLocked = false;
          return;
        }
      } else {
        if (option.fund?.regularGivingPriceHandles?.length) {
          this._otherAmountLocked = false;
          return;
        }
      }
    } else {
      // Sponsorships do not have price handles anyway so nothing to check here.
    }

    const pricing = DonationFormHelpers.getPricing(
      option,
      this.donationItems,
      this.sponsorshipSchemes,
    );

    if (pricing) {
      const matchingPricingRule = DonationFormHelpers.getMatchingPricingRule(
        pricing?.priceRules || [],
        {
          dimension1: this._dimension1,
          dimension2: this._dimension2,
          dimension3: this._dimension3,
          dimension4: this._dimension4,
        },
      );

      if (matchingPricingRule && this._selectedCurrencyId) {
        this._otherAmount = matchingPricingRule.currencyValues?.[this._selectedCurrencyId];
        this._otherAmountLocked = matchingPricingRule.locked || false;
      } else {
        if (pricing?.amount && this._selectedCurrencyId) {
          this._otherAmount = pricing.currencyValues?.[this._selectedCurrencyId];
          this._otherAmountLocked = pricing?.locked || false;
        }
      }
    } else {
      // If no pricing on the donation item, we can leave the amount (if someone entered it before)
      // but now the amount will definitely not be fixed
      this._otherAmountLocked = false;
    }
  }

  updateFundDimensions(option?: DonationOptionRes): void {
    // Invoked when the fund is changed, updates the fund dimensions to the defaults for this
    // option, or leaves them as whatever was previously selected.
    if (option?.dimension1?.default) {
      this._dimension1 = option?.dimension1.default;
    }
    if (option?.dimension2?.default) {
      this._dimension2 = option?.dimension2.default;
    }
    if (option?.dimension3?.default) {
      this._dimension3 = option?.dimension3.default;
    }
    if (option?.dimension4?.default) {
      this._dimension4 = option?.dimension4.default;
    }
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

  canShowAmountFirst(): boolean {
    // If there are no pricing rules, we can show the amount selectors first
    // instead of the fund dimensions first, but if there ARE pricing rules,
    // then we have to show the fund dimensions first otherwise we will get the amount
    // changing when the donor changes the fund dims which would be weird

    if (this._option) {
      if (this._option.type === AllocationType.Fund) {
        const donationItem = this.donationItems.find(
          (d) => d.id === this._option?.fund?.donationItem,
        );
        if (!donationItem?.pricing?.priceRules?.length) {
          return true;
        }
      } else if (this._option.type === AllocationType.Sponsorship) {
        // Assume we have just 1 mandatory component, deal with this for now, later
        // support will be added for multiple components
        const component = DonationFormHelpers.getMandatoryComponent(
          this.sponsorshipSchemes,
          this._option?.sponsorship?.scheme,
        );
        if (!component?.pricing?.priceRules?.length) {
          return true;
        }
      }
    }

    return false;
  }

  setCurrency(currencyId: string) {
    this._selectedCurrencyId = currencyId;

    // Calling this enpoint will set the cookie on the response headers
    const client = new GivingClient(this.data.baseUrl);
    client.setCurrency(currencyId).catch((err) => {
      console.log(err);
    });
  }

  getTheme(): string {
    let themeDim;
    if (this.fundStructure?.dimension1?.id === "theme") themeDim = this.fundStructure?.dimension1;
    if (this.fundStructure?.dimension2?.id === "theme") themeDim = this.fundStructure?.dimension2;
    if (this.fundStructure?.dimension3?.id === "theme") themeDim = this.fundStructure?.dimension3;
    if (this.fundStructure?.dimension4?.id === "theme") themeDim = this.fundStructure?.dimension4;

    // This is used to get the sponsorship theme e.g. "Orphans".
    // We assume that the sponsorship only has one theme option set.
    return themeDim?.options?.[0]?.name || "";
  }

  connectedCallback() {
    super.connectedCallback();

    // Wait till event loop empty
    setTimeout(() => {
      let fs: FundStructureRes | void;
      this.getFundStructure()
        .then((fundStructure: FundStructureRes | void) => {
          fs = fundStructure;
          return Promise.all([
            this.getGivingTypes(),
            this.getDonationItems(),
            this.getSponsorshipSchemes(),
            this.getCurrencies(),
          ]);
        })
        .then(() => {
          return this.getDonationForm(fs);
        })
        .then(() => {
          this._loading = false;
        });
    });
  }

  renderFundDimensions() {
    return html`
      <div>
        ${this.shouldShowDimension(this._option?.dimension1) &&
        this.fundStructure?.dimension1?.isActive
          ? html`<div class="n3o-donation-form-row">
              <fund-dimension
                .baseUrl="${this.data.baseUrl}"
                .dimensionNumber="${1}"
                .value="${this._dimension1}"
                .onChange="${(dim?: FundDimensionValueRes) => {
                  this._dimension1 = dim;
                  this.setOtherAmount(this._option);
                }}"
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
                .onChange="${(dim?: FundDimensionValueRes) => {
                  this._dimension2 = dim;
                  this.setOtherAmount(this._option);
                }}"
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
                .onChange="${(dim?: FundDimensionValueRes) => {
                  this._dimension3 = dim;
                  this.setOtherAmount(this._option);
                }}"
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
                .onChange="${(dim?: FundDimensionValueRes) => {
                  this._dimension4 = dim;
                  this.setOtherAmount(this._option);
                }}"
                .default="${this._option?.dimension4?.default}"
              ></fund-dimension>
            </div>`
          : undefined}
      </div>
    `;
  }

  renderPriceHandles() {
    return html`<div class="n3o-donation-form-row">
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
    </div>`;
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
              this.updateFundDimensions(option);
              this.setOtherAmount(option);
            }}"
            .fixedAmount="${this._otherAmountLocked && this._otherAmount
              ? this._otherAmount
              : undefined}"
            .value="${this._option}"
            .selectedCurrencyId="${this._selectedCurrencyId}"
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
            .selectedCurrencyId="${this._selectedCurrencyId}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
              this.updateFundDimensions(option);
              this.setOtherAmount(option);
            }}"
            .fixedAmount="${this._otherAmountLocked && this._otherAmount
              ? this._otherAmount
              : undefined}"
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
            .selectedCurrencyId="${this._selectedCurrencyId}"
            .sponsorshipSchemes="${this.sponsorshipSchemes}"
            .onChange="${(option: DonationOptionRes) => {
              this._option = option;
              this.updateFundDimensions(option);
              this.setOtherAmount(option);
            }}"
            .fixedAmount="${this._otherAmountLocked && this._otherAmount
              ? this._otherAmount
              : undefined}"
            .showFixedAmountInOption="${true}"
            .options="${this.options}"
            .value="${this._option}"
          ></fund-selector>
        </div>

        <div class="n3o-quick-donate-col">
          <other-amount
            .onCurrencyChange="${(currency: CurrencyRes) => {
              if (currency?.id) {
                this.setCurrency(currency.id);
                this.setOtherAmount(this._option);
              }
            }}"
            .onChange="${(amount?: MoneyReq) => {
              this._otherAmount = amount;
              if (amount) {
                this._amount = undefined;
              }
            }}"
            .showQuantitySelector="${this._otherAmountLocked}"
            .showDurationSelector="${this._option?.type === "sponsorship" &&
            this._givingType !== GivingType.RegularGiving}"
            .baseUrl="${this.data.baseUrl}"
            .duration="${this._duration}"
            .onChangeDuration="${(v?: SponsorshipDurationRes) => (this._duration = v)}"
            .quantity="${this._quantity}"
            .onChangeQuantity="${(v: number) => (this._quantity = v)}"
            .value="${this._otherAmount}"
            .fixed="${this._otherAmountLocked}"
            .showCurrencyText="${this.data.showCurrencyText &&
            this.data.mode === DonationFormType.Full}"
            .selectedCurrencyId="${this._selectedCurrencyId}"
            .currencies="${this.currencies}"
          ></other-amount>
        </div>

        <div class="n3o-quick-donate-col">
          <donate-button
            .saving="${this._saving}"
            .onClick="${() => this.donate()}"
            .iconName="${this.data.icons?.donateButton.icon}"
            .iconVariety="${this.data.icons?.donateButton.variety}"
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
            !this.data.showFundDimensionsFirst && this.canShowAmountFirst()
              ? html`<div>
                  ${this.shouldShowPriceHandles() ? this.renderPriceHandles() : null}

                  <div class="n3o-donation-form-row">
                    <other-amount
                      .onCurrencyChange="${(currency: CurrencyRes) => {
                        if (currency?.id) {
                          this.setCurrency(currency.id);
                          this.setOtherAmount(this._option);
                        }
                      }}"
                      .onChange="${(amount?: MoneyReq) => {
                        this._otherAmount = amount;
                        if (amount) {
                          this._amount = undefined;
                        }
                      }}"
                      .baseUrl="${this.data.baseUrl}"
                      .duration="${this._duration}"
                      .onChangeDuration="${(v?: SponsorshipDurationRes) => (this._duration = v)}"
                      .quantity="${this._quantity}"
                      .onChangeQuantity="${(v: number) => (this._quantity = v)}"
                      .value="${this._otherAmount}"
                      .showQuantitySelector="${this._otherAmountLocked}"
                      .showCurrencyText="${this.data.showCurrencyText &&
                      this.data.mode === DonationFormType.Full}"
                      .selectedCurrencyId="${this._selectedCurrencyId}"
                      .currencies="${this.currencies}"
                      .fixed="${this._otherAmountLocked}"
                    ></other-amount>
                  </div>

                  ${this._option?.type === "sponsorship" &&
                  this._givingType !== GivingType.RegularGiving
                    ? html`<div class="n3o-donation-form-row">
                        <sponsorship-duration
                          .givingType="${this._givingType}"
                          .currencies="${this.currencies}"
                          .theme="${this.getTheme()}"
                          .value="${this._duration}"
                          .quantity="${this._quantity}"
                          .onChange="${(v?: SponsorshipDurationRes) => (this._duration = v)}"
                          .baseUrl="${this.data.baseUrl}"
                          .amount="${this._otherAmount ||
                          this._amount?.currencyValues?.[this._selectedCurrencyId || ""]}"
                        ></sponsorship-duration>
                      </div>`
                    : null}
                  ${this.shouldPickFundDimensions() ? this.renderFundDimensions() : undefined}
                </div>`
              : html`<div>
                  ${this.shouldPickFundDimensions() ? this.renderFundDimensions() : undefined}
                  ${this.shouldShowPriceHandles() ? this.renderPriceHandles() : null}

                  <div class="n3o-donation-form-row">
                    <other-amount
                      .baseUrl="${this.data.baseUrl}"
                      .duration="${this._duration}"
                      .onChangeDuration="${(v?: SponsorshipDurationRes) => (this._duration = v)}"
                      .onCurrencyChange="${(currency: CurrencyRes) => {
                        if (currency?.id) {
                          this.setCurrency(currency.id);
                          this.setOtherAmount(this._option);
                        }
                      }}"
                      .onChange="${(amount?: MoneyReq) => {
                        this._otherAmount = amount;
                        if (amount) {
                          this._amount = undefined;
                        }
                      }}"
                      .showQuantitySelector="${this._otherAmountLocked}"
                      .quantity="${this._quantity}"
                      .onChangeQuantity="${(v: number) => (this._quantity = v)}"
                      .value="${this._otherAmount}"
                      .showCurrencyText="${this.data.showCurrencyText &&
                      this.data.mode === DonationFormType.Full}"
                      .selectedCurrencyId="${this._selectedCurrencyId}"
                      .currencies="${this.currencies}"
                      .fixed="${this._otherAmountLocked}"
                    ></other-amount>
                  </div>

                  ${this._option?.type === "sponsorship"
                    ? html`<div class="n3o-donation-form-row">
                        <sponsorship-duration
                          .givingType="${this._givingType}"
                          .currencies="${this.currencies}"
                          .quantity="${this._quantity}"
                          .theme="${this.getTheme()}"
                          .value="${this._duration}"
                          .onChange="${(v?: SponsorshipDurationRes) => (this._duration = v)}"
                          .baseUrl="${this.data.baseUrl}"
                          .amount="${this._otherAmount ||
                          this._amount?.currencyValues?.[this._selectedCurrencyId || ""]}"
                        ></sponsorship-duration>
                      </div>`
                    : null}
                </div>`
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
