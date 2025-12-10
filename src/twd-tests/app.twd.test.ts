import { twd, screenDom, userEvent, expect } from "twd-js";
import { describe, it, beforeEach } from "twd-js/runner";

describe("App Form", () => {
  beforeEach(() => {
    twd.clearRequestMockRules();
  });

  it("should complete the form", async () => {
    await twd.mockRequest('sendMessage', {
      method: "POST",
      status: 200,
      url: "/api/process",
      response: `data: ${JSON.stringify({ chunk: "Here are some ", done: false })}\n\n` +
        `data: ${JSON.stringify({ chunk: "interesting insights", done: false })}\n\n` +
        `data: ${JSON.stringify({ chunk: " from last week.", done: true })}\n\n`,
      responseHeaders: {
        "Content-Type": "text/event-stream",
      },
    });
    await twd.visit("/chat");

    const user = userEvent.setup();

    // Check submit button is disabled
    const submitButton = screenDom.getByRole("button", { name: "Submit" });
    twd.should(submitButton, "be.disabled");

    // Check three tools are displayed
    const tool1 = screenDom.getByText("Get Last Week Leaderboard");
    twd.should(tool1, "be.visible");

    const tool2 = screenDom.getByText("Get Last Week Transactions");
    twd.should(tool2, "be.visible");

    const tool3 = screenDom.getByText("Get Today Leaderboard");
    twd.should(tool3, "be.visible");

    // Fill form
    const textarea = screenDom.getByLabelText("Main prompt input (required)");
    await user.type(textarea, "What are the most interesting insights from last week?");

    await user.click(submitButton);

    const rule = await twd.waitForRequest('sendMessage');
    expect(rule.request).to.deep.equal({
      tools: "getLastWeekLeaderboard,getLastWeekTransactions,getTodayLeaderboard",
      prompt: "What are the most interesting insights from last week?"
    });
  });

  it("should display error when request fails", async () => {
    await twd.mockRequest('errorRequest', {
      method: "POST",
      status: 500,
      url: "/api/process",
      response: "Internal Server Error",
      responseHeaders: {
        "Content-Type": "text/event-stream",
      },
    });

    await twd.visit("/chat");

    const user = userEvent.setup();

    // Fill form
    const textarea = screenDom.getByLabelText("Main prompt input (required)");
    await user.type(textarea, "Test prompt");

    const submitButton = screenDom.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    // Wait for error to appear
    const errorMessage = await screenDom.findByText(/HTTP error! status: 500/i);
    twd.should(errorMessage, "be.visible");

    // Check error heading is visible
    const errorHeading = screenDom.getByText("Error");
    twd.should(errorHeading, "be.visible");
  });


  it("keyboard navigation should work", async () => {
    await twd.visit("/chat");

    const user = userEvent.setup();

    // Test keyboard navigation
    await user.tab();
    const backToLanding = screenDom.getByRole("link", { name: "← Back to Landing" });
    twd.should(backToLanding, "be.focused");
    await user.tab();
    await user.keyboard('write some text')
    const textarea = screenDom.getByLabelText("Main prompt input (required)");
    twd.should(textarea, "have.text", "write some text");
  });
});
