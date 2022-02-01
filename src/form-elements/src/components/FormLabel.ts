import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { labelStyles } from "../styles/FormLabel.styles";

@customElement("form-element-label")
class FormElementLabel extends LitElement {
  static styles = labelStyles;

  @property()
  required?: boolean | string = false;

  @property()
  primaryColor: string = "";

  connectedCallback() {
    super.connectedCallback();

    // Wait for event loop to finish
    setTimeout(() => {
      if (typeof this.required === "string") {
        switch (this.required) {
          case "true":
            this.required = true;
            break;
          case "false":
            this.required = false;
            break;
        }
      }
    });
  }

  render() {
    const headerStyle = styleMap({ color: this.primaryColor });
    //language=HTML
    return html`
      <span class="n3o-form-label">
        <slot name="labelText"></slot> ${this.required
          ? html`<span style="${headerStyle}">*</span>`
          : ""}
      </span>
    `;
  }
}
