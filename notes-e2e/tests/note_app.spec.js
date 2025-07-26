const { test, expect, describe, beforeEach } = require("@playwright/test");
const { loginWith, createNote } = require("./helper");

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Bethany Pietroniro",
        username: "bpietroniro",
        password: "password",
      },
    });

    await page.goto("/");
  });

  test("front page can be opened", async ({ page }) => {
    const locator = await page.getByText("Notes");
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        "Note app, Department of Computer Science, University of Helsinki 2025"
      )
    ).toBeVisible();
  });

  test("login form can be opened and used", async ({ page }) => {
    await loginWith(page, "bpietroniro", "password");
    await expect(page.getByText("bpietroniro logged in")).toBeVisible();
  });

  test("login fails with wrong password", async ({ page }) => {
    await loginWith(page, "bpietroniro", "wrong");

    const errorDiv = page.locator(".error");
    await expect(errorDiv).toContainText("wrong credentials");
    await expect(errorDiv).toHaveCSS("border-style", "solid");
    await expect(page.getByText("bpietroniro logged in")).not.toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "bpietroniro", "password");
    });

    test("a new note can be created", async ({ page }) => {
      const content = "a note created by playwright";
      await createNote(page, content);
      await expect(page.getByText(content)).toBeVisible();
    });

    describe("and a note exists", () => {
      beforeEach(async ({ page }) => {
        const content = "another note by playwright";
        await createNote(page, content);
      });

      test("importance can be changed", async ({ page }) => {
        await page.getByRole("button", { name: "make not important" }).click();
        await expect(page.getByText("make important")).toBeVisible();
      });
    });

    describe("and several notes exist", () => {
      beforeEach(async ({ page }) => {
        await createNote(page, "first note");
        await createNote(page, "second note");
        await createNote(page, "third note");
      });

      test("one of those can be made nonimportant", async ({ page }) => {
        const otherNoteText = await page.getByText("second note");
        const otherNoteElement = await otherNoteText.locator("..");

        await otherNoteElement
          .getByRole("button", { name: "make not important" })
          .click();
        await expect(
          otherNoteElement.getByText("make important")
        ).toBeVisible();
      });
    });
  });
});
