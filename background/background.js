// // Background Service Worker for Trusted Tester Extension

// console.log("Trusted Tester Assistant background script loaded");

// // Listen for messages from popup
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getAnswerRecommendation") {
//     const answer = evaluateAnswer(request.question, request.pageAnalysis);
//     sendResponse(answer);
//   }
//   return true;
// });

// // Handle extension installation
// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Trusted Tester Assistant installed");
// });

// /**
//  * Evaluate the answer based on question and page analysis
//  */
// function evaluateAnswer(question, pageAnalysis) {
//   const testId = question.testId;

//   // Get test logic from database
//   const testLogic = TestDatabase.getTestLogic(testId);

//   if (!testLogic) {
//     return {
//       recommendedAnswer: "?",
//       confidence: 0,
//       findings: "Test not supported",
//       reasoning: `No evaluation logic found for test ${testId}`,
//     };
//   }

//   // Run evaluation
//   const result = testLogic.evaluate(pageAnalysis, question.choices);

//   return result;
// }

// // Test Database included in background script
// const TestDatabase = {
//   tests: {
//     "12.A": {
//       name: "2.4.2-page-title-defined",
//       evaluate(pageAnalysis, choices) {
//         const { titleCount, titleIsEmpty, titleText } = pageAnalysis;

//         let recommendedAnswer = "";
//         let findings = "";
//         let reasoning = "";
//         let confidence = 95;

//         if (titleCount === 0) {
//           recommendedAnswer = "c";
//           findings = "No <title> element found in the page";
//           reasoning =
//             "The page <head> contains no <title> element. This is a failure of 2.4.2.";
//         } else if (titleCount > 1) {
//           recommendedAnswer = "e";
//           findings = `${titleCount} <title> elements found`;
//           reasoning =
//             "HTML specification allows only one <title> per page. Multiple titles is a failure.";
//         } else if (titleIsEmpty) {
//           recommendedAnswer = "c";
//           findings = "Title element exists but contains no text";
//           reasoning =
//             "An empty <title> does not meet the requirement for a descriptive page title.";
//           confidence = 90;
//         } else {
//           recommendedAnswer = "b";
//           findings = `Valid title found: "${titleText}"`;
//           reasoning =
//             "Page has exactly one <title> element with descriptive text. This passes 2.4.2.";
//         }

//         return {
//           recommendedAnswer,
//           confidence,
//           findings,
//           reasoning,
//         };
//       },
//     },

//     "12.B": {
//       name: "2.4.2-page-title-descriptive",
//       evaluate(pageAnalysis, choices) {
//         const { title, isDescriptive, suggestions } = pageAnalysis;

//         if (!title) {
//           return {
//             recommendedAnswer: "c",
//             confidence: 95,
//             findings: "No title to evaluate",
//             reasoning: "Cannot evaluate descriptiveness without a title",
//           };
//         }

//         if (isDescriptive) {
//           return {
//             recommendedAnswer: "b",
//             confidence: 85,
//             findings: `Title appears descriptive: "${title}"`,
//             reasoning:
//               "Title contains meaningful text that describes the page purpose",
//           };
//         } else {
//           return {
//             recommendedAnswer: "c",
//             confidence: 80,
//             findings: `Title may not be descriptive enough: "${title}"`,
//             reasoning: suggestions.join("; "),
//           };
//         }
//       },
//     },

//     "7.A": {
//       name: "1.1.1-meaningful-image-name",
//       evaluate(pageAnalysis, choices) {
//         const { totalImages, imagesWithoutAlt, emptyAlt } = pageAnalysis;

//         if (totalImages === 0) {
//           return {
//             recommendedAnswer: "d",
//             confidence: 100,
//             findings: "No images found on page",
//             reasoning: "Test does not apply when no images are present",
//           };
//         }

//         if (imagesWithoutAlt > 0) {
//           return {
//             recommendedAnswer: "c",
//             confidence: 95,
//             findings: `${imagesWithoutAlt} image(s) missing alt attribute`,
//             reasoning:
//               "All meaningful images must have alt text describing their purpose",
//           };
//         }

//         return {
//           recommendedAnswer: "b",
//           confidence: 85,
//           findings: "All images have alt attributes",
//           reasoning: `${totalImages} images checked, all have alt text`,
//         };
//       },
//     },

