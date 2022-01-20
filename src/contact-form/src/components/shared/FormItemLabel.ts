import {LitElement, html} from "lit";
import {customElement, property} from "lit/decorators.js"
import {styleMap} from 'lit/directives/style-map.js';

@customElement("form-item-label")
class FormItemLabel extends LitElement {
    @property()
    required?: boolean = false;

    @property()
    primaryColor: string= "";

    protected render() {
        const headerStyle = styleMap({color: this.primaryColor});

        return html`
<span class="n3o-form-label">
    <slot name="labelText"></slot> ${this.required ? html`<span style="${headerStyle}">*</span>` : ""}
</span>
`
    }
}
