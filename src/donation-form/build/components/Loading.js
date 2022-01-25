var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
let DonationFormLoading = class DonationFormLoading extends LitElement {
    render() {
        const containerStyle = styleMap({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        });
        //language=HTML
        return html `
      <div style="${containerStyle}" class="n3o-donation-form-loading">
        Loading...
      </div>
    `;
    }
};
DonationFormLoading = __decorate([
    customElement("donation-form-loading")
], DonationFormLoading);
//# sourceMappingURL=Loading.js.map