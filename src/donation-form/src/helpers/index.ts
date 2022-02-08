import {
  AllocationType,
  DonationItemRes,
  DonationOptionRes,
  FundDimensionValueRes,
  PricingRes,
  PricingRuleRes,
  SponsorshipSchemeRes,
} from "@n3oltd/umbraco-giving-client";

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
      pricing = sponsorshipSchemes
        .find((s) => s.id === option.sponsorship)
        ?.components?.find((c) => c.mandatory)?.pricing;
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
}
