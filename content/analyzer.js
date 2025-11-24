// // Page Analyzer - Analyzes web page for accessibility issues
// const PageAnalyzer = {
//   /**
//    * Quick page analysis
//    */
//   quickAnalyze() {
//     return {
//       url: window.location.href,
//       title: document.title,
//       titleCount: document.querySelectorAll("title").length,
//       imageCount: document.querySelectorAll("img").length,
//       imagesWithAlt: document.querySelectorAll("img[alt]").length,
//       formCount: document.querySelectorAll("form").length,
//       formFieldCount: document.querySelectorAll("input, select, textarea")
//         .length,
//       linkCount: document.querySelectorAll("a[href]").length,
//       headingCount: document.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
//       tableCount: document.querySelectorAll("table").length,
//       frameCount: document.querySelectorAll("frame, iframe").length,
//     };
//   },

//   /**
//    * Analyze page for specific test
//    */
//   analyzeForTest(testId) {
//     const analyzers = {
//       "4.A": () => this.analyzeKeyboardAccess(),
//       "4.C": () => this.analyzeKeyboardTrap(),
//       "4.D": () => this.analyzeFocusVisible(),
//       "5.A": () => this.analyzeFormLabels(),
//       "5.C": () => this.analyzeProgrammaticLabels(),
//       "6.A": () => this.analyzeLinkPurpose(),
//       "7.A": () => this.analyzeMeaningfulImages(),
//       "7.B": () => this.analyzeDecorativeImages(),
//       "10.C": () => this.analyzeHeadingLevels(),
//       "12.A": () => this.analyzePageTitleDefined(),
//       "12.B": () => this.analyzePageTitleDescriptive(),
//       "13.C": () => this.analyzeContrast(),
//       "14.A": () => this.analyzeTableHeaders(),
//     };

//     const analyzer = analyzers[testId];
//     if (analyzer) {
//       return analyzer();
//     }

//     return { error: "Test not supported" };
//   },

//   /**
//    * Test 12.A: Page Title Defined
//    */
//   analyzePageTitleDefined() {
//     const titles = document.querySelectorAll("title");
//     const titleCount = titles.length;
//     const titleText = document.title;

//     return {
//       testId: "12.A",
//       titleCount: titleCount,
//       titleText: titleText,
//       hasTitleElement: titleCount > 0,
//       hasMultipleTitles: titleCount > 1,
//       titleIsEmpty: !titleText || titleText.trim() === "",
//       rawHTML: document.head.innerHTML,
//     };
//   },

//   /**
//    * Test 12.B: Page Title Descriptive
//    */
//   analyzePageTitleDescriptive() {
//     const title = document.title;
//     const isDescriptive =
//       title &&
//       title.trim().length > 3 &&
//       !["untitled", "page", "document", "new page"].includes(
//         title.toLowerCase().trim()
//       );

//     return {
//       testId: "12.B",
//       title: title,
//       isDescriptive: isDescriptive,
//       length: title.length,
//       suggestions: this.getTitleSuggestions(title),
//     };
//   },

//   getTitleSuggestions(title) {
//     const suggestions = [];

//     if (!title || title.trim().length < 3) {
//       suggestions.push("Title is too short or empty");
//     }

//     if (title.toLowerCase().includes("untitled")) {
//       suggestions.push("Title appears to be a placeholder");
//     }

//     return suggestions;
//   },

//   /**
//    * Test 7.A: Meaningful Images
//    */
//   analyzeMeaningfulImages() {
//     const images = Array.from(document.querySelectorAll("img"));
//     const analysis = images.map((img) => ({
//       src: img.src,
//       alt: img.alt,
//       hasAlt: img.hasAttribute("alt"),
//       altLength: (img.alt || "").length,
//       role: img.getAttribute("role"),
//       ariaLabel: img.getAttribute("aria-label"),
//       isDecorative:
//         img.getAttribute("role") === "presentation" || img.alt === "",
//       inLink: img.closest("a") !== null,
//       inButton: img.closest("button") !== null,
//     }));

//     return {
//       testId: "7.A",
//       totalImages: images.length,
//       imagesWithAlt: analysis.filter((i) => i.hasAlt).length,
//       imagesWithoutAlt: analysis.filter((i) => !i.hasAlt).length,
//       emptyAlt: analysis.filter((i) => i.alt === "").length,
//       details: analysis,
//     };
//   },

//   /**
//    * Test 7.B: Decorative Images
//    */
//   analyzeDecorativeImages() {
//     const images = Array.from(document.querySelectorAll("img"));
//     const decorative = images.filter(
//       (img) =>
//         img.getAttribute("role") === "presentation" ||
//         img.getAttribute("role") === "none" ||
//         img.alt === ""
//     );

//     return {
//       testId: "7.B",
//       decorativeCount: decorative.length,
//       totalImages: images.length,
//       properlyMarked: decorative.filter(
//         (img) =>
//           (img.alt === "" && !img.getAttribute("title")) ||
//           img.getAttribute("role") === "presentation"
//       ).length,
//       details: decorative.map((img) => ({
//         src: img.src,
//         alt: img.alt,
//         role: img.getAttribute("role"),
//       })),
//     };
//   },

//   /**
//    * Test 10.C: Heading Levels
//    */
//   analyzeHeadingLevels() {
//     const headings = Array.from(
//       document.querySelectorAll("h1, h2, h3, h4, h5, h6")
//     );
//     const structure = headings.map((h) => ({
//       level: parseInt(h.tagName[1]),
//       text: h.textContent.trim(),
//       tag: h.tagName,
//     }));

//     // Check for logical progression
//     let isLogical = true;
//     const issues = [];

//     for (let i = 1; i < structure.length; i++) {
//       const prev = structure[i - 1].level;
//       const curr = structure[i].level;

//       // Check for skipping levels downward (e.g., h2 to h5)
//       if (curr > prev + 1) {
//         issues.push(`Heading level skipped from h${prev} to h${curr}`);
//       }
//     }

//     return {
//       testId: "10.C",
//       headingCount: headings.length,
//       structure: structure,
//       hasH1: structure.some((h) => h.level === 1),
//       h1Count: structure.filter((h) => h.level === 1).length,
//       isLogical: issues.length === 0,
//       issues: issues,
//     };
//   },

//   /**
//    * Test 6.A: Link Purpose
//    */
//   analyzeLinkPurpose() {
//     const links = Array.from(document.querySelectorAll("a[href]"));
//     const analysis = links.map((link) => {
//       const text = link.textContent.trim();
//       const ariaLabel = link.getAttribute("aria-label");
//       const title = link.getAttribute("title");
//       const genericTexts = [
//         "click here",
//         "read more",
//         "more",
//         "link",
//         "here",
//         "click",
//       ];

//       return {
//         text: text,
//         href: link.href,
//         ariaLabel: ariaLabel,
//         title: title,
//         hasText: text.length > 0,
//         isGeneric: genericTexts.includes(text.toLowerCase()),
//         hasAriaLabel: !!ariaLabel,
//         hasTitle: !!title,
//       };
//     });

//     const ambiguousLinks = analysis.filter(
//       (l) => !l.hasText || (l.isGeneric && !l.ariaLabel && !l.title)
//     );

//     return {
//       testId: "6.A",
//       totalLinks: links.length,
//       ambiguousLinks: ambiguousLinks.length,
//       linksWithText: analysis.filter((l) => l.hasText).length,
//       genericLinks: analysis.filter((l) => l.isGeneric).length,
//       details: analysis.slice(0, 10), // First 10 links
//     };
//   },

//   /**
//    * Test 5.A & 5.C: Form Labels
//    */
//   analyzeFormLabels() {
//     const formFields = Array.from(
//       document.querySelectorAll("input, select, textarea")
//     );
//     const analysis = formFields.map((field) => {
//       const id = field.id;
//       const label = id ? document.querySelector(`label[for="${id}"]`) : null;
//       const ariaLabel = field.getAttribute("aria-label");
//       const ariaLabelledby = field.getAttribute("aria-labelledby");
//       const placeholder = field.getAttribute("placeholder");

//       return {
//         type: field.type || field.tagName.toLowerCase(),
//         id: id,
//         hasLabel: !!label,
//         labelText: label ? label.textContent.trim() : "",
//         hasAriaLabel: !!ariaLabel,
//         hasAriaLabelledby: !!ariaLabelledby,
//         hasPlaceholder: !!placeholder,
//         hasProgrammaticLabel: !!label || !!ariaLabel || !!ariaLabelledby,
//       };
//     });

