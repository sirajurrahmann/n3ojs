var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { formRowStyles } from "../styles/formStyles";
let FirstNameRow = class FirstNameRow extends LitElement {
    constructor() {
        super(...arguments);
        this.required = true;
    }
    render() {
        return html `
<div class="n3o-form-row">
    <div class="n3o-form-label-col">
        <span class="n3o-form-label ${this.required ? "n3o-form-label-required" : ''}">
            First Name
         </span>
    </div>
    
     <div class="n3o-form-input-col">
        <input type="text" class="n3o-form-input" />
    </div>
</div>
        `;
    }
};
FirstNameRow.styles = formRowStyles;
__decorate([
    property()
], FirstNameRow.prototype, "required", void 0);
FirstNameRow = __decorate([
    customElement("first-name-row")
], FirstNameRow);
//# sourceMappingURL=FirstNameRow.js.map