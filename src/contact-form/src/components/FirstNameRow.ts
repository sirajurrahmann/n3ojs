import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators.js"
import {formRowStyles} from "../styles/formStyles";

@customElement("first-name-row")
class FirstNameRow extends LitElement {
    static styles = formRowStyles;

    @property()
    required: boolean = true;

    protected render() {
        return html`
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
        `
    }
}
