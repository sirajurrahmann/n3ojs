import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { helpTextStyles } from "../../styles/internal/HelpText.styles";

@customElement("help-text")
class HelpText extends LitElement {
  static styles = [helpTextStyles];

  @property()
  text: string = "";

  render() {
    return html` <div class="n3o-help-text">${this.text}</div> `;
  }
}
