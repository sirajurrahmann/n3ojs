import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { helpTooltipStyles } from "../../styles/internal/HelpTooltip.styles";

@customElement("help-tooltip")
class HelpTooltip extends LitElement {
  static styles = [helpTooltipStyles];

  @property()
  text: string = "";

  render() {
    return html`
      <span class="n3o-help-tooltip" data-tooltip="${this.text}">?</span>
    `;
  }
}
