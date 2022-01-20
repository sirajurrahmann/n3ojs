var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from 'lit/directives/style-map.js';
let FormItemLabel = class FormItemLabel extends LitElement {
    constructor() {
        super(...arguments);
        this.required = false;
        this.primaryColor = "";
    }
    render() {
        const headerStyle = styleMap({ color: this.primaryColor });
        return html `
<span class="n3o-form-label">
    <slot name="labelText"></slot> ${this.required ? html `<span style="${headerStyle}">*</span>` : ""}
</span>
`;
    }
};
__decorate([
    property()
], FormItemLabel.prototype, "required", void 0);
__decorate([
    property()
], FormItemLabel.prototype, "primaryColor", void 0);
FormItemLabel = __decorate([
    customElement("form-item-label")
], FormItemLabel);
//# sourceMappingURL=FormItemLabel.js.map