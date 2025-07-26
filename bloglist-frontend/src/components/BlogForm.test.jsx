import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> calls onSubmit with the correct details", async () => {
  const mockSubmitHandler = vi.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm addBlog={mockSubmitHandler} />);

  const titleInput = container.querySelector("#title-input");
  const authorInput = container.querySelector("#author-input");
  const urlInput = container.querySelector("#url-input");
  const submitButton = screen.getByText("create");

  await user.type(titleInput, "test title");
  await user.type(authorInput, "test author");
  await user.type(urlInput, "https://test.com");
  await user.click(submitButton);

  expect(mockSubmitHandler.mock.calls).toHaveLength(1);
  expect(mockSubmitHandler.mock.calls[0][0].title).toBe("test title");
});
