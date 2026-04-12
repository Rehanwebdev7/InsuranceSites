/**
 * Global event bus for opening the quote form modal from anywhere in the app.
 * Pages that render QuoteRequestForm (Home, Services) subscribe via useQuoteFormTrigger.
 */

const OPEN_EVENT = 'bharat:open-quote-form';

export const openQuoteForm = (service = null) => {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { service } }));
};

export const subscribeToQuoteForm = (handler) => {
  const listener = (event) => handler(event?.detail?.service || null);
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
};
