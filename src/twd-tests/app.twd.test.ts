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
    const textarea = screenDom.getByLabelText("Main prompt input (required)");
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
    const textarea = screenDom.getByLabelText("Main prompt input (required)");
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

  it("should select all tools when clicking Select All checkbox", async () => {
    await twd.visit("/chat");

    const user = userEvent.setup();

    // Get all tool checkboxes - verify they are unchecked initially
    screenDom.getByRole("checkbox", { name: "Get Last Week Leaderboard", checked: false });
    screenDom.getByRole("checkbox", { name: "Get Last Week Transactions", checked: false });
    screenDom.getByRole("checkbox", { name: "Get Today Leaderboard", checked: false });

    // Find and click Select All checkbox
    const selectAllCheckbox = screenDom.getByRole("checkbox", { name: "Select All", checked: false });
    twd.should(selectAllCheckbox, "be.visible");
    await user.click(selectAllCheckbox);

    // Verify Select All checkbox is now checked
    screenDom.getByRole("checkbox", { name: "Select All", checked: true });

    // Verify all tool checkboxes are now checked
    screenDom.getByRole("checkbox", { name: "Get Last Week Leaderboard", checked: true });
    screenDom.getByRole("checkbox", { name: "Get Last Week Transactions", checked: true });
    screenDom.getByRole("checkbox", { name: "Get Today Leaderboard", checked: true });

    // Click Select All checkbox again to deselect all
    await user.click(selectAllCheckbox);

    // Verify Select All checkbox is now unchecked
    screenDom.getByRole("checkbox", { name: "Select All", checked: false });

    // Verify all tool checkboxes are unchecked again
    const tool1 = screenDom.getByRole("checkbox", { name: "Get Last Week Leaderboard", checked: false });
    const tool2 = screenDom.getByRole("checkbox", { name: "Get Last Week Transactions", checked: false });
    const tool3 = screenDom.getByRole("checkbox", { name: "Get Today Leaderboard", checked: false });

    // verify select all is checked after selecting all tools
    await user.click(tool1);
    await user.click(tool2);
    await user.click(tool3);

    // verify select all is checked
    screenDom.getByRole("checkbox", { name: "Select All", checked: true });
  });
});
