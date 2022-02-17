import arrayFrom from "array-from";

function autoCapitaliseAll(className: string): void {
  const elementsCollection = document.getElementsByClassName(className);
  const elements: HTMLElement[] = arrayFrom(elementsCollection);

  elements.forEach((elem) => {
    let str = elem.innerHTML.trim();

    if (str.length < 2) return;

    if (str !== str.toUpperCase() && str !== str.toLowerCase()) return;

    if (elem.getAttribute("data-__preCorrectionText") !== str) return;

    elem.setAttribute("data-__preCorrectionText", str);

    str = str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    elem.innerHTML = str;
  });
}

interface AutoCapitalize {
  all: (className: string) => void;
}

const autoCapitalize: AutoCapitalize = {
  all: (className: string) => {
    autoCapitaliseAll(className);
  },
};

declare global {
  interface Window {
    autoCapitalize: AutoCapitalize;
  }
}

window.autoCapitalize = autoCapitalize;
