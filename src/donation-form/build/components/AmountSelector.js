var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { amountSelectorStyles, buttonStyles, } from "../styles/donationFormStyles";
let AmountSelector = class AmountSelector extends LitElement {
    constructor() {
        super(...arguments);
        // TODO: Remove sample data
        this._priceHandles = [
            {
                amount: {
                    amount: 20,
                    currency: "GBP",
                    text: "£20",
                },
                description: "Yemen Bread Factory: Produces 500 loaves of bread (feeds 500 people).",
            },
            {
                amount: {
                    amount: 50,
                    currency: "GBP",
                    text: "£50",
                },
                description: "Yemen Bread Factory: Produces 2,000 loaves of bread (feeds 1,500 people).",
            },
            {
                amount: {
                    amount: 100,
                    currency: "GBP",
                    text: "£1000",
                },
                description: "Fund the bread factory for a month",
            },
        ];
    }
    render() {
        var _a;
        //language=HTML
        return html `
      <div>
        <div class="n3o-donation-form-price-select">
          ${this._priceHandles.map((handle) => {
            var _a, _b, _c, _d;
            return html `<button
              aria-selected="this.selected?.amount?.text ===
            handle.amount?.text"
              class="n3o-donation-form-button ${((_b = (_a = this.value) === null || _a === void 0 ? void 0 : _a.amount) === null || _b === void 0 ? void 0 : _b.text) ===
                ((_c = handle.amount) === null || _c === void 0 ? void 0 : _c.text)
                ? "n3o-donation-form-button-selected"
                : "n3o-donation-form-button-unselected"}"
              @click="${() => { var _a; return (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this, handle); }}"
            >
              ${(_d = handle.amount) === null || _d === void 0 ? void 0 : _d.text}
            </button>`;
        })}
        </div>
        <div class="n3o-donation-form-price-desc">
          ${(_a = this.value) === null || _a === void 0 ? void 0 : _a.description}
        </div>
      </div>
    `;
    }
};
AmountSelector.styles = [buttonStyles, amountSelectorStyles];
__decorate([
    property()
], AmountSelector.prototype, "_priceHandles", void 0);
__decorate([
    property()
], AmountSelector.prototype, "onChange", void 0);
__decorate([
    property()
], AmountSelector.prototype, "value", void 0);
AmountSelector = __decorate([
    customElement("amount-selector")
], AmountSelector);
//# sourceMappingURL=AmountSelector.js.map