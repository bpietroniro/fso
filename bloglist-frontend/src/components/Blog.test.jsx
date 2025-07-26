import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

let container;
let mockLikesHandler;

beforeEach(() => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: { username: "superuser", id: "id" },
  };

  mockLikesHandler = vi.fn();

  container = render(
    <Blog blog={blog} handleLike={mockLikesHandler} />
  ).container;
});

test("renders title and author at start, but not URL or likes", () => {
  const titleAndAuthorElement = screen.getByText(
    "React patterns — Michael Chan"
  );
  expect(titleAndAuthorElement).toBeDefined();
  const urlElement = screen.queryByText("https://reactpatterns.com");
  expect(urlElement).toBeNull();
  const likesElement = screen.queryByText("7");
  expect(likesElement).toBeNull();
});

test("renders URL and likes after toggle button is clicked", async () => {
  const user = userEvent.setup();
  const button = container.querySelector("#like-button");
  await user.click(button);

  const urlElement = screen.queryByText("https://reactpatterns.com");
  expect(urlElement).toBeDefined();
  const likesElement = screen.queryByText("7");
  expect(likesElement).toBeDefined();
});

test("likes button event handler is called once for each click", async () => {
  const user = userEvent.setup();

  const showButton = screen.getByText("view details");
  await user.click(showButton);

  const likesButton = container.querySelector("#like-button");

  await user.click(likesButton);
  await user.click(likesButton);

  expect(mockLikesHandler.mock.calls).toHaveLength(2);
});
