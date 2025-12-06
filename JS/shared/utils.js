// JS/shared/utils.js

/**
 * Utility function to debounce function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function to check if element is in viewport
 * @param {Element} el - The element to check
 * @returns {boolean} - True if element is in viewport
 */
export function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Utility function to add multiple event listeners
 * @param {Element} el - The element to add listeners to
 * @param {Array} events - Array of event names
 * @param {Function} handler - The event handler
 */
export function addMultipleListeners(el, events, handler) {
  events.forEach((event) => el.addEventListener(event, handler));
}
