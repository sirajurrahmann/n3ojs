var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { otherAmountStyles } from "../styles/donationFormStyles";
let OtherAmount = class OtherAmount extends LitElement {
    constructor() {
        super(...arguments);
        this.currencies = [];
    }
    validateInput(target) {
        var _a, _b;
        const re = /^[0-9]+$/;
        if (re.test(target.value)) {
            (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this, {
                amount: Number(target.value),
                currency: this.currency,
            });
        }
        else {
            // Not allowing the input
            (_b = this.onChange) === null || _b === void 0 ? void 0 : _b.call(this);
            // Keeping the actual element value in sync with state
            target.value = "";
        }
    }
    render() {
        var _a, _b, _c;
        console.log(this.value);
        //language=HTML
        return html `
      <div class="n3o-donation-form-other-amount">
        <span class="n3o-amount-input">
          <span>
            <span class="n3o-input-amount-symbol">
              ${(_a = this.currency) === null || _a === void 0 ? void 0 : _a.symbol}
            </span>
            <input
              .value="${((_b = this.value) === null || _b === void 0 ? void 0 : _b.amount) || ""}"
              @input="${(e) => {
            var _a;
            if (e.target.value) {
                this.validateInput(e.target);
            }
            else {
                (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this);
            }
        }}"
            />
          </span>
          ${this.showCurrencyText
            ? html `
                <span class="n3o-input-amount-text">
                  ${(_c = this.currency) === null || _c === void 0 ? void 0 : _c.text}
                </span>
              `
            : undefined}
        </span>
      </div>
    `;
    }
};
OtherAmount.styles = otherAmountStyles;
__decorate([
    property()
], OtherAmount.prototype, "onChange", void 0);
__decorate([
    property()
], OtherAmount.prototype, "value", void 0);
__decorate([
    property()
], OtherAmount.prototype, "currencies", void 0);
__decorate([
    property()
], OtherAmount.prototype, "currency", void 0);
__decorate([
    property()
], OtherAmount.prototype, "showCurrencyText", void 0);
OtherAmount = __decorate([
    customElement("other-amount")
], OtherAmount);
//# sourceMappingURL=OtherAmount.js.map