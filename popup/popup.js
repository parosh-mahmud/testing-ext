/**
 * Trusted Tester Exam Assistant - Popup Controller
 * Version 5.2.0
 */

class PopupController {
  constructor() {
    this.currentTab = "analyzer";
    this.history = [];
    this.currentTabId = null;
    this.init();
  }

  async init() {
    await this.loadHistory();
    this.attachEventListeners();
    this.initializeTabs();
    await this.getCurrentTab();
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      this.currentTabId = tab?.id;
      return tab;
    } catch (error) {
      console.error("Error getting current tab:", error);
      return null;
    }
  }

  attachEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchTab(e.target.dataset.tab)
      );
    });

    // Quick analyze button
    document
      .getElementById("analyzeCurrentPage")
      ?.addEventListener("click", () => {
        this.analyzeCurrentPage();
      });

    // Analyze question button
    document
      .getElementById("analyzeQuestion")
      ?.addEventListener("click", () => {
        this.analyzeQuestion();
      });

    // Manual test button
    document.getElementById("runManualTest")?.addEventListener("click", () => {
      this.runManualTest();
    });

    // Clear history button
    document.getElementById("clearHistory")?.addEventListener("click", () => {
      this.clearHistory();
    });

    // Enter key in textarea
    document
      .getElementById("examQuestion")
      ?.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
          this.analyzeQuestion();
        }
      });
  }

  initializeTabs() {
    this.switchTab("analyzer");
  }

  switchTab(tabName) {
    // Update button states
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }

    // Update content visibility
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    const activeContent = document.getElementById(tabName);
    if (activeContent) {
      activeContent.classList.add("active");
    }

    this.currentTab = tabName;

    // Load history when switching to history tab
    if (tabName === "history") {
      this.renderHistory();
    }
  }

  /**
   * Check if we can access the current tab
   */
  async canAccessTab(tab) {
    if (!tab || !tab.url) return false;

    const url = tab.url;
    const restrictedProtocols = [
      "chrome://",
      "chrome-extension://",
      "edge://",
      "about:",
      "view-source:",
    ];
    const restrictedDomains = [
      "chrome.google.com/webstore",
      "microsoftedge.microsoft.com",
    ];

    // Check protocols
    for (const protocol of restrictedProtocols) {
      if (url.startsWith(protocol)) return false;
    }

    // Check domains
    for (const domain of restrictedDomains) {
      if (url.includes(domain)) return false;
    }

    return (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("file://")
    );
  }

  /**
   * Inject and execute script in page
   */
  async executeScript(tabId, func, args = []) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: func,
        args: args,
      });
      return results[0]?.result;
    } catch (error) {
      console.error("Script execution error:", error);
      throw new Error(`Failed to execute script: ${error.message}`);
    }
  }

  /**
   * Quick page analysis
   */
  async analyzeCurrentPage() {
    const btn = document.getElementById("analyzeCurrentPage");
    this.setButtonLoading(btn, true, "Analyzing...");

    try {
      const tab = await this.getCurrentTab();

      if (!(await this.canAccessTab(tab))) {
        this.showStatus(
          "Cannot analyze this page. Please navigate to a regular web page (http:// or https://).",
          "error"
        );
        return;
      }

      // Execute quick analysis
      const analysis = await this.executeScript(tab.id, () => {
        if (typeof PageAnalyzer !== "undefined") {
          return PageAnalyzer.quickAnalyze();
        } else {
          throw new Error("PageAnalyzer not loaded");
        }
      });

      this.displayQuickAnalysis(analysis);
      this.showStatus("Quick analysis completed successfully", "success");
    } catch (error) {
      console.error("Analysis error:", error);
      this.showStatus(
        `Error: ${error.message}. Try refreshing the page and try again.`,
        "error"
      );
    } finally {
      this.setButtonLoading(btn, false);
    }
  }

  /**
   * Analyze exam question
   */
  async analyzeQuestion() {
    const questionText = document.getElementById("examQuestion")?.value?.trim();

    if (!questionText) {
      this.showStatus("Please paste an exam question first", "warning");
      return;
    }

    const btn = document.getElementById("analyzeQuestion");
    this.setButtonLoading(btn, true, "Analyzing...");

    try {
      const tab = await this.getCurrentTab();

      if (!(await this.canAccessTab(tab))) {
        this.showStatus(
          "Cannot analyze this page. Navigate to the exam page first.",
          "error"
        );
        return;
      }

      // Parse question
      const question = this.parseExamQuestion(questionText);

      if (!question.testId) {
        this.showStatus(
          'Could not find Test ID. Please include "Test ID: X.X" in your question.',
          "error"
        );
        return;
      }

      // Analyze page for this specific test
      const pageAnalysis = await this.executeScript(
        tab.id,
        (testId) => {
          if (typeof PageAnalyzer !== "undefined") {
            return PageAnalyzer.analyzeForTest(testId);
          } else {
            throw new Error("PageAnalyzer not loaded");
          }
        },
        [question.testId]
      );

      if (pageAnalysis.error) {
        throw new Error(pageAnalysis.message || "Analysis failed");
      }

      // Get answer recommendation from background script
      const answer = await chrome.runtime.sendMessage({
        action: "getAnswerRecommendation",
        question: question,
        pageAnalysis: pageAnalysis,
      });

      // Display results
      this.displayResults(answer, question, pageAnalysis);

      // Save to history
      await this.saveToHistory({
        testId: question.testId,
        testName: question.testName,
        answer: answer.recommendedAnswer,
        confidence: answer.confidence,
        url: tab.url,
        pageTitle: tab.title,
        timestamp: new Date().toISOString(),
      });

      this.showStatus("Analysis completed successfully!", "success");
    } catch (error) {
      console.error("Question analysis error:", error);
      this.showStatus(
        `Error: ${error.message}. Make sure you're on the exam page and it's fully loaded.`,
        "error"
      );
    } finally {
      this.setButtonLoading(btn, false);
    }
  }

  /**
   * Parse exam question text
   */
  parseExamQuestion(text) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);

    const question = {
      testId: "",
      testName: "",
      testCondition: "",
      choices: [],
    };

    // Extract test metadata
    for (const line of lines) {
      const testIdMatch = line.match(/Test\s+ID:\s*(.+)/i);
      const testNameMatch = line.match(/Test\s+Name:\s*(.+)/i);
      const testConditionMatch = line.match(/Test\s+Condition:\s*(.+)/i);

      if (testIdMatch) {
        question.testId = testIdMatch[1].trim();
      } else if (testNameMatch) {
        question.testName = testNameMatch[1].trim();
      } else if (testConditionMatch) {
        question.testCondition = testConditionMatch[1].trim();
      }
    }

    // Extract answer choices (a-e)
    const choicePattern = /^([a-e])\.?\s+(.+)/i;
    for (const line of lines) {
      const match = line.match(choicePattern);
      if (match) {
        question.choices.push({
          letter: match[1].toLowerCase(),
          text: match[2].trim(),
        });
      }
    }

    return question;
  }

  /**
   * Run manual test
   */
  async runManualTest() {
    const testId = document.getElementById("testIdSelect")?.value;

    if (!testId) {
      this.showStatus("Please select a test to run", "warning");
      return;
    }

    const btn = document.getElementById("runManualTest");
    this.setButtonLoading(btn, true, "Testing...");

    try {
      const tab = await this.getCurrentTab();

      if (!(await this.canAccessTab(tab))) {
        this.showStatus("Cannot test this page", "error");
        return;
      }

      // Run test
      const result = await this.executeScript(
        tab.id,
        (testId) => {
          if (typeof PageAnalyzer !== "undefined") {
            return PageAnalyzer.runSpecificTest(testId);
          } else {
            throw new Error("PageAnalyzer not loaded");
          }
        },
        [testId]
      );

      this.displayManualTestResult(result, testId);
      this.showStatus(`Test ${testId} completed`, "success");
    } catch (error) {
      console.error("Manual test error:", error);
      this.showStatus(`Error: ${error.message}`, "error");
    } finally {
      this.setButtonLoading(btn, false);
    }
  }

  /**
   * Display quick analysis results
   */
  displayQuickAnalysis(analysis) {
    const resultsDiv = document.getElementById("quickAnalysisResults");
    if (!resultsDiv) return;

    const html = `
            <div class="quick-analysis">
                <h4>📊 Page Overview</h4>
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <span class="label">Page Title:</span>
                        <span class="value">${this.escapeHtml(
                          analysis.title || "None"
                        )}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Title Elements:</span>
                        <span class="value ${
                          analysis.titleCount !== 1 ? "error" : "success"
                        }">
                            ${analysis.titleCount} ${
      analysis.titleCount === 1 ? "✓" : "⚠"
    }
                        </span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Images:</span>
                        <span class="value">${analysis.imageCount} total, ${
      analysis.imagesWithAlt
    } with alt</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Headings:</span>
                        <span class="value">${analysis.headingCount} (${
      analysis.h1Count
    } H1)</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Form Fields:</span>
                        <span class="value">${analysis.formFieldCount}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Links:</span>
                        <span class="value">${analysis.linkCount}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Tables:</span>
                        <span class="value">${analysis.tableCount}</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Landmarks:</span>
                        <span class="value">${
                          analysis.landmarkCount || 0
                        }</span>
                    </div>
                    <div class="analysis-item">
                        <span class="label">Page Language:</span>
                        <span class="value">${
                          analysis.pageLang || "not set"
                        }</span>
                    </div>
                </div>
            </div>
        `;

    resultsDiv.innerHTML = html;
    resultsDiv.classList.remove("hidden");
  }

  /**
   * Display exam question results
   */
  displayResults(answer, question, pageAnalysis) {
    const resultsDiv = document.getElementById("results");
    if (!resultsDiv) return;

    // Find the correct choice
    const correctChoice = question.choices.find(
      (c) => c.letter === answer.recommendedAnswer
    );

    // Answer text
    const answerTextDiv = document.getElementById("answerText");
    if (answerTextDiv) {
      answerTextDiv.innerHTML = `
                <div class="answer-letter">Answer: ${answer.recommendedAnswer.toUpperCase()}</div>
                <div class="answer-choice-text">${
                  correctChoice
                    ? this.escapeHtml(correctChoice.text)
                    : "See reasoning below"
                }</div>
            `;
    }

    // Analysis details
    const detailsDiv = document.getElementById("analysisDetails");
    if (detailsDiv) {
      detailsDiv.innerHTML = `
                <div class="detail-item">
                    <strong>Test ID:</strong> ${this.escapeHtml(
                      question.testId
                    )}
                </div>
                <div class="detail-item">
                    <strong>Test Name:</strong> ${this.escapeHtml(
                      question.testName
                    )}
                </div>
                <div class="detail-item">
                    <strong>Page Findings:</strong> ${this.escapeHtml(
                      answer.findings
                    )}
                </div>
                <div class="detail-item">
                    <strong>Reasoning:</strong> ${this.escapeHtml(
                      answer.reasoning
                    )}
                </div>
            `;
    }

    // Confidence
    const confidence = Math.min(100, Math.max(0, answer.confidence || 75));
    const confidenceFill = document.getElementById("confidenceFill");
    const confidenceText = document.getElementById("confidenceText");

    if (confidenceFill) {
      confidenceFill.style.width = `${confidence}%`;
    }
    if (confidenceText) {
      confidenceText.textContent = `${confidence}% confidence in this answer`;
    }

    resultsDiv.classList.remove("hidden");
    resultsDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Display manual test results
   */
  displayManualTestResult(result, testId) {
    const resultsDiv = document.getElementById("manualResults");
    if (!resultsDiv) return;

    const statusClass =
      result.status === "PASS"
        ? "success"
        : result.status === "FAIL"
        ? "error"
        : result.status === "MANUAL"
        ? "warning"
        : "info";

    resultsDiv.innerHTML = `
            <div class="manual-test-result ${statusClass}">
                <h4>Test ${testId} Results</h4>
                <div class="result-status">
                    <strong>Status:</strong> ${result.status}
                </div>
                <div class="result-findings">
                    <strong>Findings:</strong> ${this.escapeHtml(
                      result.findings
                    )}
                </div>
                <div class="result-details">
                    <strong>Details:</strong> ${this.escapeHtml(result.details)}
                </div>
            </div>
        `;

    resultsDiv.classList.remove("hidden");
  }

  /**
   * History management
   */
  async loadHistory() {
    try {
      const data = await chrome.storage.local.get("analysisHistory");
      this.history = data.analysisHistory || [];
    } catch (error) {
      console.error("Error loading history:", error);
      this.history = [];
    }
  }

  async saveToHistory(item) {
    this.history.unshift(item);

    // Keep only last 50 items
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }

    try {
      await chrome.storage.local.set({ analysisHistory: this.history });
    } catch (error) {
      console.error("Error saving history:", error);
    }
  }

  renderHistory() {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;

    if (this.history.length === 0) {
      historyList.innerHTML =
        '<p class="empty-state">No analysis history yet</p>';
      return;
    }

    historyList.innerHTML = this.history
      .map((item) => {
        const date = new Date(item.timestamp);
        const formattedDate =
          date.toLocaleDateString() + " " + date.toLocaleTimeString();

        return `
                <div class="history-item">
                    <div class="history-header">
                        <span class="history-test-id">${this.escapeHtml(
                          item.testId
                        )}</span>
                        <span class="history-date">${formattedDate}</span>
                    </div>
                    <div class="history-test-name">${this.escapeHtml(
                      item.testName || ""
                    )}</div>
                    <div class="history-result">
                        Answer: <strong>${item.answer.toUpperCase()}</strong> 
                        (${item.confidence || 0}% confidence)
                    </div>
                    <div class="history-page-info">
                        <div class="history-page-title">${this.escapeHtml(
                          item.pageTitle || "Untitled"
                        )}</div>
                        <div class="history-url">${this.escapeHtml(
                          this.truncateUrl(item.url, 50)
                        )}</div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  async clearHistory() {
    if (!confirm("Clear all analysis history? This cannot be undone.")) {
      return;
    }

    this.history = [];

    try {
      await chrome.storage.local.set({ analysisHistory: [] });
      this.renderHistory();
      this.showStatus("History cleared", "success");
    } catch (error) {
      console.error("Error clearing history:", error);
      this.showStatus("Error clearing history", "error");
    }
  }

  /**
   * UI Helper Methods
   */
  setButtonLoading(button, loading, text = "Loading...") {
    if (!button) return;

    if (loading) {
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = `<span class="loading-spinner"></span> ${text}`;
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
  }

  showStatus(message, type = "info") {
    const statusDiv = document.getElementById("statusMessage");
    if (!statusDiv) {
      alert(message);
      return;
    }

    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusDiv.classList.add("hidden");
    }, 5000);
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  truncateUrl(url, maxLength = 50) {
    if (!url || url.length <= maxLength) return url;
    return url.substring(0, maxLength - 3) + "...";
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new PopupController();
});

// Log version
console.log("Trusted Tester Exam Assistant v5.2.0 - Popup loaded");
