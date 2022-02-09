import {
  AllocationType,
  DonationItemRes,
  DonationOptionRes,
  FundDimensionValueRes,
  PriceHandleRes,
  PricingRes,
  PricingRuleRes,
  SponsorshipComponentRes,
  SponsorshipSchemeRes,
} from "@n3oltd/umbraco-giving-client";
import { MoneyReq } from "@n3oltd/umbraco-giving-cart-client";

export class DonationFormHelpers {
  public static getPricing(
    option: DonationOptionRes,
    donationItems: DonationItemRes[],
    sponsorshipSchemes: SponsorshipSchemeRes[],
  ): PricingRes | undefined {
    let pricing;
    if (option.type === AllocationType.Fund) {
      pricing = donationItems.find((d) => d.id === option.fund?.donationItem)?.pricing;
    } else {
      pricing = DonationFormHelpers.getMandatoryComponent(
        sponsorshipSchemes,
        option.sponsorship?.scheme,
      )?.pricing;
    }
    return pricing;
  }

  public static getMatchingPricingRule(
    rules: PricingRuleRes[],
    currentDimensions: {
      dimension1?: FundDimensionValueRes;
      dimension2?: FundDimensionValueRes;
      dimension3?: FundDimensionValueRes;
      dimension4?: FundDimensionValueRes;
    },
  ): PricingRuleRes | undefined {
    return rules.find((r) => {
      return (
        (r.fundDimensions?.dimension1
          ? r.fundDimensions?.dimension1 === currentDimensions.dimension1?.id
          : true) &&
        (r.fundDimensions?.dimension2
          ? r.fundDimensions?.dimension2 === currentDimensions.dimension2?.id
          : true) &&
        (r.fundDimensions?.dimension3
          ? r.fundDimensions?.dimension3 === currentDimensions.dimension3?.id
          : true) &&
        (r.fundDimensions?.dimension4
          ? r.fundDimensions?.dimension4 === currentDimensions.dimension4?.id
          : true)
      );
    });
  }

  public static getMandatoryComponent(
    schemes: SponsorshipSchemeRes[],
    schemeId?: string,
  ): SponsorshipComponentRes | undefined {
    const spon = schemes.find((s) => s.id === schemeId);
    // Assume we have just 1 mandatory component, deal with this for now, later
    // support will be added for multiple components
    return spon?.components?.find((c) => c.mandatory);
  }

  public static getDonationValue(
    multiplier: number,
    currencyId: string,
    userSelectedAmount?: MoneyReq,
    selectedPriceHandle?: PriceHandleRes,
  ) {
    // Gets the value
    if (userSelectedAmount) {
      return {
        currency: userSelectedAmount.currency,
        amount: (userSelectedAmount.amount || 0) * multiplier,
      };
    } else {
      return {
        currency: selectedPriceHandle?.currencyValues?.[currencyId.toLowerCase()]?.currency,
        amount:
          (selectedPriceHandle?.currencyValues?.[currencyId.toLowerCase()]?.amount || 0) *
          multiplier,
      };
    }
  }
}
