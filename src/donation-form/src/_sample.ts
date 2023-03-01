import { html, LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DonationFormType } from "./types/index";

import "./index";
import { CurrencyRes } from "@n3oltd/umbraco-giving-client";

@customElement("donation-form-sample-app")
class DonationFormSampleApp extends LitElement {
  @property({attribute: false})
  data?: {
      defaultCurrency?: CurrencyRes;
  };

  static styles = [
    css`
      #quickDonationFormContainer {
        width: 100%;
        position: fixed;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        padding: 10px;
        align-items: center;
      }
    `,
  ];

  render() {
    //lang=html
    return html`
      <div style="width: 350px">
        <data-donation-form
          .formId="${"a8492d39-1455-4de4-bcb2-e4d014d9bfc5"}"
          .baseUrl="${"https://staging.readfoundation.org.uk/"}"
          .mode="${DonationFormType.Full}"
          .showFrequencyFirst="${true}"
          .showCurrencyText="${false}"
          .footerText="${"We accept all major credit cards and PayPal"}"
          .afterAddToCart="${() => console.log("Item Added")}"
          .defaultCurrency="${this.data?.defaultCurrency}"
          .icons="${{
            donateButton: { icon: "favorite", variety: "filled" },
          }}"
        ></data-donation-form>
      </div>
    `;
  }
}
