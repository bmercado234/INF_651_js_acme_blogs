function createElemWithText(elementName = 'p', textContent = '', className) {
     const newElem = document.createElement(elementName);
     newElem.textContent = textContent;
     if (className) {
          newElem.className = className;
     }
     return newElem;
}