var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AddressFieldsUS_1;
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formRowStyles } from "../../styles/formStyles";
let AddressFieldsUS = AddressFieldsUS_1 = class AddressFieldsUS extends LitElement {
    constructor() {
        super(...arguments);
        this.countries = [];
    }
    render() {
        return html `
<div>

    ${AddressFieldsUS_1.addressLines.map(line => html `
        <div class="n3o-form-row">
            <div class="n3o-form-label-col">
                <span class="n3o-form-label">
                    ${line.text}
                 </span>
            </div>
            
             <div class="n3o-form-input-col">
                <input name="${line.name}" type="text" class="n3o-form-input" />
            </div>
        </div>
    `)}
</div>
`;
    }
};
AddressFieldsUS.styles = formRowStyles;
AddressFieldsUS.addressLines = [
    { name: 'line1', text: "Line 1" },
    { name: 'line2', text: "Line 2" },
    { name: 'line3', text: "Line 3" },
    { name: 'townCity', text: "Town/City" },
    { name: 'state', text: "State" },
    { name: 'zipCode', text: "ZIP Code" },
];
__decorate([
    property()
], AddressFieldsUS.prototype, "countries", void 0);
__decorate([
    property()
], AddressFieldsUS.prototype, "onChange", void 0);
AddressFieldsUS = AddressFieldsUS_1 = __decorate([
    customElement("address-fields-us")
], AddressFieldsUS);
//# sourceMappingURL=Us.js.map