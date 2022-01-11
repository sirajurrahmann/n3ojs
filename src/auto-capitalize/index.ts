import arrayFrom from "array-from";

function autoCapitaliseAll(className: string): void {
  const elementsCollection = document.getElementsByClassName(className);
  const elements: HTMLElement[] = arrayFrom(elementsCollection);

  elements.forEach((elem) => {
    let str = elem.innerHTML;
    if (str.length < 2) return;

    if (str !== str.toUpperCase() && str !== str.toLowerCase()) return;

    if (elem.getAttribute("data-__preCorrectionText") === str) return;

    elem.setAttribute("data-__preCorrectionText", str);

    str = str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    elem.innerHTML = str;
  });
}

const autoCapitalize = {
  all: (className: string) => {
    autoCapitaliseAll(className);
  },
};

export default autoCapitalize;