//     "7.B": {
//       name: "1.1.1-decorative-image",
//       evaluate(pageAnalysis, choices) {
//         const { decorativeCount, totalImages, properlyMarked } = pageAnalysis;

//         if (decorativeCount === 0) {
//           return {
//             recommendedAnswer: "d",
//             confidence: 90,
//             findings: "No decorative images identified",
//             reasoning: "Test applies only to decorative images",
//           };
//         }

//         if (properlyMarked === decorativeCount) {
//           return {
//             recommendedAnswer: "b",
//             confidence: 85,
//             findings: `${decorativeCount} decorative images properly marked`,
//             reasoning:
//               'Decorative images have empty alt or role="presentation"',
//           };
//         }

//         return {
//           recommendedAnswer: "c",
//           confidence: 80,
//           findings: `${
//             decorativeCount - properlyMarked
//           } decorative images not properly marked`,
//           reasoning:
//             'Decorative images should have alt="" or role="presentation"',
//         };
//       },
//     },

//     "10.C": {
//       name: "1.3.1-heading-level",
//       evaluate(pageAnalysis, choices) {
//         const { headingCount, isLogical, issues } = pageAnalysis;

//         if (headingCount === 0) {
//           return {
//             recommendedAnswer: "d",
//             confidence: 100,
//             findings: "No headings found",
//             reasoning: "Test does not apply without headings",
//           };
//         }

//         if (isLogical) {
//           return {
//             recommendedAnswer: "b",
//             confidence: 90,
//             findings: "Heading structure is logical",
//             reasoning: `${headingCount} headings follow proper hierarchy`,
//           };
//         }

//         return {
//           recommendedAnswer: "c",
//           confidence: 85,
//           findings: "Heading structure issues detected",
//           reasoning: issues.join("; "),
//         };
//       },
//     },

//     "6.A": {
//       name: "2.4.4-link-purpose",
//       evaluate(pageAnalysis, choices) {
//         const { totalLinks, ambiguousLinks } = pageAnalysis;

//         if (totalLinks === 0) {
//           return {
//             recommendedAnswer: "d",
//             confidence: 100,
//             findings: "No links found",
//             reasoning: "Test does not apply without links",
//           };
//         }

//         if (ambiguousLinks > 0) {
//           return {
//             recommendedAnswer: "c",
//             confidence: 85,
//             findings: `${ambiguousLinks} link(s) with unclear purpose`,
//             reasoning: "Links need descriptive text or aria-label",
//           };
//         }

//         return {
//           recommendedAnswer: "b",
//           confidence: 80,
//           findings: "All links appear to have clear purpose",
//           reasoning: `${totalLinks} links checked`,
//         };
//       },
//     },

//     "5.C": {
//       name: "1.3.1-programmatic-label",
//       evaluate(pageAnalysis, choices) {
//         const { totalFields, fieldsWithoutLabels, onlyPlaceholder } =
//           pageAnalysis;

//         if (totalFields === 0) {
//           return {
//             recommendedAnswer: "d",
//             confidence: 100,
//             findings: "No form fields found",
//             reasoning: "Test does not apply without form fields",
//           };
//         }

//         if (fieldsWithoutLabels > 0) {
//           return {
//             recommendedAnswer: "c",
//             confidence: 95,
//             findings: `${fieldsWithoutLabels} field(s) without programmatic labels`,
//             reasoning: "All form fields need proper labels",
//           };
//         }

//         if (onlyPlaceholder > 0) {
//           return {
//             recommendedAnswer: "c",
//             confidence: 90,
//             findings: `${onlyPlaceholder} field(s) use only placeholder`,
//             reasoning: "Placeholder is not a substitute for proper labeling",
//           };
//         }

//         return {
//           recommendedAnswer: "b",
//           confidence: 90,
//           findings: "All form fields have programmatic labels",
//           reasoning: `${totalFields} fields properly labeled`,
//         };
//       },
//     },

//     "14.A": {
//       name: "1.3.1-data-table-headers",
//       evaluate(pageAnalysis, choices) {
//         const { totalTables, tablesWithoutHeaders } = pageAnalysis;

//         if (totalTables === 0) {
//           return {
//             recommendedAnswer: "d",
//             confidence: 100,
//             findings: "No tables found",
//             reasoning: "Test does not apply without tables",
//           };
//         }

