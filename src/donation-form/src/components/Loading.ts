import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("donation-form-loading")
class DonationFormLoading extends LitElement {
  render() {
    const containerStyle = styleMap({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    //language=HTML
    return html`
      <div style="${containerStyle}" class="n3o-donation-form-loading">
        Loading...
      </div>
    `;
  }
}
