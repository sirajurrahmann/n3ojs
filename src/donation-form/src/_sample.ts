import { html, LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";
import { DonationFormType } from "./types/index";

import "./index";

@customElement("donation-form-sample-app")
class DonationFormSampleApp extends LitElement {
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
      <div style="width: 300px">
        <data-donation-form
          .formId="${"a8492d39-1455-4de4-bcb2-e4d014d9bfc5"}"
          .baseUrl="${"https://read-uk-staging.n3o.site"}"
          .mode="${DonationFormType.Full}"
          .showFrequencyFirst="${true}"
          .showCurrencyText="${true}"
          .footerText="${"We accept all major credit cards and PayPal"}"
          .afterAddToCart="${() => console.log("Item Added")}"
          .icons="${{
            donateButton: { icon: "favorite", variety: "filled" },
          }}"
        ></data-donation-form>

        <div id="quickDonationFormContainer">
          <data-donation-form
            .formId="${"a8492d39-1455-4de4-bcb2-e4d014d9bfc5"}"
            .baseUrl="${"https://read-uk-staging.n3o.site"}"
            .showFrequencyFirst="${true}"
            .mode="${DonationFormType.Quick}"
            .showCurrencyText="${true}"
            .footerText="${"We accept all major credit cards and PayPal"}"
            .afterAddToCart="${() => console.log("Item Added")}"
            .icons="${{
              donateButton: { icon: "favorite", variety: "filled" },
            }}"
          ></data-donation-form>
        </div>
      </div>
    `;
  }
}
