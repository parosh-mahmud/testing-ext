/**
 * Advanced Image Scanner for Trusted Tester 5.1.3
 * Provides detailed analysis of images with Pass/Fail/Does Not Apply logic
 * Follows DHS Trusted Tester v5.1.3 (April 2024) standards
 */

const ImageScanner = {
  /**
   * Comprehensive image scan
   * Returns detailed results for all image-related tests
   */
  scanAllImages() {
    const images = Array.from(document.querySelectorAll('img'));

    if (images.length === 0) {
      return {
        totalImages: 0,
        status: 'DNA',
        message: 'No images found on page',
        tests: {
          '7.A': { status: 'DNA', reason: 'No images present' },
          '7.B': { status: 'DNA', reason: 'No images present' },
          '7.E': { status: 'DNA', reason: 'No images present' }
        }
      };
    }

    const results = {
      totalImages: images.length,
      images: images.map(img => this.analyzeImage(img)),
      tests: {}
    };

    // Test 7.A: Meaningful Images
    results.tests['7.A'] = this.evaluateMeaningfulImages(results.images);

    // Test 7.B: Decorative Images
    results.tests['7.B'] = this.evaluateDecorativeImages(results.images);

    // Test 7.E: Image Name, Role, Value (functional images)
    results.tests['7.E'] = this.evaluateFunctionalImages(results.images);

    return results;
  },

  /**
   * Analyze individual image
   */
  analyzeImage(img) {
    const analysis = {
      src: img.src.substring(0, 100),
      alt: img.alt,
      hasAlt: img.hasAttribute('alt'),
      altLength: (img.alt || '').length,
      title: img.getAttribute('title'),
      ariaLabel: img.getAttribute('aria-label'),
      ariaLabelledby: img.getAttribute('aria-labelledby'),
      ariaDescribedby: img.getAttribute('aria-describedby'),
      role: img.getAttribute('role'),
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loading: img.getAttribute('loading'),
      isHidden: this.isVisuallyHidden(img),

      // Context
      inLink: !!img.closest('a[href]'),
      inButton: !!img.closest('button, [role="button"]'),
      linkHref: img.closest('a[href]')?.href,

      // Classification
      isDecorative: this.isDecorativeImage(img),
      isMeaningful: false,
      isFunctional: false,

      // Validation
      hasProperAlt: false,
      hasValidRole: false,
      issues: []
    };

    // Determine image type
    if (analysis.inLink || analysis.inButton) {
      analysis.isFunctional = true;
      analysis.isMeaningful = true;
    } else if (!analysis.isDecorative) {
      analysis.isMeaningful = true;
    }

    // Validate alt text
    analysis.hasProperAlt = this.validateAltText(img, analysis);
    analysis.hasValidRole = this.validateRole(img, analysis);

    // Identify issues
    analysis.issues = this.identifyIssues(img, analysis);

    return analysis;
  },

  /**
   * Check if image is visually hidden
   */
  isVisuallyHidden(img) {
    const style = window.getComputedStyle(img);
    return (
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      img.getAttribute('aria-hidden') === 'true' ||
      (img.width === 0 && img.height === 0) ||
      (parseFloat(style.width) === 0 && parseFloat(style.height) === 0)
    );
  },

  /**
   * Determine if image is decorative
   */
  isDecorativeImage(img) {
    const role = img.getAttribute('role');
    const alt = img.alt;
    const ariaHidden = img.getAttribute('aria-hidden');

    // Explicitly marked as decorative
    if (role === 'presentation' || role === 'none') {
      return true;
    }

    // Empty alt (but must not be in link/button)
    if (alt === '' && !img.closest('a[href], button, [role="button"]')) {
      return true;
    }

    // aria-hidden="true" suggests decorative
    if (ariaHidden === 'true') {
      return true;
    }

    // Heuristics: likely decorative patterns
    const src = img.src.toLowerCase();
    const decorativePatterns = [
      'spacer', 'separator', 'divider', 'border', 'corner',
      'bg-', 'background', 'decoration', 'ornament', 'bullet'
    ];

    if (decorativePatterns.some(pattern => src.includes(pattern))) {
      // Only if very small (1x1, etc)
      if (img.width <= 5 && img.height <= 5) {
        return true;
      }
    }

    return false;
  },

  /**
   * Validate alt text quality
   */
  validateAltText(img, analysis) {
    if (!analysis.hasAlt) {
      return false;
    }

    const alt = img.alt.trim();

    // Decorative images should have empty alt
    if (analysis.isDecorative) {
      return alt === '';
    }

    // Meaningful/functional images need descriptive alt
    if (analysis.isMeaningful || analysis.isFunctional) {
      // Must have non-empty alt
      if (alt === '') {
        return false;
      }

      // Should not be too short (except for icons with aria-label)
      if (alt.length < 2 && !analysis.ariaLabel) {
        return false;
      }

      // Check for bad patterns
      const badPatterns = [
        /^image$/i,
        /^img$/i,
        /^picture$/i,
        /^photo$/i,
        /^graphic$/i,
        /^untitled$/i,
        /^\.jpg$/i,
        /^\.png$/i,
        /^\.gif$/i,
        /^dsc\d+$/i, // Camera file names
        /^img_\d+$/i
      ];

      if (badPatterns.some(pattern => pattern.test(alt))) {
        return false;
      }

      // Functional images in links should describe destination/purpose
      if (analysis.inLink && !analysis.inButton) {
        // Check if link has other text content
        const link = img.closest('a[href]');
        const linkText = link ? link.textContent.trim() : '';
        const imgAltOnly = linkText === alt;

        // If image is only content in link, alt must be descriptive
        if (imgAltOnly && alt.length < 5) {
          return false;
        }
      }

      return true;
    }

    return true;
  },

  /**
   * Validate role attribute
   */
  validateRole(img, analysis) {
    const role = analysis.role;

    if (!role) {
      return true; // No role is fine for standard images
    }

    const validRoles = ['presentation', 'none', 'img', 'button'];

    if (!validRoles.includes(role)) {
      return false;
    }

    // Decorative images should use presentation or none
    if (analysis.isDecorative) {
      return role === 'presentation' || role === 'none';
    }

    return true;
  },

  /**
   * Identify specific issues
   */
  identifyIssues(img, analysis) {
    const issues = [];

    // Missing alt attribute
    if (!analysis.hasAlt) {
      issues.push({
        severity: 'FAIL',
        test: '7.A',
        issue: 'Missing alt attribute',
        recommendation: 'Add alt attribute to image'
      });
    }

    // Meaningful image with empty/missing alt
    if (analysis.isMeaningful && (!analysis.hasAlt || analysis.alt === '')) {
      issues.push({
        severity: 'FAIL',
        test: '7.A',
        issue: 'Meaningful image has empty or missing alt text',
        recommendation: 'Provide descriptive alt text that conveys the image purpose'
      });
    }

    // Functional image with inadequate alt
    if (analysis.isFunctional && !analysis.hasProperAlt) {
      issues.push({
        severity: 'FAIL',
        test: '7.E',
        issue: 'Functional image lacks descriptive alternative text',
        recommendation: analysis.inLink
          ? 'Alt text should describe link destination/purpose'
          : 'Alt text should describe button action'
      });
    }

    // Decorative image with non-empty alt
    if (analysis.isDecorative && analysis.alt !== '') {
      issues.push({
        severity: 'FAIL',
        test: '7.B',
        issue: 'Decorative image has non-empty alt text',
        recommendation: 'Use alt="" or role="presentation" for decorative images'
      });
    }

    // Decorative image with improper role
    if (analysis.isDecorative && analysis.role && !analysis.hasValidRole) {
      issues.push({
        severity: 'FAIL',
        test: '7.B',
        issue: 'Decorative image has incorrect role attribute',
        recommendation: 'Use role="presentation" or role="none"'
      });
    }

    // Alt text quality issues
    if (analysis.hasAlt && analysis.alt) {
      // Redundant "image of" or "picture of"
      if (/^(image|picture|photo|graphic)\s+(of|showing)/i.test(analysis.alt)) {
        issues.push({
          severity: 'WARNING',
          test: '7.A',
          issue: 'Alt text contains redundant phrase',
          recommendation: 'Remove "image of" or "picture of" - just describe the content'
        });
      }

      // File extension in alt text
      if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(analysis.alt)) {
        issues.push({
          severity: 'WARNING',
          test: '7.A',
          issue: 'Alt text contains file extension',
          recommendation: 'Remove file extension from alt text'
        });
      }

      // Too long (> 150 characters might indicate issue)
      if (analysis.altLength > 150) {
        issues.push({
          severity: 'WARNING',
          test: '7.A',
          issue: 'Alt text is very long',
          recommendation: 'Consider using aria-describedby for detailed descriptions. Alt should be concise.'
        });
      }
    }

    // Title attribute present (often misused)
    if (analysis.title && analysis.title !== analysis.alt) {
      issues.push({
        severity: 'INFO',
        test: '7.A',
        issue: 'Image has title attribute different from alt',
        recommendation: 'Title attribute creates tooltip; ensure it\'s intentional'
      });
    }

    return issues;
  },

  /**
   * Test 7.A: Meaningful Images
   */
  evaluateMeaningfulImages(images) {
    const meaningfulImages = images.filter(img =>
      img.isMeaningful && !img.isHidden
    );

    if (meaningfulImages.length === 0) {
      return {
        testId: '7.A',
        testName: '1.1.1-meaningful-image-name',
        status: 'DNA',
        result: 'Does Not Apply',
        findings: 'No meaningful images found on page',
        details: 'All images are either decorative or hidden'
      };
    }

    const failed = meaningfulImages.filter(img =>
      !img.hasAlt || img.alt === '' || !img.hasProperAlt
    );

    if (failed.length > 0) {
      return {
        testId: '7.A',
        testName: '1.1.1-meaningful-image-name',
        status: 'FAIL',
        result: 'Fail',
        findings: `${failed.length} meaningful image(s) missing or having inadequate alt text`,
        failedImages: failed.map(img => ({
          src: img.src,
          alt: img.alt || '[missing]',
          issues: img.issues.filter(i => i.test === '7.A')
        })),
        details: this.formatFailureDetails(failed),
        totalMeaningful: meaningfulImages.length
      };
    }

    return {
      testId: '7.A',
      testName: '1.1.1-meaningful-image-name',
      status: 'PASS',
      result: 'Pass',
      findings: `All ${meaningfulImages.length} meaningful images have appropriate alt text`,
      details: 'All meaningful images provide text alternatives that convey equivalent information'
    };
  },

  /**
   * Test 7.B: Decorative Images
   */
  evaluateDecorativeImages(images) {
    const decorativeImages = images.filter(img =>
      img.isDecorative && !img.isHidden
    );

    if (decorativeImages.length === 0) {
      return {
        testId: '7.B',
        testName: '1.1.1-decorative-image',
        status: 'DNA',
        result: 'Does Not Apply',
        findings: 'No decorative images found on page',
        details: 'All images appear to be meaningful or hidden'
      };
    }

    const failed = decorativeImages.filter(img =>
      img.alt !== '' || (img.role && !['presentation', 'none'].includes(img.role))
    );

    if (failed.length > 0) {
      return {
        testId: '7.B',
        testName: '1.1.1-decorative-image',
        status: 'FAIL',
        result: 'Fail',
        findings: `${failed.length} decorative image(s) not properly marked`,
        failedImages: failed.map(img => ({
          src: img.src,
          alt: img.alt,
          role: img.role,
          issues: img.issues.filter(i => i.test === '7.B')
        })),
        details: 'Decorative images must have alt="" or role="presentation/none"',
        totalDecorative: decorativeImages.length
      };
    }

    return {
      testId: '7.B',
      testName: '1.1.1-decorative-image',
      status: 'PASS',
      result: 'Pass',
      findings: `All ${decorativeImages.length} decorative images properly marked`,
      details: 'Decorative images correctly use empty alt or presentation role'
    };
  },

  /**
   * Test 7.E: Functional Images (Name, Role, Value)
   */
  evaluateFunctionalImages(images) {
    const functionalImages = images.filter(img =>
      img.isFunctional && !img.isHidden
    );

    if (functionalImages.length === 0) {
      return {
        testId: '7.E',
        testName: '4.1.2-image-name-role-value',
        status: 'DNA',
        result: 'Does Not Apply',
        findings: 'No functional images (in links/buttons) found',
        details: 'Test applies only to images within interactive elements'
      };
    }

    const failed = functionalImages.filter(img => !img.hasProperAlt);

    if (failed.length > 0) {
      return {
        testId: '7.E',
        testName: '4.1.2-image-name-role-value',
        status: 'FAIL',
        result: 'Fail',
        findings: `${failed.length} functional image(s) lack proper accessible name`,
        failedImages: failed.map(img => ({
          src: img.src,
          context: img.inLink ? 'link' : 'button',
          href: img.linkHref,
          alt: img.alt || '[missing]',
          issues: img.issues.filter(i => i.test === '7.E')
        })),
        details: 'Functional images must have descriptive alt describing the action/destination',
        totalFunctional: functionalImages.length
      };
    }

    return {
      testId: '7.E',
      testName: '4.1.2-image-name-role-value',
      status: 'PASS',
      result: 'Pass',
      findings: `All ${functionalImages.length} functional images have appropriate accessible names`,
      details: 'Functional images properly convey their purpose'
    };
  },

  /**
   * Format failure details
   */
  formatFailureDetails(failedImages) {
    if (failedImages.length === 0) return '';

    const details = failedImages.slice(0, 5).map((img, i) => {
      const issues = img.issues.map(issue => `  - ${issue.issue}: ${issue.recommendation}`).join('\n');
      return `Image ${i + 1}:\n  Source: ${img.src}\n  Alt: "${img.alt || '[missing]'}"\n${issues}`;
    }).join('\n\n');

    const more = failedImages.length > 5
      ? `\n\n... and ${failedImages.length - 5} more image(s)`
      : '';

    return details + more;
  },

  /**
   * Generate summary report
   */
  generateReport() {
    const scanResults = this.scanAllImages();

    return {
      summary: {
        totalImages: scanResults.totalImages,
        tests: {
          '7.A': scanResults.tests['7.A'],
          '7.B': scanResults.tests['7.B'],
          '7.E': scanResults.tests['7.E']
        }
      },
      overallStatus: this.calculateOverallStatus(scanResults.tests),
      detailedResults: scanResults.images,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Calculate overall status
   */
  calculateOverallStatus(tests) {
    const statuses = Object.values(tests).map(t => t.status);

    if (statuses.every(s => s === 'DNA')) {
      return 'DNA';
    }

    if (statuses.some(s => s === 'FAIL')) {
      return 'FAIL';
    }

    if (statuses.some(s => s === 'PASS')) {
      return 'PASS';
    }

    return 'UNKNOWN';
  }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.ImageScanner = ImageScanner;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageScanner;
}

console.log('Trusted Tester Image Scanner v1.0 loaded');
