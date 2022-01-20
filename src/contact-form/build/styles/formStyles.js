import { css } from "lit";
export const formContainerStyles = css `
.n3o-contact-form-container, .n3o-email-sms-container {
   width: 100%;
   background: whitesmoke;
   padding: 30px;
   margin-bottom: 30px;
}
`;
export const formRowStyles = css `
.n3o-form-row {
  width: 100%;
  margin-bottom: 30px;
}

.n3o-form-row {
  display: flex;
}

.n3o-form-label-col {
  width: 20%;
}

.n3o-form-label-required::after {
   content: "*";
}

.n3o-form-input-col {
  width: 80%;
}

.n3o-form-input {
  width: 100%;
}`;
//# sourceMappingURL=formStyles.js.map