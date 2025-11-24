/**
 * Trusted Tester Assistant - Content Script
 * Version 5.2.0
 *
 * This script runs on every web page and provides the interface
 * between the popup and the PageAnalyzer
 */

(function () {
  "use strict";

  // Check if already initialized to prevent double loading
  if (window.TrustedTesterContentScriptLoaded) {
    console.log("Trusted Tester content script already loaded");
    return;
  }
  window.TrustedTesterContentScriptLoaded = true;

  console.log("Trusted Tester Assistant v5.2.0 - Content script initialized");

  /**
   * Initialize PageAnalyzer if not already loaded
   */
  function ensurePageAnalyzer() {
    if (typeof PageAnalyzer === "undefined") {
      throw new Error(
        "PageAnalyzer not loaded. This may happen on restricted pages."
      );
    }
    return true;
  }

  /**
   * Safe execution wrapper
   */
  function safeExecute(action, params = {}) {
    try {
      ensurePageAnalyzer();

      switch (action) {
        case "ping":
          return {
            status: "ready",
            version: "5.2.0",
            url: window.location.href,
            title: document.title,
          };

        case "quickAnalyze":
          return PageAnalyzer.quickAnalyze();

        case "analyzeForTest":
          if (!params.testId) {
            throw new Error("testId parameter required");
          }
          return PageAnalyzer.analyzeForTest(params.testId);

        case "runTest":
          if (!params.testId) {
            throw new Error("testId parameter required");
          }
          return PageAnalyzer.runSpecificTest(params.testId);

        case "getPageInfo":
          return {
            url: window.location.href,
            title: document.title,
            readyState: document.readyState,
            lang: document.documentElement.lang,
            hasPageAnalyzer: typeof PageAnalyzer !== "undefined",
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error(`Error executing ${action}:`, error);
      return {
        error: true,
        message: error.message,
        action: action,
      };
    }
  }

  /**
   * Message listener for popup communication
   */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Content script received message:", request.action);

    try {
      const result = safeExecute(request.action, request);
      sendResponse(result);
    } catch (error) {
      console.error("Message handler error:", error);
      sendResponse({
        error: true,
        message: error.message,
        stack: error.stack,
      });
    }

    // Return true to indicate we'll send a response asynchronously
    return true;
  });

  /**
   * Notify that content script is ready
   */
  function notifyReady() {
    // Send message to background script
    chrome.runtime
      .sendMessage({
        action: "contentScriptReady",
        url: window.location.href,
        timestamp: new Date().toISOString(),
      })
      .catch((err) => {
        // Silently fail if background script isn't listening
        console.debug("Could not notify background script:", err.message);
      });
  }

  /**
   * Wait for page to be fully loaded
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM content loaded - Trusted Tester ready");
      notifyReady();
    });
  } else {
    // DOM already loaded
    console.log("Trusted Tester content script ready (DOM already loaded)");
    notifyReady();
  }

  /**
   * Monitor for dynamic content changes (optional)
   */
  let observerTimeout = null;
  const contentObserver = new MutationObserver((mutations) => {
    // Debounce to avoid excessive processing
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      console.debug("Page content changed - analyzer may need to re-run");
    }, 1000);
  });

  // Start observing after page load
  if (document.body) {
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  }

  /**
   * Cleanup on page unload
   */
  window.addEventListener("unload", () => {
    if (contentObserver) {
      contentObserver.disconnect();
    }
  });

  /**
   * Expose helper for debugging
   */
  if (typeof window !== "undefined") {
    window.TrustedTester = {
      version: "5.2.0",
      ping: () => safeExecute("ping"),
      analyze: () => safeExecute("quickAnalyze"),
      test: (testId) => safeExecute("analyzeForTest", { testId }),
      info: () => safeExecute("getPageInfo"),
    };
  }

  console.log(
    "%c✓ Trusted Tester Assistant Ready",
    "color: green; font-weight: bold; font-size: 14px;"
  );
  console.log(
    "%cType TrustedTester.info() to check status",
    "color: blue; font-size: 12px;"
  );
})();
