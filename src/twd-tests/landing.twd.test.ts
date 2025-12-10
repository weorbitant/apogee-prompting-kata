import { twd, screenDom, userEvent } from "twd-js";
import { describe, it } from "twd-js/runner";

describe("Landing Page", () => {
  it("should display hero section with logo, title, and subtitle", async () => {
    await twd.visit("/");

    // Check logo is visible
    const logo = screenDom.getByAltText("Orbitant Logo");
    twd.should(logo, "be.visible");

    const screenshot = screenDom.getByRole("img", { name: "Apogee example of betisman giving karma to multiple users" });
    twd.should(screenshot, "be.visible");

    // Check main title
    const title = screenDom.getByRole("heading", { name: "Apogee Prompting Kata" });
    twd.should(title, "be.visible");
    twd.should(title, "have.text", "Apogee Prompting Kata");

    // Check subtitle
    const subtitle = screenDom.getByText(
      "Improve your prompting skills by exploring hidden insights in Apogee data"
    );
    twd.should(subtitle, "be.visible");
  });

  it("should display 'What's Apogee About' card", async () => {
    await twd.visit("/");

    const cardTitle = screenDom.getByRole("heading", { name: "What's Apogee About" });
    twd.should(cardTitle, "be.visible");

    const cardContent = screenDom.getByText(/Apogee is the ultimate karma bot/i);
    twd.should(cardContent, "be.visible");

    // Check for code examples
    const codeExample1 = screenDom.getByText("@user ++");
    twd.should(codeExample1, "be.visible");

    const codeExample2 = screenDom.getByText("@user --");
    twd.should(codeExample2, "be.visible");
  });

  it("should display 'What's the Kata About' card", async () => {
    await twd.visit("/");

    const cardTitle = screenDom.getByRole("heading", { name: "What's the Kata About" });
    twd.should(cardTitle, "be.visible");

    const cardContent = screenDom.getByText(/improve our prompting skills/i);
    twd.should(cardContent, "be.visible");
  });

  it("should display 'What You'll Find in This Repo' card", async () => {
    await twd.visit("/");

    const cardTitle = screenDom.getByRole("heading", {
      name: "What You'll Find in This Repo",
    });
    twd.should(cardTitle, "be.visible");

    // Check for subsection titles
    const nodeCodeTitle = screenDom.getByRole("heading", { name: "A bit of node code" });
    twd.should(nodeCodeTitle, "be.visible");

    const exampleDataTitle = screenDom.getByRole("heading", { name: "Example Data" });
    twd.should(exampleDataTitle, "be.visible");

    // Check for tool names
    const tool1 = screenDom.getByText("getLastWeekLeaderboard()");
    twd.should(tool1, "be.visible");

    const tool2 = screenDom.getByText("getLastWeekTransactions()");
    twd.should(tool2, "be.visible");

    const tool3 = screenDom.getByText("getTodayLeaderboard()");
    twd.should(tool3, "be.visible");

    // Check for example data sections
    const leaderboardTitle = screenDom.getByRole("heading", { name: "Leaderboard" });
    twd.should(leaderboardTitle, "be.visible");

    const transactionsTitle = screenDom.getByRole("heading", { name: "Transactions" });
    twd.should(transactionsTitle, "be.visible");

    // Check for example JSON data
    const leaderboardData = screenDom.getAllByText(/David Yusta/i);
    twd.should(leaderboardData[0], "be.visible");

    const transactionsData = screenDom.getAllByText(/fromName/i);
    twd.should(transactionsData[0], "be.visible");
  });

  it("should display 'Start the Kata' button", async () => {
    await twd.visit("/");

    const button = screenDom.getByRole("link", { name: "Start the Kata" });
    twd.should(button, "be.visible");
    twd.should(button, "have.text", "Start the Kata");
  });

  it("should navigate to chat page when clicking 'Start the Kata' button", async () => {
    await twd.visit("/");

    const button = screenDom.getByRole("link", { name: "Start the Kata" });
    twd.should(button, "be.visible");

    const user = userEvent.setup();
    await user.click(button);

    // Check that we navigated to /chat
    twd.url().should("contain.url", "/chat");
  });

  it("should display hero image", async () => {
    await twd.visit("/");

    const heroImage = screenDom.getByAltText("Apogee Hero");
    twd.should(heroImage, "be.visible");
  });

  it("should display 'How to Submit Your Solution' card", async () => {
    await twd.visit("/");

    const cardTitle = screenDom.getByRole("heading", {
      name: "How to Submit Your Solution",
    });
    twd.should(cardTitle, "be.visible");

    // Check for main instruction text
    const instructionText = screenDom.getByText(/Once you've crafted your perfect prompt/i);
    twd.should(instructionText, "be.visible");

    // Check for mention of teams folder
    const teamsFolderText = screenDom.getByText(/Each team has a dedicated folder/i);
    twd.should(teamsFolderText, "be.visible");

    // Check for step 1
    const step1 = screenDom.getByText(/Create a new branch/i);
    twd.should(step1, "be.visible");

    // Check for git commands
    const gitCheckout = screenDom.getByText(/git checkout -b your-team-name-solution/i);
    twd.should(gitCheckout, "be.visible");

    // Check for step 2
    const step2 = screenDom.getByText(/Modify the README.md/i);
    twd.should(step2, "be.visible");

    // Check for step 3
    const step3 = screenDom.getByText(/Commit your changes/i);
    twd.should(step3, "be.visible");

    // Check for step 4
    const step4 = screenDom.getByText(/Push your branch/i);
    twd.should(step4, "be.visible");

    // Check for solution format section
    const solutionFormat = screenDom.getByText("Solution Format");
    twd.should(solutionFormat, "be.visible");

    // Check for format instructions
    const formatInstructions = screenDom.getByText(/Please include your final prompt text/i);
    twd.should(formatInstructions, "be.visible");
  });
});
