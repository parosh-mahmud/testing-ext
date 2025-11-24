/**
 * Trusted Tester 5.1.3 Complete Test Mapping
 * Maps test IDs to their official test names and categories
 * Source: DHS Trusted Tester Process v5.1.3 (April 2024)
 */

const TrustedTesterMapping = {
  // Complete mapping of all Trusted Tester 5.1.3 tests
  tests: {
    // Category 1: Conforming Alternate Version and Non-Interference
    "1.A": {
      id: "1.A",
      name: "conforming-alternate-version",
      wcag: "Conformance Requirement 1",
      category: "Conforming Alternate Version",
      fullName: "conforming-alternate-version",
      description: "A conforming alternate version is provided"
    },

    // Category 2: Auto-Playing and Auto-Updating Content
    "2.A": {
      id: "2.A",
      name: "audio-control",
      wcag: "1.4.2",
      category: "Auto-Playing Content",
      fullName: "1.4.2-audio-control",
      description: "Audio Control"
    },
    "2.B": {
      id: "2.B",
      name: "auto-update-pausing",
      wcag: "2.2.2",
      category: "Auto-Updating Content",
      fullName: "2.2.2-pause-stop-hide",
      description: "Pause, Stop, Hide"
    },

    // Category 3: Flashing
    "3.A": {
      id: "3.A",
      name: "flashing",
      wcag: "2.3.1",
      category: "Flashing",
      fullName: "2.3.1-three-flashes-or-below-threshold",
      description: "Three Flashes or Below Threshold"
    },

    // Category 4: Keyboard Access and Focus
    "4.A": {
      id: "4.A",
      name: "keyboard-access",
      wcag: "2.1.1",
      category: "Keyboard Access",
      fullName: "2.1.1-keyboard",
      description: "Keyboard"
    },
    "4.B": {
      id: "4.B",
      name: "keyboard-access-no-exception",
      wcag: "2.1.3",
      category: "Keyboard Access",
      fullName: "2.1.3-keyboard-no-exception",
      description: "Keyboard (No Exception)"
    },
    "4.C": {
      id: "4.C",
      name: "no-keyboard-trap",
      wcag: "2.1.2",
      category: "Keyboard Trap",
      fullName: "2.1.2-no-keyboard-trap",
      description: "No Keyboard Trap"
    },
    "4.D": {
      id: "4.D",
      name: "focus-visible",
      wcag: "2.4.7",
      category: "Focus Visible",
      fullName: "2.4.7-focus-visible",
      description: "Focus Visible"
    },
    "4.E": {
      id: "4.E",
      name: "on-focus",
      wcag: "3.2.1",
      category: "On Focus",
      fullName: "3.2.1-on-focus",
      description: "On Focus"
    },
    "4.F": {
      id: "4.F",
      name: "focus-order-meaningful",
      wcag: "2.4.3",
      category: "Focus Order",
      fullName: "2.4.3-focus-order",
      description: "Focus Order"
    },
    "4.G": {
      id: "4.G",
      name: "character-key-shortcuts",
      wcag: "2.1.4",
      category: "Character Key Shortcuts",
      fullName: "2.1.4-character-key-shortcuts",
      description: "Character Key Shortcuts"
    },

    // Category 5: Forms
    "5.A": {
      id: "5.A",
      name: "label-provided",
      wcag: "3.3.2",
      category: "Form Labels",
      fullName: "3.3.2-labels-or-instructions",
      description: "Labels or Instructions"
    },
    "5.B": {
      id: "5.B",
      name: "label-descriptive",
      wcag: "2.4.6",
      category: "Form Labels",
      fullName: "2.4.6-label-descriptive",
      description: "Headings and Labels (Form Labels Descriptive)"
    },
    "5.C": {
      id: "5.C",
      name: "programmatic-label",
      wcag: "1.3.1",
      category: "Form Labels",
      fullName: "1.3.1-programmatic-label",
      description: "Info and Relationships (Programmatic Labels)"
    },
    "5.D": {
      id: "5.D",
      name: "on-input",
      wcag: "3.2.2",
      category: "On Input",
      fullName: "3.2.2-on-input",
      description: "On Input"
    },
    "5.E": {
      id: "5.E",
      name: "name-role-value",
      wcag: "4.1.2",
      category: "Name, Role, Value",
      fullName: "4.1.2-form-name-role-value",
      description: "Name, Role, Value (Form Components)"
    },
    "5.F": {
      id: "5.F",
      name: "error-identification",
      wcag: "3.3.1",
      category: "Error Identification",
      fullName: "3.3.1-error-identification",
      description: "Error Identification"
    },
    "5.G": {
      id: "5.G",
      name: "error-suggestion",
      wcag: "3.3.3",
      category: "Error Suggestion",
      fullName: "3.3.3-error-suggestion",
      description: "Error Suggestion"
    },
    "5.H": {
      id: "5.H",
      name: "error-prevention-legal-financial-data",
      wcag: "3.3.4",
      category: "Error Prevention",
      fullName: "3.3.4-error-prevention-legal-financial-data",
      description: "Error Prevention (Legal, Financial, Data)"
    },
    "5.I": {
      id: "5.I",
      name: "identify-input-purpose",
      wcag: "1.3.5",
      category: "Identify Input Purpose",
      fullName: "1.3.5-identify-input-purpose",
      description: "Identify Input Purpose"
    },

    // Category 6: Links
    "6.A": {
      id: "6.A",
      name: "link-purpose",
      wcag: "2.4.4",
      category: "Link Purpose",
      fullName: "2.4.4-link-purpose-in-context",
      description: "Link Purpose (In Context)"
    },

    // Category 7: Images
    "7.A": {
      id: "7.A",
      name: "meaningful-image-name",
      wcag: "1.1.1",
      category: "Meaningful Images",
      fullName: "1.1.1-meaningful-image-name",
      description: "Non-text Content (Meaningful Images)"
    },
    "7.B": {
      id: "7.B",
      name: "decorative-image",
      wcag: "1.1.1",
      category: "Decorative Images",
      fullName: "1.1.1-decorative-image",
      description: "Non-text Content (Decorative Images)"
    },
    "7.C": {
      id: "7.C",
      name: "captcha",
      wcag: "1.1.1",
      category: "CAPTCHA",
      fullName: "1.1.1-captcha",
      description: "Non-text Content (CAPTCHA)"
    },
    "7.D": {
      id: "7.D",
      name: "images-of-text",
      wcag: "1.4.5",
      category: "Images of Text",
      fullName: "1.4.5-images-of-text",
      description: "Images of Text"
    },
    "7.E": {
      id: "7.E",
      name: "image-name-role-value",
      wcag: "4.1.2",
      category: "Image Components",
      fullName: "4.1.2-image-name-role-value",
      description: "Name, Role, Value (Images)"
    },

    // Category 8: Adjustable Time Limits
    "8.A": {
      id: "8.A",
      name: "timing-adjustable",
      wcag: "2.2.1",
      category: "Time Limits",
      fullName: "2.2.1-timing-adjustable",
      description: "Timing Adjustable"
    },

    // Category 9: Repetitive Content
    "9.A": {
      id: "9.A",
      name: "bypass-blocks",
      wcag: "2.4.1",
      category: "Bypass Blocks",
      fullName: "2.4.1-bypass-blocks",
      description: "Bypass Blocks"
    },
    "9.B": {
      id: "9.B",
      name: "bypass-blocks-links",
      wcag: "2.4.1",
      category: "Bypass Blocks",
      fullName: "2.4.1-bypass-blocks",
      description: "Bypass Blocks (Links)"
    },

    // Category 10: Content Structure
    "10.A": {
      id: "10.A",
      name: "heading-purpose",
      wcag: "2.4.6",
      category: "Headings",
      fullName: "2.4.6-heading-purpose",
      description: "Headings and Labels (Descriptive)"
    },
    "10.B": {
      id: "10.B",
      name: "visual-headings-programmatic",
      wcag: "1.3.1",
      category: "Headings",
      fullName: "1.3.1-visual-headings-programmatic",
      description: "Info and Relationships (Visual Headings)"
    },
    "10.C": {
      id: "10.C",
      name: "heading-level",
      wcag: "1.3.1",
      category: "Headings",
      fullName: "1.3.1-heading-level",
      description: "Info and Relationships (Heading Hierarchy)"
    },
    "10.D": {
      id: "10.D",
      name: "lists",
      wcag: "1.3.1",
      category: "Lists",
      fullName: "1.3.1-lists",
      description: "Info and Relationships (Lists)"
    },

    // Category 11: Language
    "11.A": {
      id: "11.A",
      name: "language-of-page",
      wcag: "3.1.1",
      category: "Page Language",
      fullName: "3.1.1-language-of-page",
      description: "Language of Page"
    },
    "11.B": {
      id: "11.B",
      name: "language-of-parts",
      wcag: "3.1.2",
      category: "Language of Parts",
      fullName: "3.1.2-language-of-parts",
      description: "Language of Parts"
    },

    // Category 12: Page Titles, Frames, and iFrames
    "12.A": {
      id: "12.A",
      name: "page-title-defined",
      wcag: "2.4.2",
      category: "Page Titles",
      fullName: "2.4.2-page-title-defined",
      description: "Page Titled (Defined)"
    },
    "12.B": {
      id: "12.B",
      name: "page-title-descriptive",
      wcag: "2.4.2",
      category: "Page Titles",
      fullName: "2.4.2-page-title-descriptive",
      description: "Page Titled (Descriptive)"
    },
    "12.C": {
      id: "12.C",
      name: "frame-title",
      wcag: "4.1.2",
      category: "Frames",
      fullName: "4.1.2-frame-title",
      description: "Name, Role, Value (Frame)"
    },
    "12.D": {
      id: "12.D",
      name: "iframe-title",
      wcag: "4.1.2",
      category: "iFrames",
      fullName: "4.1.2-iframe-title",
      description: "Name, Role, Value (iFrame)"
    },

    // Category 13: Sensory Characteristics and Contrast
    "13.A": {
      id: "13.A",
      name: "sensory-characteristics",
      wcag: "1.3.3",
      category: "Sensory Characteristics",
      fullName: "1.3.3-sensory-characteristics",
      description: "Sensory Characteristics"
    },
    "13.B": {
      id: "13.B",
      name: "use-of-color",
      wcag: "1.4.1",
      category: "Use of Color",
      fullName: "1.4.1-use-of-color",
      description: "Use of Color"
    },
    "13.C": {
      id: "13.C",
      name: "contrast-minimum",
      wcag: "1.4.3",
      category: "Contrast",
      fullName: "1.4.3-contrast-minimum",
      description: "Contrast (Minimum)"
    },
    "13.D": {
      id: "13.D",
      name: "non-text-contrast",
      wcag: "1.4.11",
      category: "Non-Text Contrast",
      fullName: "1.4.11-non-text-contrast",
      description: "Non-text Contrast"
    },

    // Category 14: Tables
    "14.A": {
      id: "14.A",
      name: "table-identification",
      wcag: "1.3.1",
      category: "Tables",
      fullName: "1.3.1-table-identification",
      description: "Info and Relationships (Data Tables)"
    },
    "14.B": {
      id: "14.B",
      name: "cell-header-association",
      wcag: "1.3.1",
      category: "Tables",
      fullName: "1.3.1-cell-header-association",
      description: "Info and Relationships (Table Header Association)"
    },
    "14.C": {
      id: "14.C",
      name: "layout-table-structure",
      wcag: "1.3.1",
      category: "Tables",
      fullName: "1.3.1-layout-table-structure",
      description: "Info and Relationships (Layout Tables)"
    },

    // Category 15: CSS Positioning
    "15.A": {
      id: "15.A",
      name: "meaningful-sequence",
      wcag: "1.3.2",
      category: "CSS Positioning",
      fullName: "1.3.2-meaningful-sequence",
      description: "Meaningful Sequence"
    },

    // Category 16: Pre-Recorded Audio-Only, Video-Only, and Animations
    "16.A": {
      id: "16.A",
      name: "audio-only-video-only-alternative",
      wcag: "1.2.1",
      category: "Audio/Video Alternative",
      fullName: "1.2.1-audio-video-alternative",
      description: "Audio-only and Video-only (Prerecorded)"
    },
    "16.B": {
      id: "16.B",
      name: "captions-prerecorded",
      wcag: "1.2.2",
      category: "Captions",
      fullName: "1.2.2-captions-prerecorded",
      description: "Captions (Prerecorded)"
    },
    "16.C": {
      id: "16.C",
      name: "audio-description-or-media-alternative",
      wcag: "1.2.3",
      category: "Audio Description",
      fullName: "1.2.3-audio-description-prerecorded",
      description: "Audio Description or Media Alternative (Prerecorded)"
    },

    // Category 17: Synchronized Media
    "17.A": {
      id: "17.A",
      name: "media-alternative-prerecorded",
      wcag: "1.2.5",
      category: "Synchronized Media",
      fullName: "1.2.5-media-alternative-prerecorded",
      description: "Audio Description (Prerecorded)"
    },
    "17.B": {
      id: "17.B",
      name: "captions-live",
      wcag: "1.2.4",
      category: "Live Captions",
      fullName: "1.2.4-captions-live",
      description: "Captions (Live)"
    },

    // Category 18: Resize Text
    "18.A": {
      id: "18.A",
      name: "resize-text",
      wcag: "1.4.4",
      category: "Resize Text",
      fullName: "1.4.4-resize-text",
      description: "Resize Text"
    },

    // Category 19: Multiple Ways
    "19.A": {
      id: "19.A",
      name: "multiple-ways",
      wcag: "2.4.5",
      category: "Multiple Ways",
      fullName: "2.4.5-multiple-ways",
      description: "Multiple Ways"
    },

    // Category 20: Parsing
    "20.A": {
      id: "20.A",
      name: "parsing",
      wcag: "4.1.1",
      category: "Parsing",
      fullName: "4.1.1-parsing",
      description: "Parsing"
    }
  },

  /**
   * Get test by ID
   */
  getTestById(testId) {
    return this.tests[testId] || null;
  },

  /**
   * Get test by name
   */
  getTestByName(testName) {
    return Object.values(this.tests).find(
      test => test.name === testName || test.fullName === testName
    ) || null;
  },

  /**
   * Get all tests
   */
  getAllTests() {
    return Object.values(this.tests);
  },

  /**
   * Get tests by category
   */
  getTestsByCategory(category) {
    return Object.values(this.tests).filter(test => test.category === category);
  },

  /**
   * Get all categories
   */
  getAllCategories() {
    const categories = new Set(Object.values(this.tests).map(test => test.category));
    return Array.from(categories).sort();
  },

  /**
   * Convert test ID to test name
   */
  idToName(testId) {
    const test = this.getTestById(testId);
    return test ? test.fullName : testId;
  },

  /**
   * Convert test name to test ID
   */
  nameToId(testName) {
    const test = this.getTestByName(testName);
    return test ? test.id : null;
  }
};

// Export for use in other scripts
if (typeof window !== "undefined") {
  window.TrustedTesterMapping = TrustedTesterMapping;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = TrustedTesterMapping;
}

console.log("Trusted Tester 5.1.3 Test Mapping loaded");
