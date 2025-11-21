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

    // Check three checkboxes with the tools
    const tool1 = screenDom.getByLabelText("Get Last Week Leaderboard");
    twd.should(tool1, "be.visible");

    const tool2 = screenDom.getByLabelText("Get Last Week Transactions");
    twd.should(tool2, "be.visible");

    const tool3 = screenDom.getByLabelText("Get Today Leaderboard");
    twd.should(tool3, "be.visible");

    // Fill form
    const textarea = screenDom.getByLabelText("Prompt");
    await user.type(textarea, "What are the most interesting insights from last week?");

    await user.click(tool1);
    await user.click(tool2);
    await user.click(tool3);

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
    const textarea = screenDom.getByLabelText("Prompt");
    await user.type(textarea, "Test prompt");

    const tool1 = screenDom.getByLabelText("Get Last Week Leaderboard");
    await user.click(tool1);

    const submitButton = screenDom.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    // Wait for error to appear
    const errorMessage = await screenDom.findByText(/HTTP error! status: 500/i);
    twd.should(errorMessage, "be.visible");

    // Check error heading is visible
    const errorHeading = screenDom.getByText("Error");
    twd.should(errorHeading, "be.visible");
  });
});
