var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { formRowStyles } from "../styles/formStyles";
let TitleRow = class TitleRow extends LitElement {
    render() {
        return html `
<div class="n3o-form-row">
    <div class="n3o-form-label-col">
        <span class="n3o-form-label">
            Title
         </span>
    </div>
    
     <div class="n3o-form-input-col">
        <select class="n3o-form-input n3o-form-input-select" name="title">
            <option value="mr">Mr</option>
            <option value="mrs">Mrs</option>
            <option value="miss">Miss</option>
            <option value="ms">Ms</option>
            <option value="dr">Dr</option>
        </select>
    </div>
</div>
        `;
    }
};
TitleRow.styles = formRowStyles;
TitleRow = __decorate([
    customElement("title-row")
], TitleRow);
//# sourceMappingURL=TitleRow.js.map