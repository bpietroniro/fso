const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const addBlog = async (page, blogData) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByLabel("title:").fill(blogData.title);
  await page.getByLabel("author:").fill(blogData.author);
  await page.getByLabel("url:").fill(blogData.url);
  await page.getByRole("button", { name: "create" }).click();
  await page.getByText(`${blogData.title} — ${blogData.author}`).waitFor();
};

export { loginWith, addBlog };
