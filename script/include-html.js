const includeHTML = (doc) => {
  const parser = new DOMParser();
  const elems = Array.from(doc.getElementsByTagName("include"));

  elems
    .filter(elem => elem.hasAttribute("href"))
    .forEach(elem => {
      const href = elem.getAttribute("href");
      elem.removeAttribute("href");

      const xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            const newDoc = parser.parseFromString(this.responseText, "text/html");
            includeHTML(newDoc);

            const newElem = newDoc.body.firstChild;
            elem.replaceWith(newElem);
          }
          
          if (this.status == 404) {
            elem.innerHTML = `Page not found: ${href}`;
          }
        }
      };

      xhttp.open("GET", href, true);
      xhttp.send();
    });
}

window.onload = function () {
  includeHTML(document);
};