//         if (tablesWithoutHeaders > 0) {
//           return {
//             recommendedAnswer: "c",
//             confidence: 85,
//             findings: `${tablesWithoutHeaders} data table(s) without headers`,
//             reasoning: "Data tables must have <th> elements",
//           };
//         }

//         return {
//           recommendedAnswer: "b",
//           confidence: 80,
//           findings: "All data tables have headers",
//           reasoning: `${totalTables} tables checked`,
//         };
//       },
//     },
//   },

//   getTestLogic(testId) {
//     return this.tests[testId] || null;
//   },
// };

// Enhanced Background Service Worker for Trusted Tester Extension
// v5.2.0 - Complete Test Database Implementation

console.log("Trusted Tester Assistant v5.2.0 background script loaded");

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAnswerRecommendation") {
    const answer = evaluateAnswer(request.question, request.pageAnalysis);
    sendResponse(answer);
  }
  return true;
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Trusted Tester Assistant v5.2.0 installed");
  // Initialize default settings
  chrome.storage.local.set({
    version: "5.2.0",
    analysisHistory: [],
  });
});

/**
 * Evaluate the answer based on question and page analysis
 */
function evaluateAnswer(question, pageAnalysis) {
  const testId = question.testId;

  // Get test logic from database
  const testLogic = TestDatabase.getTestLogic(testId);

  if (!testLogic) {
    return {
      recommendedAnswer: "?",
      confidence: 0,
      findings: "Test not supported yet",
      reasoning: `No evaluation logic found for test ${testId}. This test may require manual evaluation.`,
    };
  }

  // Run evaluation
  const result = testLogic.evaluate(pageAnalysis, question.choices);

  return result;
}

