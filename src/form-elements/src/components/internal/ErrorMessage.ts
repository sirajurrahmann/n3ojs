import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { errorMessageStyles } from "../../styles/internal/ErrorMessage.styles";

@customElement("error-message")
class ErrorMessage extends LitElement {
  static styles = [errorMessageStyles];

  @property()
  message: string = "";

  render() {
    return html` <div class="n3o-error-message">${this.message}</div> `;
  }
}
