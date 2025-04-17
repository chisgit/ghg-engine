/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 */

import 'zone.js';  // Included with Angular CLI

/**
 * Fix for unload event listeners deprecation warning
 * 
 * This is a more comprehensive fix that patches multiple ways unload events
 * might be registered in the application or its dependencies.
 */
if (typeof window !== 'undefined') {
  // Patch window.addEventListener
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(
    type: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === 'unload') {
      // Replace 'unload' with 'pagehide'
      console.log('Polyfill: Replacing unload listener with pagehide'); // Optional: for debugging
      return originalAddEventListener.call(this, 'pagehide', listener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Patch EventTarget.prototype.addEventListener to catch all DOM elements
  const originalETAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(
    type: string, 
    listener: EventListenerOrEventListenerObject, 
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === 'unload') {
       // Replace 'unload' with 'pagehide'
      console.log('Polyfill: Replacing unload listener on target with pagehide'); // Optional: for debugging
      return originalETAddEventListener.call(this, 'pagehide', listener, options);
    }
    return originalETAddEventListener.call(this, type, listener, options);
  };

  // Patch onunload property
  let currentOnUnload: any = null; // Store the original handler if needed

  Object.defineProperty(window, 'onunload', {
    get: function() {
      // Return the pagehide handler if it exists, otherwise null
      return window.onpagehide || currentOnUnload; 
    },
    set: function(handler: any) {
      console.log('Polyfill: Setting onunload, replacing with onpagehide'); // Optional: for debugging
      // Remove any existing pagehide listener set by this polyfill
      if (window.onpagehide) {
         window.removeEventListener('pagehide', window.onpagehide);
      }
       // Store the handler in case it needs to be accessed via get
      currentOnUnload = handler; 
      // Set the new handler for pagehide
      window.onpagehide = handler; 
      // Add the listener using addEventListener as well for consistency
      if (handler) {
        window.addEventListener('pagehide', handler);
      }
    },
    configurable: true
  });
}