// Complete Test Database with all major tests
const TestDatabase = {
  tests: {
    // ============================================
    // CATEGORY 4: KEYBOARD & FOCUS TESTS
    // ============================================
    "4.A": {
      name: "2.1.1-keyboard-access",
      evaluate(pageAnalysis, choices) {
        const { interactiveElements, focusableElements, details } =
          pageAnalysis;

        if (interactiveElements === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No interactive elements found",
            reasoning:
              "Test Does Not Apply - No interactive functionality exists on the page",
          };
        }

        // Check for non-focusable interactive elements
        const nonFocusable = details.filter(
          (el) => (el.hasClick || el.role === "button") && !el.isFocusable
        );

        if (nonFocusable.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 85,
            findings: `${nonFocusable.length} interactive element(s) not keyboard accessible`,
            reasoning:
              "Interactive elements must be keyboard accessible (focusable via Tab key)",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 80,
          findings: `All ${focusableElements} interactive elements appear keyboard accessible`,
          reasoning:
            "All interactive elements have appropriate tabindex or are natively focusable",
        };
      },
    },

    "4.C": {
      name: "2.1.2-no-keyboard-trap",
      evaluate(pageAnalysis, choices) {
        return {
          recommendedAnswer: "e",
          confidence: 50,
          findings: "This test requires manual keyboard navigation",
          reasoning:
            "NOT TESTED - Use Tab/Shift+Tab to verify focus can move through all elements without trapping. Use Esc to exit modals.",
        };
      },
    },

    "4.D": {
      name: "2.4.7-focus-visible",
      evaluate(pageAnalysis, choices) {
        return {
          recommendedAnswer: "e",
          confidence: 50,
          findings: "This test requires manual visual inspection",
          reasoning:
            "NOT TESTED - Tab through page and verify each focused element has visible indicator (outline, border, background change, etc.)",
        };
      },
    },

    "4.F": {
      name: "2.4.3-focus-order-meaningful",
      evaluate(pageAnalysis, choices) {
        return {
          recommendedAnswer: "e",
          confidence: 50,
          findings: "This test requires manual keyboard navigation",
          reasoning:
            "NOT TESTED - Tab through page and verify focus order follows logical reading order and preserves meaning/operability",
        };
      },
    },

    // ============================================
    // CATEGORY 5: FORM TESTS
    // ============================================
    "5.A": {
      name: "3.3.2-label-provided",
      evaluate(pageAnalysis, choices) {
        const { totalFields, details } = pageAnalysis;

        if (totalFields === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No form fields found",
            reasoning: "Test Does Not Apply - No form inputs on page",
          };
        }

        // Check for fields without ANY label (visual or programmatic)
        const unlabeled = details.filter(
          (f) =>
            !f.hasLabel &&
            !f.hasAriaLabel &&
            !f.hasAriaLabelledby &&
            !f.hasPlaceholder
        );

        if (unlabeled.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 95,
            findings: `${unlabeled.length} field(s) have no visible label or instruction`,
            reasoning:
              "Every form field must have a visible label, instruction, or cue",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 90,
          findings: "All form fields have visible labels or instructions",
          reasoning: `${totalFields} fields checked - all have visual identification`,
        };
      },
    },

    "5.C": {
      name: "1.3.1-programmatic-label",
      evaluate(pageAnalysis, choices) {
        const { totalFields, fieldsWithoutLabels, onlyPlaceholder, details } =
          pageAnalysis;

        if (totalFields === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No form fields found",
            reasoning: "Test Does Not Apply - No form inputs exist",
          };
        }

        if (fieldsWithoutLabels > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 95,
            findings: `${fieldsWithoutLabels} field(s) lack programmatic label association`,
            reasoning:
              "Form fields need <label for='id'>, aria-label, or aria-labelledby for screen reader access",
          };
        }

        if (onlyPlaceholder > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 90,
            findings: `${onlyPlaceholder} field(s) use placeholder only (insufficient)`,
            reasoning:
              "Placeholder attribute alone is NOT sufficient - must have proper label association",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 90,
          findings: "All form fields have programmatic label associations",
          reasoning: `${totalFields} fields properly labeled with <label>, aria-label, or aria-labelledby`,
        };
      },
    },

    // ============================================
    // CATEGORY 6: LINK TESTS
    // ============================================
    "6.A": {
      name: "2.4.4-link-purpose",
      evaluate(pageAnalysis, choices) {
        const { totalLinks, ambiguousLinks, genericLinks, details } =
          pageAnalysis;

        if (totalLinks === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No links found on page",
            reasoning: "Test Does Not Apply - No links exist",
          };
        }

        if (ambiguousLinks > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 85,
            findings: `${ambiguousLinks} link(s) have unclear or missing purpose`,
            reasoning:
              "Links need descriptive text, aria-label, or surrounding context to convey destination/purpose",
          };
        }

        if (genericLinks > 5) {
          return {
            recommendedAnswer: "c",
            confidence: 75,
            findings: `${genericLinks} links use generic text like "click here" or "read more"`,
            reasoning:
              "Generic link text should include aria-label or be in descriptive context",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 80,
          findings: "All links have clear, determinable purpose",
          reasoning: `${totalLinks} links checked - all have descriptive text or proper labels`,
        };
      },
    },

    // ============================================
    // CATEGORY 7: IMAGE TESTS
    // ============================================
    "7.A": {
      name: "1.1.1-meaningful-image-name",
      evaluate(pageAnalysis, choices) {
        const { totalImages, imagesWithoutAlt, emptyAlt, details } =
          pageAnalysis;

        if (totalImages === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No images found on page",
            reasoning: "Test Does Not Apply - No images present",
          };
        }

        // Check for meaningful images without alt
        const meaningfulWithoutAlt = details.filter(
          (img) => !img.hasAlt && !img.ariaLabel && !img.isDecorative
        );

        if (meaningfulWithoutAlt.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 95,
            findings: `${meaningfulWithoutAlt.length} meaningful image(s) missing alt text`,
            reasoning:
              "All meaningful images must have alt attribute or aria-label describing their purpose",
          };
        }

        // Check for images with empty alt that aren't marked decorative
        const suspiciousEmpty = details.filter(
          (img) => img.alt === "" && !img.role && (img.inLink || img.inButton)
        );

        if (suspiciousEmpty.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 80,
            findings: `${suspiciousEmpty.length} functional image(s) have empty alt (may need description)`,
            reasoning:
              "Images in links/buttons typically need descriptive alt text, not empty alt",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 85,
          findings: "All meaningful images have appropriate alt text",
          reasoning: `${totalImages} images checked - all have proper alternative text or labels`,
        };
      },
    },

    "7.B": {
      name: "1.1.1-decorative-image",
      evaluate(pageAnalysis, choices) {
        const { decorativeCount, totalImages, properlyMarked, details } =
          pageAnalysis;

        if (decorativeCount === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 90,
            findings: "No decorative images identified on page",
            reasoning:
              "Test Does Not Apply - Test applies only to purely decorative images",
          };
        }

        const improperlyMarked = decorativeCount - properlyMarked;

        if (improperlyMarked > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 85,
            findings: `${improperlyMarked} decorative image(s) not properly marked`,
            reasoning:
              'Decorative images must have alt="" (empty) or role="presentation/none" with no title attribute',
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 85,
          findings: `${decorativeCount} decorative images properly marked`,
          reasoning:
            'All decorative images have empty alt or role="presentation" to hide from screen readers',
        };
      },
    },

    // ============================================
    // CATEGORY 10: CONTENT STRUCTURE (HEADINGS)
    // ============================================
    "10.A": {
      name: "1.3.1-heading-purpose",
      evaluate(pageAnalysis, choices) {
        const { headingCount, structure } = pageAnalysis;

        if (headingCount === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No headings found on page",
            reasoning: "Test Does Not Apply - No heading elements exist",
          };
        }

        // Check for generic/unclear headings
        const genericHeadings = structure.filter((h) => {
          const text = h.text.toLowerCase();
          return (
            text.length < 3 ||
            ["section", "part", "item", "title"].includes(text)
          );
        });

        if (genericHeadings.length > headingCount / 2) {
          return {
            recommendedAnswer: "c",
            confidence: 75,
            findings: `${genericHeadings.length} heading(s) appear generic or unclear`,
            reasoning:
              "Headings should describe the topic/purpose of their section content",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 80,
          findings: "Headings appear to describe their section content",
          reasoning: `${headingCount} headings checked - text describes purpose of following content`,
        };
      },
    },

    "10.C": {
      name: "1.3.1-heading-level",
      evaluate(pageAnalysis, choices) {
        const { headingCount, isLogical, issues, h1Count, hasH1 } =
          pageAnalysis;

        if (headingCount === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No headings found on page",
            reasoning: "Test Does Not Apply - No heading hierarchy to evaluate",
          };
        }

        if (!hasH1) {
          return {
            recommendedAnswer: "c",
            confidence: 90,
            findings: "Page missing H1 heading",
            reasoning: "Page should have at least one H1 as the main heading",
          };
        }

        if (h1Count > 1) {
          // Multiple H1s can be valid in HTML5 with sections
          return {
            recommendedAnswer: "b",
            confidence: 70,
            findings: `${h1Count} H1 headings found (may be valid with HTML5 sections)`,
            reasoning:
              "Multiple H1s allowed if each marks a distinct section/article. Verify logical structure.",
          };
        }

        if (!isLogical) {
          return {
            recommendedAnswer: "c",
            confidence: 90,
            findings: "Heading hierarchy has logical issues",
            reasoning:
              issues.join("; ") +
              ". Headings should not skip levels (e.g., H2 to H5).",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 90,
          findings: "Heading hierarchy is logical and properly nested",
          reasoning: `${headingCount} headings follow proper structure without skipping levels`,
        };
      },
    },

    // ============================================
    // CATEGORY 12: PAGE TITLES & FRAMES
    // ============================================
    "12.A": {
      name: "2.4.2-page-title-defined",
      evaluate(pageAnalysis, choices) {
        const { titleCount, titleIsEmpty, titleText } = pageAnalysis;

        if (titleCount === 0) {
          return {
            recommendedAnswer: "c",
            confidence: 100,
            findings: "No <title> element found in page <head>",
            reasoning:
              "FAIL - HTML requires exactly one <title> element. This is a 2.4.2 failure.",
          };
        }

        if (titleCount > 1) {
          return {
            recommendedAnswer: "e",
            confidence: 95,
            findings: `${titleCount} <title> elements found (invalid HTML)`,
            reasoning:
              "FAIL - HTML specification allows only one <title> per document. Multiple titles cause confusion.",
          };
        }

        if (titleIsEmpty) {
          return {
            recommendedAnswer: "c",
            confidence: 95,
            findings: "Title element exists but contains no text",
            reasoning:
              "FAIL - Empty <title> does not provide descriptive page identification required by 2.4.2",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 95,
          findings: `Valid page title found: "${titleText}"`,
          reasoning:
            "PASS - Page has exactly one <title> element with descriptive content",
        };
      },
    },

    "12.B": {
      name: "2.4.2-page-title-descriptive",
      evaluate(pageAnalysis, choices) {
        const { title, isDescriptive, suggestions, length } = pageAnalysis;

        if (!title || title.trim() === "") {
          return {
            recommendedAnswer: "c",
            confidence: 100,
            findings: "No title exists to evaluate",
            reasoning:
              "FAIL - Test 12.A must pass before evaluating descriptiveness",
          };
        }

        if (length < 3) {
          return {
            recommendedAnswer: "c",
            confidence: 90,
            findings: `Title too short: "${title}"`,
            reasoning:
              "FAIL - Title must adequately describe page topic/purpose",
          };
        }

        const genericTitles = [
          "untitled",
          "page",
          "document",
          "new page",
          "welcome",
        ];
        if (genericTitles.includes(title.toLowerCase().trim())) {
          return {
            recommendedAnswer: "c",
            confidence: 95,
            findings: `Generic placeholder title: "${title}"`,
            reasoning:
              "FAIL - Title appears to be placeholder text, not descriptive of actual content",
          };
        }

        if (!isDescriptive) {
          return {
            recommendedAnswer: "c",
            confidence: 80,
            findings: `Title may not be sufficiently descriptive: "${title}"`,
            reasoning:
              "FAIL - " +
              (suggestions.length > 0
                ? suggestions.join("; ")
                : "Title should identify page topic/purpose"),
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 85,
          findings: `Title is descriptive: "${title}"`,
          reasoning:
            "PASS - Title identifies page topic and distinguishes it from other pages",
        };
      },
    },

    // ============================================
    // CATEGORY 13: COLOR & CONTRAST TESTS
    // ============================================
    "13.A": {
      name: "1.4.1-color-meaning",
      evaluate(pageAnalysis, choices) {
        const { colorOnlyElements, totalElements } = pageAnalysis;

        if (totalElements === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No elements that rely on color for meaning",
            reasoning: "Test Does Not Apply - No color-coded information found",
          };
        }

        if (colorOnlyElements > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 85,
            findings: `${colorOnlyElements} element(s) use color as sole indicator`,
            reasoning:
              "FAIL - Information must not rely on color alone. Use text labels, icons, or patterns.",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 80,
          findings:
            "Color is not used as the only visual means of conveying information",
          reasoning:
            "PASS - Additional cues (text, icons, patterns) supplement color coding",
        };
      },
    },

    "13.C": {
      name: "1.4.3-contrast",
      evaluate(pageAnalysis, choices) {
        return {
          recommendedAnswer: "e",
          confidence: 50,
          findings: "This test requires color contrast analyzer tool",
          reasoning:
            "NOT TESTED - Use Color Contrast Analyzer (CCA) to verify: Normal text ≥4.5:1, Large text (18pt+/14pt+ bold) ≥3:1",
        };
      },
    },

    // ============================================
    // CATEGORY 14: TABLE TESTS
    // ============================================
    "14.A": {
      name: "1.3.1-table-identification",
      evaluate(pageAnalysis, choices) {
        const { totalTables, details } = pageAnalysis;

        if (totalTables === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No tables found on page",
            reasoning: "Test Does Not Apply - No table structures exist",
          };
        }

        // Check if data tables lack headers
        const dataTablesNoHeaders = details.filter(
          (t) => t.isDataTable && !t.hasHeaders
        );

        if (dataTablesNoHeaders.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 90,
            findings: `${dataTablesNoHeaders.length} data table(s) missing <th> headers`,
            reasoning:
              "FAIL - Data tables must use <th> elements to identify row/column headers",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 85,
          findings: "All data tables properly use <th> elements",
          reasoning: `${totalTables} tables checked - data tables have proper header structure`,
        };
      },
    },

    "14.B": {
      name: "1.3.1-cell-header-association",
      evaluate(pageAnalysis, choices) {
        const { totalTables, details } = pageAnalysis;

        if (totalTables === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No tables found on page",
            reasoning: "Test Does Not Apply - No table structures exist",
          };
        }

        const dataTables = details.filter((t) => t.isDataTable);

        if (dataTables.length === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 90,
            findings: "No data tables identified (only layout tables)",
            reasoning:
              "Test Does Not Apply - Only applies to data tables with headers",
          };
        }

        const tablesWithoutScope = dataTables.filter(
          (t) => t.hasHeaders && !t.hasScope
        );

        if (tablesWithoutScope.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 85,
            findings: `${tablesWithoutScope.length} table(s) missing scope attributes on headers`,
            reasoning:
              "FAIL - <th> elements need scope='col' or scope='row' to associate with data cells",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 80,
          findings: "All data table headers properly associated with cells",
          reasoning:
            "PASS - Tables use scope attributes or headers/id associations correctly",
        };
      },
    },

    "14.C": {
      name: "1.3.1-layout-table-structure",
      evaluate(pageAnalysis, choices) {
        const { totalTables, details } = pageAnalysis;

        if (totalTables === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No tables found on page",
            reasoning: "Test Does Not Apply - No table structures exist",
          };
        }

        const layoutTables = details.filter((t) => !t.isDataTable);

        if (layoutTables.length === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 90,
            findings: "No layout tables identified (only data tables)",
            reasoning:
              "Test Does Not Apply - Only applies to tables used for visual layout",
          };
        }

        const layoutWithHeaders = layoutTables.filter((t) => t.hasHeaders);

        if (layoutWithHeaders.length > 0) {
          return {
            recommendedAnswer: "c",
            confidence: 90,
            findings: `${layoutWithHeaders.length} layout table(s) incorrectly use <th> elements`,
            reasoning:
              "FAIL - Layout tables must NOT use header elements (<th>) as they're not conveying data relationships",
          };
        }

        return {
          recommendedAnswer: "b",
          confidence: 85,
          findings: "Layout tables do not use structural markup incorrectly",
          reasoning:
            "PASS - Layout tables avoid <th>, scope, headers, and other data table markup",
        };
      },
    },

    // ============================================
    // CATEGORY 18: RESIZE TEXT
    // ============================================
    "18.A": {
      name: "1.4.4-resize-text",
      evaluate(pageAnalysis, choices) {
        return {
          recommendedAnswer: "e",
          confidence: 50,
          findings: "This test requires manual browser zoom testing",
          reasoning:
            "NOT TESTED - Use browser zoom to 200% and verify: (1) All text resizes, (2) No horizontal scrolling needed, (3) No content loss/overlap",
        };
      },
    },

    // ============================================
    // CATEGORY 3: FLASHING CONTENT
    // ============================================
    "3.A": {
      name: "2.3.1-flashing",
      evaluate(pageAnalysis, choices) {
        const { hasFlashing, flashingElements } = pageAnalysis;

        if (!hasFlashing || flashingElements === 0) {
          return {
            recommendedAnswer: "d",
            confidence: 100,
            findings: "No flashing content detected",
            reasoning:
              "Test Does Not Apply - No content flashes more than 3 times per second",
          };
        }

        return {
          recommendedAnswer: "e",
          confidence: 100,
          findings: `${flashingElements} potentially flashing element(s) found`,
          reasoning:
            "NOT TESTED - Use Photosensitive Epilepsy Analysis Tool (PEAT) to test if flashing exceeds general flash/red flash thresholds",
        };
      },
    },

    // ============================================
    // CATEGORY 20: PARSING
    // ============================================
    "20.A": {
      name: "4.1.1-parsing",
      evaluate(pageAnalysis, choices) {
        return {
          recommendedAnswer: "e",
          confidence: 100,
          findings: "This test cannot be performed with current tools",
          reasoning:
            "NOT TESTED - Parsing test requires specific validation tools not available. Refers to complete start/end tags, proper nesting, unique IDs.",
        };
      },
    },
  },

  /**
   * Get test logic by ID
   */
  getTestLogic(testId) {
    return this.tests[testId] || null;
  },

  /**
   * Get all available test IDs
   */
  getAllTestIds() {
    return Object.keys(this.tests).sort();
  },

  /**
   * Get test metadata
   */
  getTestInfo(testId) {
    const test = this.tests[testId];
    if (!test) return null;

    return {
      id: testId,
      name: test.name,
      hasAutomation: !!test.evaluate,
    };
  },
};