//     return {
//       testId: "5.C",
//       totalFields: formFields.length,
//       fieldsWithLabels: analysis.filter((f) => f.hasProgrammaticLabel).length,
//       fieldsWithoutLabels: analysis.filter((f) => !f.hasProgrammaticLabel)
//         .length,
//       onlyPlaceholder: analysis.filter(
//         (f) => f.hasPlaceholder && !f.hasProgrammaticLabel
//       ).length,
//       details: analysis,
//     };
//   },

//   analyzeProgrammaticLabels() {
//     return this.analyzeFormLabels();
//   },

//   /**
//    * Test 14.A: Table Headers
//    */
//   analyzeTableHeaders() {
//     const tables = Array.from(document.querySelectorAll("table"));
//     const analysis = tables.map((table) => {
//       const headers = table.querySelectorAll("th");
//       const hasHeaders = headers.length > 0;
//       const hasScope = Array.from(headers).every((th) =>
//         th.hasAttribute("scope")
//       );
//       const rows = table.querySelectorAll("tr").length;
//       const cells = table.querySelectorAll("td, th").length;

//       return {
//         hasHeaders: hasHeaders,
//         headerCount: headers.length,
//         hasScope: hasScope,
//         rows: rows,
//         cells: cells,
//         isDataTable: hasHeaders || table.querySelectorAll("td").length > 10,
//       };
//     });

//     return {
//       testId: "14.A",
//       totalTables: tables.length,
//       tablesWithHeaders: analysis.filter((t) => t.hasHeaders).length,
//       tablesWithoutHeaders: analysis.filter(
//         (t) => !t.hasHeaders && t.isDataTable
//       ).length,
//       details: analysis,
//     };
//   },

//   /**
//    * Keyboard Access Tests
//    */
//   analyzeKeyboardAccess() {
//     const interactive = document.querySelectorAll(
//       "a, button, input, select, textarea, [tabindex], [onclick]"
//     );
//     const analysis = Array.from(interactive).map((el) => ({
//       tagName: el.tagName,
//       tabindex: el.getAttribute("tabindex"),
//       isFocusable: el.tabIndex >= 0,
//       hasClick: el.hasAttribute("onclick"),
//       role: el.getAttribute("role"),
//     }));

//     return {
//       testId: "4.A",
//       interactiveElements: interactive.length,
//       focusableElements: analysis.filter((a) => a.isFocusable).length,
//       details: analysis,
//     };
//   },

//   analyzeKeyboardTrap() {
//     // This requires manual testing, provide guidance
//     return {
//       testId: "4.C",
//       requiresManualTest: true,
//       guidance:
//         "Tab through all focusable elements to check for keyboard traps",
//       focusableCount: document.querySelectorAll(
//         'a, button, input, select, textarea, [tabindex="0"]'
//       ).length,
//     };
//   },

//   analyzeFocusVisible() {
//     // Check for focus styles
//     const focusable = document.querySelectorAll(
//       "a, button, input, select, textarea"
//     );

//     return {
//       testId: "4.D",
//       focusableElements: focusable.length,
//       requiresManualTest: true,
//       guidance: "Tab through elements and verify visible focus indicators",
//     };
//   },

//   analyzeContrast() {
//     return {
//       testId: "13.C",
//       requiresManualTest: true,
//       guidance: "Use Color Contrast Analyzer to test contrast ratios",
//       textElements: document.querySelectorAll(
//         "p, h1, h2, h3, h4, h5, h6, span, div, a"
//       ).length,
//     };
//   },

//   /**
//    * Run specific test and return recommendation
//    */
//   runSpecificTest(testId) {
//     const analysis = this.analyzeForTest(testId);
//     const result = this.interpretResults(testId, analysis);

//     return {
//       status: result.status,
//       findings: result.findings,
//       details: result.details,
//     };
//   },

//   interpretResults(testId, analysis) {
//     const interpreters = {
//       "12.A": (data) => {
//         if (data.titleCount === 0) {
//           return {
//             status: "FAIL",
//             findings: "No <title> element found",
//             details:
//               "The page must have exactly one <title> element in the <head> section",
//           };
//         } else if (data.titleCount > 1) {
//           return {
//             status: "FAIL",
//             findings: `${data.titleCount} <title> elements found`,
//             details: "Only one <title> element is allowed per page",
//           };
//         } else if (data.titleIsEmpty) {
//           return {
//             status: "FAIL",
//             findings: "Title element exists but is empty",
//             details: "The <title> must contain descriptive text",
//           };
//         } else {
//           return {
//             status: "PASS",
//             findings: `Page has valid title: "${data.titleText}"`,
//             details: "One <title> element with descriptive text",
//           };
//         }
//       },

//       "12.B": (data) => {
//         if (data.isDescriptive) {
//           return {
//             status: "PASS",
//             findings: `Title is descriptive: "${data.title}"`,
//             details: "Title adequately describes the page purpose",
//           };
//         } else {
//           return {
//             status: "FAIL",
//             findings: `Title not descriptive enough: "${data.title}"`,
//             details: data.suggestions.join("; "),
//           };
//         }
//       },

//       "7.A": (data) => {
//         if (data.imagesWithoutAlt > 0) {
//           return {
//             status: "FAIL",
//             findings: `${data.imagesWithoutAlt} image(s) missing alt attribute`,
//             details: "All meaningful images must have alt text",
//           };
//         } else {
//           return {
//             status: "PASS",
//             findings: "All images have alt attributes",
//             details: `${data.totalImages} images checked`,
//           };
//         }
//       },

//       "10.C": (data) => {
//         if (data.isLogical) {
//           return {
//             status: "PASS",
//             findings: "Heading structure is logical",
//             details: `${data.headingCount} headings with proper hierarchy`,
//           };
//         } else {
//           return {
//             status: "FAIL",
//             findings: "Heading structure issues found",
//             details: data.issues.join("; "),
//           };
//         }
//       },
//     };

//     const interpreter = interpreters[testId];
//     if (interpreter) {
//       return interpreter(analysis);
//     }

//     return {
//       status: "UNKNOWN",
//       findings: "Manual testing required",
//       details: JSON.stringify(analysis),
//     };
//   },
// };

/**
 * Trusted Tester Page Analyzer v5.2.0
 * Complete implementation of all accessibility test analyzers
 */

