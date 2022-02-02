import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { formRowStyles } from "../styles/formStyles";

@customElement("title-row")
class TitleRow extends LitElement {
  static styles = formRowStyles;

  protected render() {
    //language=HTML
    return html`
      <div class="n3o-form-row">
        <div class="n3o-form-label-col">
          <span class="n3o-form-label"> Title </span>
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
}
