var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { selectStyles } from "../styles/donationFormStyles";
let FundSelector = class FundSelector extends LitElement {
    constructor() {
        super(...arguments);
        this.options = [];
        this.donationItems = [];
        this.sponsorshipSchemes = [];
    }
    getDonationItemName(id) {
        var _a;
        return ((_a = this.donationItems.find((d) => d.id === id)) === null || _a === void 0 ? void 0 : _a.name) || "";
    }
    getSponsorshipSchemeName(id) {
        var _a;
        return ((_a = this.sponsorshipSchemes.find((d) => d.id === id)) === null || _a === void 0 ? void 0 : _a.name) || "";
    }
    render() {
        //language=HTML
        return html `
      <div class="n3o-donation-form-fund-select">
        <select
          id="fund-select"
          @change="${(e) => {
            var _a;
            const item = this.options.find((opt) => {
                var _a, _b;
                return opt.type === "fund"
                    ? ((_a = opt.fund) === null || _a === void 0 ? void 0 : _a.donationItem) ===
                        e.target.value
                    : ((_b = opt.sponsorship) === null || _b === void 0 ? void 0 : _b.scheme) ===
                        e.target.value;
            });
            (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this, item);
        }}"
        >
          ${this.options.map((option) => {
            var _a, _b, _c, _d;
            return html `<option
              @change="${(e) => console.log(e)}"
              value="${option.type === "fund"
                ? (_a = option.fund) === null || _a === void 0 ? void 0 : _a.donationItem
                : (_b = option.sponsorship) === null || _b === void 0 ? void 0 : _b.scheme}"
            >
              ${option.type === "fund"
                ? this.getDonationItemName((_c = option.fund) === null || _c === void 0 ? void 0 : _c.donationItem)
                : this.getSponsorshipSchemeName((_d = option.sponsorship) === null || _d === void 0 ? void 0 : _d.scheme)}
            </option>`;
        })}
        </select>
      </div>
    `;
    }
};
FundSelector.styles = [selectStyles];
__decorate([
    property()
], FundSelector.prototype, "value", void 0);
__decorate([
    property()
], FundSelector.prototype, "onChange", void 0);
__decorate([
    property()
], FundSelector.prototype, "options", void 0);
__decorate([
    property()
], FundSelector.prototype, "donationItems", void 0);
__decorate([
    property()
], FundSelector.prototype, "sponsorshipSchemes", void 0);
FundSelector = __decorate([
    customElement("fund-selector")
], FundSelector);
//# sourceMappingURL=FundSelector.js.map