const PageAnalyzer = {
  /**
   * Quick page analysis - Overview of all accessibility features
   */
  quickAnalyze() {
    return {
      url: window.location.href,
      title: document.title,
      titleCount: document.querySelectorAll("title").length,

      // Images
      imageCount: document.querySelectorAll("img").length,
      imagesWithAlt: document.querySelectorAll("img[alt]").length,
      imagesNoAlt: document.querySelectorAll("img:not([alt])").length,

      // Forms
      formCount: document.querySelectorAll("form").length,
      formFieldCount: document.querySelectorAll("input, select, textarea")
        .length,

      // Links
      linkCount: document.querySelectorAll("a[href]").length,

      // Structure
      headingCount: document.querySelectorAll("h1, h2, h3, h4, h5, h6").length,
      h1Count: document.querySelectorAll("h1").length,
      landmarkCount: document.querySelectorAll(
        "main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]"
      ).length,

      // Tables
      tableCount: document.querySelectorAll("table").length,

      // Frames
      frameCount: document.querySelectorAll("frame, iframe").length,

      // Interactive
      buttonCount: document.querySelectorAll("button, [role='button']").length,

      // ARIA
      ariaLiveCount: document.querySelectorAll("[aria-live]").length,
      ariaHiddenCount: document.querySelectorAll("[aria-hidden='true']").length,

      // Language
      pageLang: document.documentElement.lang || "not set",

      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Analyze page for specific test
   */
  analyzeForTest(testId) {
    const analyzers = {
      // Category 1: Conforming Alternate Version
      "1.A": () => this.analyzeConformingAlternate(),

      // Category 2: Auto-Playing Content
      "2.A": () => this.analyzeAutoPlayingAudio(),
      "2.B": () => this.analyzeAutoUpdatingContent(),

      // Category 3: Flashing
      "3.A": () => this.analyzeFlashing(),

      // Category 4: Keyboard & Focus
      "4.A": () => this.analyzeKeyboardAccess(),
      "4.B": () => this.analyzeKeyboardAccessForControls(),
      "4.C": () => this.analyzeKeyboardTrap(),
      "4.D": () => this.analyzeFocusVisible(),
      "4.E": () => this.analyzeOnFocus(),
      "4.F": () => this.analyzeFocusOrder(),
      "4.G": () => this.analyzeCharacterKeyShortcuts(),

      // Category 5: Forms
      "5.A": () => this.analyzeFormLabels(),
      "5.B": () => this.analyzeFormLabelDescriptiveness(),
      "5.C": () => this.analyzeProgrammaticLabels(),
      "5.D": () => this.analyzeOnInput(),
      "5.E": () => this.analyzeFormComponentsNameRoleValue(),
      "5.F": () => this.analyzeErrorIdentification(),
      "5.G": () => this.analyzeErrorSuggestion(),
      "5.H": () => this.analyzeErrorPrevention(),
      "5.I": () => this.analyzeIdentifyInputPurpose(),

      // Category 6: Links
      "6.A": () => this.analyzeLinkPurpose(),

      // Category 7: Images
      "7.A": () => this.analyzeMeaningfulImages(),
      "7.B": () => this.analyzeDecorativeImages(),
      "7.C": () => this.analyzeCaptcha(),
      "7.D": () => this.analyzeImagesOfText(),
      "7.E": () => this.analyzeImageNameRoleValue(),

      // Category 8: Time Limits
      "8.A": () => this.analyzeTimeLimits(),

      // Category 9: Repetitive Content
      "9.A": () => this.analyzeBypassBlocks(),
      "9.B": () => this.analyzeBypassBlocksLinks(),

      // Category 10: Content Structure
      "10.A": () => this.analyzeHeadingDescriptive(),
      "10.B": () => this.analyzeVisualHeadingsProgrammatic(),
      "10.C": () => this.analyzeHeadingLevels(),
      "10.D": () => this.analyzeLists(),

      // Category 11: Language
      "11.A": () => this.analyzePageLanguage(),
      "11.B": () => this.analyzePartLanguage(),

      // Category 12: Page Titles & Frames
      "12.A": () => this.analyzePageTitleDefined(),
      "12.B": () => this.analyzePageTitleDescriptive(),
      "12.C": () => this.analyzeFrameTitles(),
      "12.D": () => this.analyzeIframeTitles(),

      // Category 13: Sensory & Contrast
      "13.A": () => this.analyzeSensoryCharacteristics(),
      "13.B": () => this.analyzeColorMeaning(),
      "13.C": () => this.analyzeContrast(),
      "13.D": () => this.analyzeNonTextContrast(),

      // Category 14: Tables
      "14.A": () => this.analyzeTableHeaders(),
      "14.B": () => this.analyzeTableHeaderAssociation(),
      "14.C": () => this.analyzeLayoutTables(),

      // Category 15: CSS Positioning
      "15.A": () => this.analyzeCSSPositioning(),

      // Category 16: Audio/Video
      "16.A": () => this.analyzeAudioVideoAlternative(),
      "16.B": () => this.analyzeCaptions(),
      "16.C": () => this.analyzeAudioDescription(),

      // Category 17: Synchronized Media
      "17.A": () => this.analyzeMediaAlternative(),
      "17.B": () => this.analyzeCaptionsLive(),
      "17.C": () => this.analyzeAudioDescriptionPrerecorded(),

      // Category 18: Resize Text
      "18.A": () => this.analyzeResizeText(),

      // Category 19: Multiple Ways
      "19.A": () => this.analyzeMultipleWays(),

      // Category 20: Parsing
      "20.A": () => this.analyzeParsing(),
    };

    const analyzer = analyzers[testId];
    if (analyzer) {
      try {
        return analyzer();
      } catch (error) {
        return {
          error: true,
          message: `Error analyzing test ${testId}: ${error.message}`,
          testId: testId,
        };
      }
    }

    return {
      error: true,
      message: `Test ${testId} not supported`,
      testId: testId,
    };
  },

  // ============================================
  // CATEGORY 1: CONFORMING ALTERNATE VERSION
  // ============================================

  analyzeConformingAlternate() {
    return {
      testId: "1.A",
      requiresManualTest: true,
      guidance:
        "Check if page offers a conforming alternate version that meets all WCAG requirements",
      hasAlternateLink:
        document.querySelectorAll('a[href*="accessible"], a[href*="text-only"]')
          .length > 0,
    };
  },

  // ============================================
  // CATEGORY 2: AUTO-PLAYING CONTENT
  // ============================================

  analyzeAutoPlayingAudio() {
    const audioElements = document.querySelectorAll(
      "audio[autoplay], video[autoplay]"
    );
    const hasAutoplay = audioElements.length > 0;

    return {
      testId: "2.A",
      hasAutoplay: hasAutoplay,
      autoplayCount: audioElements.length,
      elements: Array.from(audioElements).map((el) => ({
        type: el.tagName.toLowerCase(),
        hasControls: el.hasAttribute("controls"),
        duration: el.duration || "unknown",
      })),
      requiresManualTest: hasAutoplay,
      guidance: hasAutoplay
        ? "Verify audio plays for less than 3 seconds OR has pause/stop/volume control"
        : null,
    };
  },

  analyzeAutoUpdatingContent() {
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    const hasAutoUpdate = !!metaRefresh;

    return {
      testId: "2.B",
      hasMetaRefresh: hasAutoUpdate,
      refreshContent: metaRefresh ? metaRefresh.getAttribute("content") : null,
      requiresManualTest: true,
      guidance:
        "Check for auto-updating content (news tickers, carousels, etc.) and verify pause/stop mechanism",
    };
  },

  // ============================================
  // CATEGORY 3: FLASHING
  // ============================================

  analyzeFlashing() {
    // Look for elements that might flash (animations, videos, GIFs)
    const videos = document.querySelectorAll("video");
    const gifs = Array.from(document.querySelectorAll("img")).filter((img) =>
      img.src.toLowerCase().includes(".gif")
    );
    const animations = document.querySelectorAll(
      '[class*="flash"], [class*="blink"], [class*="strobe"]'
    );

    const potentialFlashing = videos.length + gifs.length + animations.length;

    return {
      testId: "3.A",
      hasFlashing: potentialFlashing > 0,
      flashingElements: potentialFlashing,
      videos: videos.length,
      animatedGifs: gifs.length,
      animations: animations.length,
      requiresManualTest: potentialFlashing > 0,
      guidance:
        potentialFlashing > 0
          ? "Use Photosensitive Epilepsy Analysis Tool (PEAT) to verify no content flashes more than 3 times in 1 second"
          : "No flashing content detected",
    };
  },

  // ============================================
  // CATEGORY 4: KEYBOARD ACCESS AND FOCUS
  // ============================================

  analyzeKeyboardAccess() {
    const interactive = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex], [onclick], [role="button"], [role="link"], [role="menuitem"]'
    );

    const analysis = Array.from(interactive).map((el) => {
      const tabindex = el.getAttribute("tabindex");
      const isFocusable =
        el.tabIndex >= 0 ||
        ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(el.tagName);

      return {
        tagName: el.tagName,
        tabindex: tabindex,
        isFocusable: isFocusable,
        hasClick: el.hasAttribute("onclick"),
        hasMouseOver: el.hasAttribute("onmouseover"),
        role: el.getAttribute("role"),
        selector: this.getElementSelector(el),
      };
    });

    const nonFocusableInteractive = analysis.filter(
      (el) =>
        !el.isFocusable &&
        (el.hasClick || el.role === "button" || el.role === "link")
    );

    return {
      testId: "4.A",
      interactiveElements: interactive.length,
      focusableElements: analysis.filter((a) => a.isFocusable).length,
      nonFocusableInteractive: nonFocusableInteractive.length,
      details: analysis,
      issues: nonFocusableInteractive.map(
        (el) =>
          `${el.tagName} with ${
            el.role || "click handler"
          } is not keyboard focusable`
      ),
    };
  },

  analyzeKeyboardAccessForControls() {
    const mediaElements = document.querySelectorAll("video, audio");
    const customControls = document.querySelectorAll(
      '[class*="play"], [class*="pause"], [class*="volume"], [id*="play"], [id*="pause"]'
    );

    return {
      testId: "4.B",
      hasMedia: mediaElements.length > 0,
      mediaCount: mediaElements.length,
      customControlsCount: customControls.length,
      requiresManualTest: mediaElements.length > 0,
      guidance:
        "Verify all media controls (play, pause, volume, etc.) are keyboard accessible",
    };
  },

  analyzeKeyboardTrap() {
    const focusableCount = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex="0"], [tabindex="-1"]'
    ).length;

    return {
      testId: "4.C",
      focusableCount: focusableCount,
      requiresManualTest: true,
      guidance:
        "Tab through all focusable elements. Verify focus can move away from every element. Check modals trap focus appropriately but have keyboard close (Esc).",
    };
  },

  analyzeFocusVisible() {
    const focusable = document.querySelectorAll(
      "a, button, input, select, textarea, [tabindex='0']"
    );

    // Check for CSS that might hide focus
    const styleSheets = Array.from(document.styleSheets);
    let hasFocusStyles = false;

    try {
      styleSheets.forEach((sheet) => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          hasFocusStyles = rules.some(
            (rule) => rule.selectorText && rule.selectorText.includes(":focus")
          );
        } catch (e) {
          // Cross-origin stylesheet, skip
        }
      });
    } catch (e) {
      // Cannot access stylesheets
    }

    return {
      testId: "4.D",
      focusableElements: focusable.length,
      hasFocusStyles: hasFocusStyles,
      requiresManualTest: true,
      guidance:
        "Tab through all focusable elements and verify each has visible focus indicator (outline, border, background change, etc.)",
    };
  },

  analyzeOnFocus() {
    return {
      testId: "4.E",
      requiresManualTest: true,
      guidance:
        "Tab to each focusable element and verify receiving focus does NOT cause unexpected context change (navigation, form submission, new window)",
    };
  },

  analyzeFocusOrder() {
    const focusable = Array.from(
      document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    const focusOrder = focusable.map((el, index) => ({
      index: index,
      tabindex: el.tabIndex,
      tagName: el.tagName,
      position: el.getBoundingClientRect(),
      text:
        el.textContent?.trim().substring(0, 50) ||
        el.getAttribute("aria-label") ||
        "",
    }));

    return {
      testId: "4.F",
      focusableCount: focusable.length,
      focusOrder: focusOrder,
      hasCustomTabindex: focusable.some(
        (el) =>
          el.getAttribute("tabindex") &&
          parseInt(el.getAttribute("tabindex")) > 0
      ),
      requiresManualTest: true,
      guidance:
        "Tab through page and verify focus order follows logical reading/navigation sequence",
    };
  },

  analyzeCharacterKeyShortcuts() {
    // Look for keyboard event listeners
    const hasKeyboardListeners =
      document.querySelectorAll("[onkeydown], [onkeyup], [onkeypress]").length >
      0;

    return {
      testId: "4.G",
      hasKeyboardListeners: hasKeyboardListeners,
      requiresManualTest: true,
      guidance:
        "Check if single character key shortcuts exist. If yes, verify they can be disabled, remapped, or only active on focus.",
    };
  },

  // ============================================
  // CATEGORY 5: FORMS
  // ============================================

  analyzeFormLabels() {
    const formFields = Array.from(
      document.querySelectorAll("input:not([type='hidden']), select, textarea")
    );

    const analysis = formFields.map((field) => {
      const id = field.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = field.getAttribute("aria-label");
      const ariaLabelledby = field.getAttribute("aria-labelledby");
      const placeholder = field.getAttribute("placeholder");
      const title = field.getAttribute("title");

      const hasVisibleLabel = !!(label || ariaLabel || title || placeholder);

      return {
        type: field.type || field.tagName.toLowerCase(),
        id: id,
        hasLabel: !!label,
        labelText: label ? label.textContent.trim() : "",
        hasAriaLabel: !!ariaLabel,
        ariaLabel: ariaLabel,
        hasAriaLabelledby: !!ariaLabelledby,
        hasPlaceholder: !!placeholder,
        placeholder: placeholder,
        hasTitle: !!title,
        hasVisibleLabel: hasVisibleLabel,
        hasProgrammaticLabel: !!label || !!ariaLabel || !!ariaLabelledby,
      };
    });

    const withoutVisibleLabel = analysis.filter((f) => !f.hasVisibleLabel);
    const withoutProgrammaticLabel = analysis.filter(
      (f) => !f.hasProgrammaticLabel
    );

    return {
      testId: "5.A",
      totalFields: formFields.length,
      fieldsWithVisibleLabels: analysis.filter((f) => f.hasVisibleLabel).length,
      fieldsWithoutVisibleLabels: withoutVisibleLabel.length,
      fieldsWithLabels: analysis.filter((f) => f.hasProgrammaticLabel).length,
      fieldsWithoutLabels: withoutProgrammaticLabel.length,
      onlyPlaceholder: analysis.filter(
        (f) => f.hasPlaceholder && !f.hasProgrammaticLabel
      ).length,
      details: analysis,
    };
  },

  analyzeFormLabelDescriptiveness() {
    const labels = Array.from(document.querySelectorAll("label"));

    const genericLabels = labels.filter((label) => {
      const text = label.textContent.trim().toLowerCase();
      return (
        text.length < 2 || ["input", "field", "enter", "type"].includes(text)
      );
    });

    return {
      testId: "5.B",
      totalLabels: labels.length,
      genericLabels: genericLabels.length,
      requiresManualTest: true,
      guidance:
        "Verify all form labels clearly describe the purpose/expected input",
    };
  },

  analyzeProgrammaticLabels() {
    return this.analyzeFormLabels(); // Same as 5.A but focus on programmatic aspect
  },

  analyzeOnInput() {
    return {
      testId: "5.D",
      requiresManualTest: true,
      guidance:
        "Interact with form controls (change values, select options). Verify no unexpected context changes occur (navigation, submission, etc.)",
    };
  },

  analyzeFormComponentsNameRoleValue() {
    const formComponents = Array.from(
      document.querySelectorAll(
        'input, select, textarea, button, [role="button"], [role="checkbox"], [role="radio"], [role="combobox"]'
      )
    );

    const analysis = formComponents.map((el) => {
      const name =
        el.getAttribute("aria-label") ||
        el.getAttribute("aria-labelledby") ||
        (el.id &&
          document.querySelector(`label[for="${el.id}"]`)?.textContent) ||
        el.getAttribute("title") ||
        el.value ||
        el.textContent;

      const role = el.getAttribute("role") || el.tagName.toLowerCase();
      const ariaChecked = el.getAttribute("aria-checked");
      const ariaExpanded = el.getAttribute("aria-expanded");
      const ariaPressed = el.getAttribute("aria-pressed");

      return {
        tagName: el.tagName,
        hasName: !!name && name.trim().length > 0,
        hasRole: !!role,
        exposeStates: !!(
          ariaChecked ||
          ariaExpanded ||
          ariaPressed ||
          el.checked !== undefined
        ),
        name: name?.substring(0, 50),
        role: role,
      };
    });

    const incomplete = analysis.filter((el) => !el.hasName || !el.hasRole);

    return {
      testId: "5.E",
      totalComponents: formComponents.length,
      completeComponents: analysis.filter(
        (el) => el.hasName && el.hasRole && el.exposeStates
      ).length,
      incompleteComponents: incomplete.length,
      details: analysis,
    };
  },

  analyzeErrorIdentification() {
    const forms = document.querySelectorAll("form");
    const errorElements = document.querySelectorAll(
      '[class*="error"], [role="alert"], [aria-invalid="true"]'
    );

    return {
      testId: "5.F",
      hasForms: forms.length > 0,
      formCount: forms.length,
      errorElementsCount: errorElements.length,
      requiresManualTest: true,
      guidance:
        "Submit form with errors. Verify errors are identified in text and described to user.",
    };
  },

  analyzeErrorSuggestion() {
    return {
      testId: "5.G",
      requiresManualTest: true,
      guidance:
        "Submit form with errors. Verify correction suggestions are provided (format examples, required info, etc.)",
    };
  },

  analyzeErrorPrevention() {
    const forms = Array.from(document.querySelectorAll("form"));
    const hasSubmitButton = forms.some((form) =>
      form.querySelector('[type="submit"]')
    );
    const hasConfirmation =
      document.querySelectorAll('[class*="confirm"], [role="dialog"]').length >
      0;

    return {
      testId: "5.H",
      hasForms: forms.length > 0,
      hasSubmitButton: hasSubmitButton,
      hasConfirmation: hasConfirmation,
      requiresManualTest: true,
      guidance:
        "For legal/financial transactions, verify submissions are reversible, reviewable before final submission, or require confirmation",
    };
  },

  analyzeIdentifyInputPurpose() {
    const personalInfoFields = Array.from(document.querySelectorAll("input"))
      .filter((input) => {
        const name = (input.name || input.id || "").toLowerCase();
        const type = input.type;
        const autocomplete = input.getAttribute("autocomplete");

        const personalInfoPatterns = [
          "name",
          "email",
          "tel",
          "phone",
          "address",
          "street",
          "city",
          "state",
          "zip",
          "postal",
          "country",
          "bday",
          "birthday",
          "cc-",
          "card",
        ];

        const isPersonalInfo =
          personalInfoPatterns.some((pattern) => name.includes(pattern)) ||
          ["email", "tel"].includes(type);

        return {
          element: input,
          isPersonalInfo: isPersonalInfo,
          hasAutocomplete: !!autocomplete,
          autocomplete: autocomplete,
          autocompleteValid:
            autocomplete && this.isValidAutocomplete(autocomplete),
        };
      })
      .filter((item) => item.isPersonalInfo);

    return {
      testId: "5.I",
      personalInfoFieldCount: personalInfoFields.length,
      fieldsWithValidAutocomplete: personalInfoFields.filter(
        (f) => f.autocompleteValid
      ).length,
      fieldsWithoutAutocomplete: personalInfoFields.filter(
        (f) => !f.hasAutocomplete
      ).length,
      details: personalInfoFields,
    };
  },

  isValidAutocomplete(value) {
    const validTokens = [
      "name",
      "honorific-prefix",
      "given-name",
      "additional-name",
      "family-name",
      "honorific-suffix",
      "nickname",
      "email",
      "username",
      "new-password",
      "current-password",
      "organization",
      "street-address",
      "address-line1",
      "address-line2",
      "address-level1",
      "address-level2",
      "country",
      "country-name",
      "postal-code",
      "cc-name",
      "cc-number",
      "cc-exp",
      "cc-exp-month",
      "cc-exp-year",
      "cc-csc",
      "cc-type",
      "tel",
      "tel-country-code",
      "tel-national",
      "tel-area-code",
      "tel-local",
      "bday",
      "bday-day",
      "bday-month",
      "bday-year",
    ];

    return validTokens.includes(value.toLowerCase());
  },

  // ============================================
  // CATEGORY 6: LINKS
  // ============================================

  analyzeLinkPurpose() {
    const links = Array.from(document.querySelectorAll("a[href]"));

    const analysis = links.map((link) => {
      const text = link.textContent.trim();
      const ariaLabel = link.getAttribute("aria-label");
      const title = link.getAttribute("title");
      const genericTexts = [
        "click here",
        "read more",
        "more",
        "link",
        "here",
        "click",
        "view",
      ];

      // Get programmatic context
      const listItem = link.closest("li");
      const paragraph = link.closest("p");
      const heading = this.getPrecedingHeading(link);

      return {
        text: text,
        href: link.href,
        ariaLabel: ariaLabel,
        title: title,
        hasText: text.length > 0,
        isGeneric: genericTexts.includes(text.toLowerCase()),
        hasAriaLabel: !!ariaLabel,
        hasTitle: !!title,
        hasContext: !!(listItem || paragraph || heading),
        context: heading?.textContent?.substring(0, 50),
        programmaticContext: !!(listItem || paragraph),
      };
    });

    const ambiguousLinks = analysis.filter(
      (l) =>
        (!l.hasText && !l.ariaLabel && !l.title) ||
        (l.isGeneric && !l.ariaLabel && !l.title && !l.hasContext)
    );

    return {
      testId: "6.A",
      totalLinks: links.length,
      ambiguousLinks: ambiguousLinks.length,
      linksWithText: analysis.filter((l) => l.hasText).length,
      genericLinks: analysis.filter((l) => l.isGeneric).length,
      linksWithContext: analysis.filter((l) => l.hasContext).length,
      details: analysis.slice(0, 20),
    };
  },

  getPrecedingHeading(element) {
    let current = element.previousElementSibling;
    while (current) {
      if (current.matches("h1, h2, h3, h4, h5, h6")) {
        return current;
      }
      current = current.previousElementSibling;
    }
    return null;
  },

  // ============================================
  // CATEGORY 7: IMAGES
  // ============================================

  analyzeMeaningfulImages() {
    // Use enhanced ImageScanner if available
    if (typeof ImageScanner !== 'undefined') {
      const scanResults = ImageScanner.scanAllImages();
      const test7A = scanResults.tests['7.A'];

      return {
        testId: "7.A",
        totalImages: scanResults.totalImages,
        meaningfulImages: scanResults.images.filter(i => i.isMeaningful).length,
        imagesWithAlt: scanResults.images.filter(i => i.hasAlt).length,
        imagesWithoutAlt: test7A.failedImages ? test7A.failedImages.length : 0,
        emptyAlt: scanResults.images.filter(i => i.alt === '' && i.isMeaningful).length,
        functionalImages: scanResults.images.filter(i => i.isFunctional).length,
        details: scanResults.images,
        enhancedScan: test7A,
        status: test7A.status,
        findings: test7A.findings
      };
    }

    // Fallback to basic analysis
    const images = Array.from(document.querySelectorAll("img"));

    const analysis = images.map((img) => ({
      src: img.src.substring(0, 100),
      alt: img.alt,
      hasAlt: img.hasAttribute("alt"),
      altLength: (img.alt || "").length,
      role: img.getAttribute("role"),
      ariaLabel: img.getAttribute("aria-label"),
      ariaLabelledby: img.getAttribute("aria-labelledby"),
      title: img.getAttribute("title"),
      isDecorative:
        img.getAttribute("role") === "presentation" ||
        img.getAttribute("role") === "none" ||
        img.alt === "",
      inLink: img.closest("a") !== null,
      inButton: img.closest("button") !== null,
      width: img.width,
      height: img.height,
    }));

    const meaningfulImages = analysis.filter((img) => !img.isDecorative);
    const withoutAlt = meaningfulImages.filter(
      (img) => !img.hasAlt && !img.ariaLabel
    );
    const emptyAlt = meaningfulImages.filter(
      (img) => img.hasAlt && img.alt === "" && !img.role
    );

    return {
      testId: "7.A",
      totalImages: images.length,
      meaningfulImages: meaningfulImages.length,
      imagesWithAlt: analysis.filter((i) => i.hasAlt).length,
      imagesWithoutAlt: withoutAlt.length,
      emptyAlt: emptyAlt.length,
      functionalImages: analysis.filter((i) => i.inLink || i.inButton).length,
      details: analysis,
    };
  },

  analyzeDecorativeImages() {
    // Use enhanced ImageScanner if available
    if (typeof ImageScanner !== 'undefined') {
      const scanResults = ImageScanner.scanAllImages();
      const test7B = scanResults.tests['7.B'];

      const decorativeImages = scanResults.images.filter(i => i.isDecorative);
      const properlyMarked = decorativeImages.filter(
        img => img.alt === '' || ['presentation', 'none'].includes(img.role)
      );

      return {
        testId: "7.B",
        decorativeCount: decorativeImages.length,
        totalImages: scanResults.totalImages,
        properlyMarked: properlyMarked.length,
        improperlyMarked: decorativeImages.length - properlyMarked.length,
        details: decorativeImages,
        enhancedScan: test7B,
        status: test7B.status,
        findings: test7B.findings
      };
    }

    // Fallback to basic analysis
    const images = Array.from(document.querySelectorAll("img"));

    const decorative = images.filter(
      (img) =>
        img.getAttribute("role") === "presentation" ||
        img.getAttribute("role") === "none" ||
        (img.alt === "" && !img.closest("a") && !img.closest("button"))
    );

    const properlyMarked = decorative.filter(
      (img) =>
        (img.alt === "" && !img.getAttribute("title")) ||
        img.getAttribute("role") === "presentation" ||
        img.getAttribute("role") === "none"
    );

    return {
      testId: "7.B",
      decorativeCount: decorative.length,
      totalImages: images.length,
      properlyMarked: properlyMarked.length,
      improperlyMarked: decorative.length - properlyMarked.length,
      details: decorative.map((img) => ({
        src: img.src.substring(0, 100),
        alt: img.alt,
        role: img.getAttribute("role"),
        hasTitle: img.hasAttribute("title"),
      })),
    };
  },

  analyzeCaptcha() {
    const captchaElements = document.querySelectorAll(
      '[class*="captcha"], [id*="captcha"], [class*="recaptcha"]'
    );

    return {
      testId: "7.C",
      hasCaptcha: captchaElements.length > 0,
      captchaCount: captchaElements.length,
      requiresManualTest: captchaElements.length > 0,
      guidance:
        "Verify CAPTCHA has text alternative describing purpose AND alternative form (audio CAPTCHA, etc.)",
    };
  },

  analyzeImagesOfText() {
    const images = Array.from(document.querySelectorAll("img"));

    // Heuristic: images that might contain text (logos, buttons with text, etc.)
    const possibleTextImages = images.filter((img) => {
      const alt = (img.alt || "").toLowerCase();
      const src = img.src.toLowerCase();
      return (
        alt.length > 10 ||
        src.includes("logo") ||
        src.includes("button") ||
        src.includes("banner") ||
        (img.width > 100 && img.height < 100)
      ); // Typical banner/button proportions
    });

    return {
      testId: "7.D",
      totalImages: images.length,
      possibleTextImages: possibleTextImages.length,
      requiresManualTest: true,
      guidance:
        "Identify images that contain text. Verify text is essential (logo, brand) or can be presented as actual text with CSS.",
    };
  },

  analyzeImageNameRoleValue() {
    // Use enhanced ImageScanner if available
    if (typeof ImageScanner !== 'undefined') {
      const scanResults = ImageScanner.scanAllImages();
      const test7E = scanResults.tests['7.E'];

      const functionalImages = scanResults.images.filter(i => i.isFunctional);

      return {
        testId: "7.E",
        functionalImages: functionalImages.length,
        withName: functionalImages.filter(i => i.hasProperAlt).length,
        withoutName: functionalImages.filter(i => !i.hasProperAlt).length,
        details: functionalImages,
        enhancedScan: test7E,
        status: test7E.status,
        findings: test7E.findings
      };
    }

    // Fallback to basic analysis
    const functionalImages = Array.from(
      document.querySelectorAll("img")
    ).filter(
      (img) =>
        img.closest("a") || img.closest("button") || img.hasAttribute("onclick")
    );

    const analysis = functionalImages.map((img) => {
      const parent = img.closest("a, button, [onclick]");
      return {
        src: img.src.substring(0, 100),
        hasName: img.hasAttribute("alt") || img.hasAttribute("aria-label"),
        name: img.alt || img.getAttribute("aria-label"),
        hasRole: !!parent,
        role: parent?.tagName.toLowerCase(),
        hasState:
          parent?.hasAttribute("aria-expanded") ||
          parent?.hasAttribute("aria-pressed"),
      };
    });

    return {
      testId: "7.E",
      functionalImages: functionalImages.length,
      withName: analysis.filter((i) => i.hasName).length,
      withoutName: analysis.filter((i) => !i.hasName).length,
      details: analysis,
    };
  },

  // ============================================
  // CATEGORY 8: TIME LIMITS
  // ============================================

  analyzeTimeLimits() {
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    const timeLimitElements = document.querySelectorAll(
      '[class*="timeout"], [class*="timer"], [id*="countdown"]'
    );

    return {
      testId: "8.A",
      hasMetaRefresh: !!metaRefresh,
      hasTimeLimitElements: timeLimitElements.length > 0,
      requiresManualTest: true,
      guidance:
        "Check if page has session timeouts or time limits. Verify user can turn off, adjust, or extend time limit before expiry.",
    };
  },

  // ============================================
  // CATEGORY 9: REPETITIVE CONTENT
  // ============================================

  analyzeBypassBlocks() {
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    const skipToMain = Array.from(skipLinks).filter((link) => {
      const text = link.textContent.toLowerCase();
      return (
        text.includes("skip") || text.includes("jump") || text.includes("main")
      );
    });

    const landmarks = document.querySelectorAll(
      'main, [role="main"], nav, [role="navigation"]'
    );
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

    return {
      testId: "9.A",
      hasSkipLinks: skipToMain.length > 0,
      skipLinkCount: skipToMain.length,
      hasLandmarks: landmarks.length > 0,
      landmarkCount: landmarks.length,
      headingCount: headings.length,
      bypassMechanisms: {
        skipLinks: skipToMain.length,
        landmarks: landmarks.length,
        headings: headings.length,
      },
    };
  },

  analyzeBypassBlocksLinks() {
    return this.analyzeBypassBlocks(); // Same test, different focus
  },

  // ============================================
  // CATEGORY 10: CONTENT STRUCTURE
  // ============================================

  analyzeHeadingDescriptive() {
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );

    const structure = headings.map((h) => {
      const text = h.textContent.trim();
      return {
        level: parseInt(h.tagName[1]),
        text: text,
        length: text.length,
        tag: h.tagName,
        isDescriptive:
          text.length >= 3 &&
          !["section", "part", "item"].includes(text.toLowerCase()),
      };
    });

    const nonDescriptive = structure.filter((h) => !h.isDescriptive);

    return {
      testId: "10.A",
      headingCount: headings.length,
      descriptiveHeadings: structure.filter((h) => h.isDescriptive).length,
      nonDescriptiveHeadings: nonDescriptive.length,
      structure: structure,
      requiresManualTest: true,
      guidance: "Verify each heading accurately describes its section content",
    };
  },

  analyzeVisualHeadingsProgrammatic() {
    // This requires manual identification of visual headings
    const headings = document.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, [role="heading"]'
    );

    // Look for styled text that might be visual headings
    const largeText = Array.from(
      document.querySelectorAll("p, div, span")
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = style.fontWeight;
      return fontSize > 18 || fontWeight === "bold" || fontWeight >= 600;
    });

    return {
      testId: "10.B",
      programmaticHeadings: headings.length,
      potentialVisualHeadings: largeText.length,
      requiresManualTest: true,
      guidance:
        "Identify visual headings (large/bold text). Verify they are programmatically marked as headings (<h1>-<h6> or role='heading')",
    };
  },

  analyzeHeadingLevels() {
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );

    const structure = headings.map((h) => ({
      level: parseInt(h.tagName[1]),
      text: h.textContent.trim(),
      tag: h.tagName,
    }));

    const issues = [];

    // Check for h1
    const h1Count = structure.filter((h) => h.level === 1).length;
    if (h1Count === 0) {
      issues.push("No H1 heading found on page");
    }

    // Check for skipped levels
    for (let i = 1; i < structure.length; i++) {
      const prev = structure[i - 1].level;
      const curr = structure[i].level;

      if (curr > prev + 1) {
        issues.push(`Heading level skipped from h${prev} to h${curr}`);
      }
    }

    return {
      testId: "10.C",
      headingCount: headings.length,
      structure: structure,
      hasH1: h1Count > 0,
      h1Count: h1Count,
      isLogical: issues.length === 0,
      issues: issues,
    };
  },

  analyzeLists() {
    const lists = document.querySelectorAll("ul, ol, dl");
    const listItems = document.querySelectorAll("li, dt, dd");

    // Look for visual lists (e.g., <div> with bullets via CSS)
    const potentialVisualLists = Array.from(
      document.querySelectorAll("div, p")
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      return (
        style.listStyleType !== "none" ||
        el.textContent.trim().match(/^[•\-\*]\s/)
      );
    });

    return {
      testId: "10.D",
      semanticLists: lists.length,
      listItems: listItems.length,
      potentialVisualLists: potentialVisualLists.length,
      requiresManualTest: true,
      guidance:
        "Identify visual lists. Verify they use proper list markup (<ul>, <ol>, or <dl>)",
    };
  },

  // ============================================
  // CATEGORY 11: LANGUAGE
  // ============================================

  analyzePageLanguage() {
    const htmlLang = document.documentElement.lang;
    const hasLang = !!htmlLang && htmlLang.trim().length > 0;
    const isValid = hasLang && this.isValidLanguageCode(htmlLang);

    return {
      testId: "11.A",
      hasLang: hasLang,
      lang: htmlLang,
      isValid: isValid,
      primaryLanguage: htmlLang?.split("-")[0],
    };
  },

  analyzePartLanguage() {
    const elementsWithLang = document.querySelectorAll("[lang]");
    const pageLang = document.documentElement.lang;

    const analysis = Array.from(elementsWithLang)
      .filter((el) => el !== document.documentElement)
      .map((el) => ({
        tagName: el.tagName,
        lang: el.lang,
        text: el.textContent.substring(0, 50),
        differentFromPage: el.lang !== pageLang,
      }));

    return {
      testId: "11.B",
      elementsWithLang: analysis.length,
      differentFromPage: analysis.filter((el) => el.differentFromPage).length,
      details: analysis,
      requiresManualTest: true,
      guidance:
        "Verify lang attributes correctly identify language of content that differs from page default",
    };
  },

  isValidLanguageCode(code) {
    // Basic validation - checks format (2-3 letter code, optional region)
    return /^[a-z]{2,3}(-[A-Z]{2})?$/.test(code);
  },

  // ============================================
  // CATEGORY 12: PAGE TITLES & FRAMES
  // ============================================

  analyzePageTitleDefined() {
    const titles = document.querySelectorAll("title");
    const titleCount = titles.length;
    const titleText = document.title;

    return {
      testId: "12.A",
      titleCount: titleCount,
      titleText: titleText,
      hasTitleElement: titleCount > 0,
      hasMultipleTitles: titleCount > 1,
      titleIsEmpty: !titleText || titleText.trim() === "",
      titleLength: titleText.length,
      rawHTML: document.head.innerHTML.substring(0, 500),
    };
  },

  analyzePageTitleDescriptive() {
    const title = document.title;
    const isDescriptive =
      title &&
      title.trim().length > 3 &&
      !["untitled", "page", "document", "new page", "welcome"].includes(
        title.toLowerCase().trim()
      );

    return {
      testId: "12.B",
      title: title,
      isDescriptive: isDescriptive,
      length: title.length,
      suggestions: this.getTitleSuggestions(title),
    };
  },

  getTitleSuggestions(title) {
    const suggestions = [];

    if (!title || title.trim().length < 3) {
      suggestions.push("Title is too short or empty");
    }

    if (title && title.toLowerCase().includes("untitled")) {
      suggestions.push("Title appears to be a placeholder");
    }

    if (title && title.toLowerCase() === title && title.length > 5) {
      suggestions.push("Consider using proper capitalization");
    }

    return suggestions;
  },

  analyzeFrameTitles() {
    const frames = Array.from(document.querySelectorAll("frame"));

    const analysis = frames.map((frame) => ({
      hasTitle: frame.hasAttribute("title"),
      title: frame.getAttribute("title"),
      src: frame.src,
      name: frame.name,
    }));

    return {
      testId: "12.C",
      frameCount: frames.length,
      framesWithTitles: analysis.filter((f) => f.hasTitle && f.title.trim())
        .length,
      framesWithoutTitles: analysis.filter(
        (f) => !f.hasTitle || !f.title.trim()
      ).length,
      details: analysis,
    };
  },

  analyzeIframeTitles() {
    const iframes = Array.from(document.querySelectorAll("iframe"));

    const analysis = iframes.map((iframe) => ({
      hasTitle: iframe.hasAttribute("title"),
      title: iframe.getAttribute("title"),
      titleDescriptive: iframe.getAttribute("title")?.length > 3,
      src: iframe.src?.substring(0, 100),
      name: iframe.name,
    }));

    return {
      testId: "12.D",
      iframeCount: iframes.length,
      iframesWithTitles: analysis.filter((f) => f.hasTitle && f.title.trim())
        .length,
      iframesWithoutTitles: analysis.filter(
        (f) => !f.hasTitle || !f.title.trim()
      ).length,
      iframesWithDescriptiveTitles: analysis.filter((f) => f.titleDescriptive)
        .length,
      details: analysis,
    };
  },

  // ============================================
  // CATEGORY 13: SENSORY & CONTRAST
  // ============================================

  analyzeSensoryCharacteristics() {
    const bodyText = document.body.textContent.toLowerCase();
    const sensoryWords = [
      "on the right",
      "on the left",
      "above",
      "below",
      "round",
      "square",
      "click the green",
      "red button",
      "circular icon",
    ];

    const usesSensory = sensoryWords.some((word) => bodyText.includes(word));

    return {
      testId: "13.A",
      usesSensoryCharacteristics: usesSensory,
      requiresManualTest: true,
      guidance:
        "Check if instructions rely solely on shape, size, location, or sound. Instructions should include non-sensory references.",
    };
  },

  analyzeColorMeaning() {
    const coloredElements = document.querySelectorAll('[style*="color"]');

    return {
      testId: "13.B",
      coloredElements: coloredElements.length,
      requiresManualTest: true,
      guidance:
        "Verify color is not used as the only means to convey information (required fields, links, status, etc.). Must have text, icon, or pattern as well.",
    };
  },

  analyzeContrast() {
    const textElements = document.querySelectorAll(
      "p, h1, h2, h3, h4, h5, h6, span, div, a, li, td, th, label"
    );

    return {
      testId: "13.C",
      textElements: textElements.length,
      requiresManualTest: true,
      guidance:
        "Use Color Contrast Analyzer (CCA): Normal text ≥4.5:1, Large text (18pt+ or 14pt+ bold) ≥3:1. Test all states (default, hover, focus).",
    };
  },

  analyzeNonTextContrast() {
    const uiComponents = document.querySelectorAll(
      "button, input, select, textarea, a"
    );

    return {
      testId: "13.D",
      uiComponents: uiComponents.length,
      requiresManualTest: true,
      guidance:
        "Use CCA to verify UI components and graphical objects have ≥3:1 contrast against adjacent colors",
    };
  },

  // ============================================
  // CATEGORY 14: TABLES
  // ============================================

  analyzeTableHeaders() {
    const tables = Array.from(document.querySelectorAll("table"));

    const analysis = tables.map((table) => {
      const headers = table.querySelectorAll("th");
      const hasHeaders = headers.length > 0;
      const hasScope = Array.from(headers).some((th) =>
        th.hasAttribute("scope")
      );
      const rows = table.querySelectorAll("tr").length;
      const cells = table.querySelectorAll("td, th").length;
      const hasCaption = table.querySelector("caption") !== null;

      return {
        hasHeaders: hasHeaders,
        headerCount: headers.length,
        hasScope: hasScope,
        hasCaption: hasCaption,
        rows: rows,
        cells: cells,
        isDataTable: hasHeaders || cells > 10,
      };
    });

    return {
      testId: "14.A",
      totalTables: tables.length,
      tablesWithHeaders: analysis.filter((t) => t.hasHeaders).length,
      tablesWithoutHeaders: analysis.filter(
        (t) => !t.hasHeaders && t.isDataTable
      ).length,
      dataTables: analysis.filter((t) => t.isDataTable).length,
      details: analysis,
    };
  },

  analyzeTableHeaderAssociation() {
    const tables = Array.from(document.querySelectorAll("table"));

    const analysis = tables.map((table) => {
      const headers = table.querySelectorAll("th");
      const hasHeaders = headers.length > 0;

      const headersWithScope = Array.from(headers).filter((th) =>
        th.hasAttribute("scope")
      );

      const headersWithId = Array.from(headers).filter((th) =>
        th.hasAttribute("id")
      );

      const cellsWithHeaders = table.querySelectorAll("td[headers]");

      return {
        hasHeaders: hasHeaders,
        headerCount: headers.length,
        headersWithScope: headersWithScope.length,
        headersWithId: headersWithId.length,
        cellsWithHeaders: cellsWithHeaders.length,
        hasProperAssociation:
          headersWithScope.length > 0 ||
          (headersWithId.length > 0 && cellsWithHeaders.length > 0),
      };
    });

    return {
      testId: "14.B",
      totalTables: tables.length,
      tablesWithAssociations: analysis.filter((t) => t.hasProperAssociation)
        .length,
      tablesWithoutAssociations: analysis.filter(
        (t) => t.hasHeaders && !t.hasProperAssociation
      ).length,
      details: analysis,
    };
  },

  analyzeLayoutTables() {
    const tables = Array.from(document.querySelectorAll("table"));

    const layoutTables = tables.filter((table) => {
      const hasHeaders = table.querySelectorAll("th").length > 0;
      const hasCaption = table.querySelector("caption") !== null;
      const hasSummary = table.hasAttribute("summary");
      const cellCount = table.querySelectorAll("td, th").length;

      // Heuristic: likely layout if no headers and few cells
      const isLikelyLayout = !hasHeaders && cellCount < 10;

      return isLikelyLayout;
    });

    const incorrectLayoutTables = layoutTables.filter(
      (table) =>
        table.querySelectorAll("th").length > 0 ||
        table.querySelector("caption") !== null ||
        table.hasAttribute("summary")
    );

    return {
      testId: "14.C",
      totalTables: tables.length,
      layoutTables: layoutTables.length,
      incorrectLayoutTables: incorrectLayoutTables.length,
      details: layoutTables.map((t) => ({
        hasHeaderMarkup: t.querySelectorAll("th").length > 0,
        hasCaption: t.querySelector("caption") !== null,
        hasSummary: t.hasAttribute("summary"),
      })),
    };
  },

  // ============================================
  // CATEGORY 15-20: REMAINING TESTS
  // ============================================

  analyzeCSSPositioning() {
    return {
      testId: "15.A",
      requiresManualTest: true,
      guidance:
        "Check if reading order in source code matches meaningful sequence. Disable CSS and verify content order makes sense.",
    };
  },

  analyzeAudioVideoAlternative() {
    const videos = document.querySelectorAll("video");
    const audios = document.querySelectorAll("audio");

    return {
      testId: "16.A",
      videoCount: videos.length,
      audioCount: audios.length,
      requiresManualTest: videos.length + audios.length > 0,
      guidance:
        "For audio-only: verify transcript. For video-only: verify audio description or transcript.",
    };
  },

  analyzeCaptions() {
    const videos = document.querySelectorAll("video");
    const videosWithTracks = Array.from(videos).filter(
      (v) => v.querySelectorAll('track[kind="captions"]').length > 0
    );

    return {
      testId: "16.B",
      videoCount: videos.length,
      videosWithCaptions: videosWithTracks.length,
      requiresManualTest: videos.length > 0,
      guidance:
        "Verify all pre-recorded video with audio has synchronized captions",
    };
  },

  analyzeAudioDescription() {
    return {
      testId: "16.C",
      requiresManualTest: true,
      guidance:
        "Verify pre-recorded video has audio description track for visual information not conveyed in main audio",
    };
  },

  analyzeMediaAlternative() {
    return {
      testId: "17.A",
      requiresManualTest: true,
      guidance:
        "For synchronized media, verify there is a media alternative (transcript) or audio description",
    };
  },

  analyzeCaptionsLive() {
    return {
      testId: "17.B",
      requiresManualTest: true,
      guidance: "Verify live audio content has synchronized captions",
    };
  },

  analyzeAudioDescriptionPrerecorded() {
    return {
      testId: "17.C",
      requiresManualTest: true,
      guidance:
        "Verify synchronized media has audio description for visual content not described in main audio",
    };
  },

  analyzeResizeText() {
    return {
      testId: "18.A",
      requiresManualTest: true,
      guidance:
        "Zoom browser to 200%. Verify: (1) All text resizes (2) No horizontal scrolling (3) No content loss or overlap",
    };
  },

  analyzeMultipleWays() {
    const nav = document.querySelectorAll('nav, [role="navigation"]');
    const search = document.querySelectorAll(
      '[type="search"], [role="search"]'
    );
    const sitemap = Array.from(document.querySelectorAll("a")).filter(
      (a) =>
        a.textContent.toLowerCase().includes("sitemap") ||
        a.href.toLowerCase().includes("sitemap")
    );

    return {
      testId: "19.A",
      hasNavigation: nav.length > 0,
      hasSearch: search.length > 0,
      hasSitemap: sitemap.length > 0,
      mechanismCount:
        (nav.length > 0 ? 1 : 0) +
        (search.length > 0 ? 1 : 0) +
        (sitemap.length > 0 ? 1 : 0),
      requiresManualTest: true,
      guidance:
        "Verify at least 2 ways to find pages: navigation menu, search, sitemap, breadcrumbs, table of contents",
    };
  },

  analyzeParsing() {
    const duplicateIds = this.findDuplicateIds();

    return {
      testId: "20.A",
      duplicateIds: duplicateIds.length,
      duplicateIdList: duplicateIds,
      requiresManualTest: true,
      guidance:
        "Validate HTML: (1) Complete start/end tags (2) Proper nesting (3) No duplicate IDs (4) Unique attributes. Use W3C HTML Validator.",
    };
  },

  // ============================================
  // HELPER METHODS
  // ============================================

  findDuplicateIds() {
    const ids = {};
    const duplicates = [];

    document.querySelectorAll("[id]").forEach((el) => {
      const id = el.id;
      if (ids[id]) {
        if (!duplicates.includes(id)) {
          duplicates.push(id);
        }
      } else {
        ids[id] = true;
      }
    });

    return duplicates;
  },

  getElementSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    if (element.className && typeof element.className === "string") {
      const classes = element.className.split(" ")[0];
      if (classes) {
        return `${element.tagName.toLowerCase()}.${classes}`;
      }
    }
    return element.tagName.toLowerCase();
  },

  /**
   * Run specific test and return recommendation
   */
  runSpecificTest(testId) {
    const analysis = this.analyzeForTest(testId);

    if (analysis.error) {
      return {
        status: "ERROR",
        findings: analysis.message,
        details: "Test could not be performed",
      };
    }

    const result = this.interpretResults(testId, analysis);

    return {
      status: result.status,
      findings: result.findings,
      details: result.details,
    };
  },

  interpretResults(testId, analysis) {
    const interpreters = {
      "12.A": (data) => {
        if (data.titleCount === 0) {
          return {
            status: "FAIL",
            findings: "No <title> element found",
            details:
              "The page must have exactly one <title> element in the <head> section",
          };
        } else if (data.titleCount > 1) {
          return {
            status: "FAIL",
            findings: `${data.titleCount} <title> elements found`,
            details: "Only one <title> element is allowed per page",
          };
        } else if (data.titleIsEmpty) {
          return {
            status: "FAIL",
            findings: "Title element exists but is empty",
            details: "The <title> must contain descriptive text",
          };
        } else {
          return {
            status: "PASS",
            findings: `Page has valid title: "${data.titleText}"`,
            details: "One <title> element with descriptive text",
          };
        }
      },

      "12.B": (data) => {
        if (data.isDescriptive) {
          return {
            status: "PASS",
            findings: `Title is descriptive: "${data.title}"`,
            details: "Title adequately describes the page purpose",
          };
        } else {
          return {
            status: "FAIL",
            findings: `Title not descriptive enough: "${data.title}"`,
            details: data.suggestions.join("; "),
          };
        }
      },

      "7.A": (data) => {
        // Use enhanced scan results if available
        if (data.enhancedScan) {
          return {
            status: data.enhancedScan.status === 'PASS' ? 'PASS' :
                    data.enhancedScan.status === 'DNA' ? 'DNA' : 'FAIL',
            findings: data.enhancedScan.findings,
            details: data.enhancedScan.details || data.enhancedScan.result
          };
        }

        // Fallback logic
        if (data.totalImages === 0) {
          return {
            status: "DNA",
            findings: "No images found on page",
            details: "Test does not apply when no images are present",
          };
        }

        if (data.imagesWithoutAlt > 0) {
          return {
            status: "FAIL",
            findings: `${data.imagesWithoutAlt} image(s) missing alt attribute`,
            details: "All meaningful images must have alt text",
          };
        } else {
          return {
            status: "PASS",
            findings: "All images have alt attributes",
            details: `${data.totalImages} images checked`,
          };
        }
      },

      "10.C": (data) => {
        if (data.isLogical) {
          return {
            status: "PASS",
            findings: "Heading structure is logical",
            details: `${data.headingCount} headings with proper hierarchy`,
          };
        } else {
          return {
            status: "FAIL",
            findings: "Heading structure issues found",
            details: data.issues.join("; "),
          };
        }
      },

      "5.C": (data) => {
        if (data.fieldsWithoutLabels > 0) {
          return {
            status: "FAIL",
            findings: `${data.fieldsWithoutLabels} field(s) without programmatic labels`,
            details: "Form fields need <label>, aria-label, or aria-labelledby",
          };
        } else {
          return {
            status: "PASS",
            findings: "All form fields have programmatic labels",
            details: `${data.totalFields} fields properly labeled`,
          };
        }
      },

      "11.A": (data) => {
        if (!data.hasLang) {
          return {
            status: "FAIL",
            findings: "No lang attribute on <html> element",
            details:
              "Page must have lang attribute to identify primary language",
          };
        } else if (!data.isValid) {
          return {
            status: "FAIL",
            findings: `Invalid language code: "${data.lang}"`,
            details: "Use valid language codes (e.g., 'en', 'es', 'fr')",
          };
        } else {
          return {
            status: "PASS",
            findings: `Page language set to: ${data.lang}`,
            details: "Valid language identification",
          };
        }
      },
    };

    const interpreter = interpreters[testId];
    if (interpreter) {
      return interpreter(analysis);
    }

    if (analysis.requiresManualTest) {
      return {
        status: "MANUAL",
        findings: analysis.guidance || "Manual testing required",
        details: JSON.stringify(analysis).substring(0, 200),
      };
    }

    return {
      status: "UNKNOWN",
      findings: "Automated analysis not available",
      details: JSON.stringify(analysis).substring(0, 200),
    };
  },
};

// Make available globally
if (typeof window !== "undefined") {
  window.PageAnalyzer = PageAnalyzer;
}

// Export for use in modules (if applicable)
if (typeof module !== "undefined" && module.exports) {
  module.exports = PageAnalyzer;
}

console.log("Trusted Tester Page Analyzer v5.2.0 loaded");
