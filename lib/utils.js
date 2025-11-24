// Utility functions
const Utils = {
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  getElementSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.className) {
      return `${element.tagName.toLowerCase()}.${
        element.className.split(" ")[0]
      }`;
    }
    return element.tagName.toLowerCase();
  },

  isVisible(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  },
};
