const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, addBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    const testUser1 = {
      name: "Bethany Pietroniro",
      username: "bpietroniro",
      password: "password",
    };
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: testUser1,
    });

    await page.goto("/");
    await page.goto("http:/localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "bpietroniro", "password");
      await expect(page.getByText("bpietroniro logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "bpietroniro", "wrong");

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("wrong credentials");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(page.getByText("bpietroniro logged in")).not.toBeVisible();
    });
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "bpietroniro", "password");
    });

    test("a new blog can be added", async ({ page }) => {
      const blog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
      };

      await addBlog(page, blog);
      const newBlogHeading = await page.getByText(
        `${blog.title} — ${blog.author}`
      );
      await expect(newBlogHeading).toBeVisible();
      const newBlogContainer = await newBlogHeading.locator("..");
      await expect(
        newBlogContainer.getByRole("button", { name: "view details" })
      ).toBeVisible();
    });

    describe("when there is already a blog in the database", () => {
      let blog;

      beforeEach(async ({ page }) => {
        blog = {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
        };

        await addBlog(page, blog);
      });

      test("the blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view details" }).click();
        const likeButton = await page.getByRole("button", { name: "like" });
        await expect(likeButton).toBeVisible();
        likeButton.click();
        await expect(page.getByText("likes: 1")).toBeVisible();
      });

      test("the blog can be deleted by the user who added it", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "view details" }).click();
        const removeButton = await page.getByRole("button", { name: "remove" });
        expect(removeButton).toBeVisible();
        page.on("dialog", (dialog) => dialog.accept());
        await removeButton.click();

        const deletedBlogHeading = await page.getByText(
          `${blog.title} — ${blog.author}`
        );
        await expect(deletedBlogHeading).not.toBeVisible();
      });

      test("only the user who added the blog can see the blog's delete button", async ({
        page,
        request,
      }) => {
        const testUser2 = {
          name: "Someone Else",
          username: "someoneelse",
          password: "password",
        };
        await request.post("/api/users", {
          data: testUser2,
        });

        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, testUser2.username, testUser2.password);

        await page.getByRole("button", { name: "view details" }).click();
        const removeButton = await page.getByRole("button", { name: "remove" });
        expect(removeButton).not.toBeVisible();
      });
    });

    describe("when there are multiple blogs in the database", () => {
      const mockBlogsList = [
        {
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
        },
        {
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        },
        {
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        },
      ];

      beforeEach(async ({ page }) => {
        await addBlog(page, mockBlogsList[0]);
        await addBlog(page, mockBlogsList[1]);
        await addBlog(page, mockBlogsList[2]);
      });

      test("blogs are ordered by number of likes (desc)", async ({ page }) => {
        let blogs = await page.locator(".blog");
        await expect(blogs).toHaveCount(3);

        // TODO
        const blog1 = await page.getByText(
          `${mockBlogsList[2].title} — ${mockBlogsList[2].author}`
        );
        const blog2 = await page.getByText(
          `${mockBlogsList[1].title} — ${mockBlogsList[1].author}`
        );

        await blog1.getByRole("button", { name: "view details" }).click();
        const likeButton1 = await blog1.getByRole("button", { name: "like" });
        await likeButton1.click();
        await likeButton1.click();

        await blog2.getByRole("button", { name: "view details" }).click();
        const likeButton2 = await blog2.getByRole("button", { name: "like" });
        await likeButton2.click();

        expect(
          blogs
            .nth(0)
            .getByText(`${mockBlogsList[2].title} — ${mockBlogsList[2].author}`)
        );
        expect(
          blogs
            .nth(1)
            .getByText(`${mockBlogsList[1].title} — ${mockBlogsList[1].author}`)
        );
      });
    });
  });
});
