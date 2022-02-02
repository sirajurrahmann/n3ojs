import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { errorMessageStyles } from "../../styles/internal/ErrorMessage.styles";

@customElement("error-message")
class ErrorMessage extends LitElement {
  static styles = [errorMessageStyles];

  @property()
  message: string = "";

  render() {
    console.log(this.message);
    return html` <div class="n3o-error-message">${this.message}</div> `;
  }
}
