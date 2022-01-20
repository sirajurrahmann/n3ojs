import {LitElement, html } from "lit";
import {customElement, property} from "lit/decorators.js";
import {formContainerStyles} from "./styles/formStyles";

import "./components/TitleRow";
import "./components/FirstNameRow";
import "./components/LastNameRow";
import "./components/CountryRow";

import "./components/addressFields/Gb";
import "./components/addressFields/Us";

import "./components/emailSmsForm/EmailSmsForm";

@customElement("data-contact-form")
class ContactForm extends LitElement {
    static styles = formContainerStyles;

    @property({attribute: false})
    data: { defaultCountry: string, primaryColor: string } = { defaultCountry: "GB", primaryColor: '' };

    @property()
    country = this.data.defaultCountry;

    render() {
        return html`
<div>
    <div class="n3o-contact-form-container">
        <title-row .primaryColor="${this.data.primaryColor}"></title-row>
        <first-name-row .primaryColor="${this.data.primaryColor}"></first-name-row>
        <last-name-row .primaryColor="${this.data.primaryColor}"></last-name-row>
        
        <country-row .primaryColor="${this.data.primaryColor}" .onChange="${(country: string) => this.country = country}" .countries="${[{id: "GB", name: "United Kingdom"}, {id: "US", name: "United States"}]}"></country-row>
    
        ${this.renderAddress(this.country)}
    </div>
    
    <div class="n3o-email-sms-container">
        <email-sms-form .primaryColor="${this.data.primaryColor}"></email-sms-form>
    </div>
</div>
    `;
    }

    renderAddress(country: string) {
        switch (country) {
            case "GB":
                return html`
                    <address-fields-gb .primaryColor="${this.data.primaryColor}"></address-fields-gb>
                `;
            case "US":
                return html`
                    <div>
                        <address-fields-us .primaryColor="${this.data.primaryColor}"></address-fields-us>
                    </div>
                `
        }
    }
}
