var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formRowStyles } from "../styles/formStyles";
import "./shared/FormItemLabel";
let CountryRow = class CountryRow extends LitElement {
    constructor() {
        super(...arguments);
        this.countries = [];
        this.primaryColor = "";
    }
    render() {
        return html `
<div class="n3o-form-row">
    <div class="n3o-form-label-col">
        <form-item-label .primaryColor="${this.primaryColor}" .required="${true}">
            <span slot="labelText">Country</span>
        </form-item-label>
    </div>
    
     <div class="n3o-form-input-col">
        <select class="n3o-form-input n3o-form-input-select" name="title" @change="${(e) => { var _a; return (_a = this.onChange) === null || _a === void 0 ? void 0 : _a.call(this, e.target.value); }}">
            ${this.countries.map(c => html `<option value="${c.id}">${c.name}</option>`)}
        </select>
    </div>
</div>
`;
    }
};
CountryRow.styles = formRowStyles;
__decorate([
    property()
], CountryRow.prototype, "countries", void 0);
__decorate([
    property()
], CountryRow.prototype, "onChange", void 0);
__decorate([
    property()
], CountryRow.prototype, "primaryColor", void 0);
CountryRow = __decorate([
    customElement("country-row")
], CountryRow);
//# sourceMappingURL=CountryRow.js.map