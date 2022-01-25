var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AllocationType } from "@n3oltd/umbraco-donations-client/src/index";
let FundSelector = class FundSelector extends LitElement {
    constructor() {
        super(...arguments);
        this.data = { donationItems: [], sponsorshipSchemes: [], options: [] };
    }
    getDonationItemName(id) {
        var _a;
        return ((_a = this.data.donationItems.find(d => d.id === id)) === null || _a === void 0 ? void 0 : _a.name) || "";
    }
    getSponsorshipSchemeName(id) {
        var _a;
        return ((_a = this.data.sponsorshipSchemes.find(d => d.id === id)) === null || _a === void 0 ? void 0 : _a.name) || "";
    }
    render() {
        console.log(this.data);
        return html `
            <select>
                ${this.data.options.map(option => {
            var _a, _b, _c, _d, _e, _f;
            return html `<option 
                                    key="${option.type === AllocationType.Fund ?
                (_a = option.fund) === null || _a === void 0 ? void 0 : _a.donationItem :
                (_b = option.sponsorship) === null || _b === void 0 ? void 0 : _b.scheme}" 
                                    value="${option.type === AllocationType.Fund ?
                (_c = option.fund) === null || _c === void 0 ? void 0 : _c.donationItem :
                (_d = option.sponsorship) === null || _d === void 0 ? void 0 : _d.scheme}"
                               >
                        ${option.type === AllocationType.Fund ?
                this.getDonationItemName((_e = option.fund) === null || _e === void 0 ? void 0 : _e.donationItem) :
                this.getSponsorshipSchemeName((_f = option.sponsorship) === null || _f === void 0 ? void 0 : _f.scheme)}
                    </option>`;
        })}
            </select>
        `;
    }
};
__decorate([
    property({ attribute: false })
], FundSelector.prototype, "data", void 0);
FundSelector = __decorate([
    customElement("fund-selector")
], FundSelector);
//# sourceMappingURL=FundSelector.js.map