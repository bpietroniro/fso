import { useState } from "react";

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleAddBlog = (event) => {
    event.preventDefault();

    const blogObject = { title, author, url };
    addBlog(blogObject);

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        <label htmlFor="title-input">title:</label>
        <input
          id="title-input"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>
      <div>
        <label htmlFor="author-input">author:</label>
        <input
          id="author-input"
          onChange={(e) => setAuthor(e.target.value)}
          value={author}
        />
      </div>
      <div>
        <label htmlFor="url-input">url:</label>
        <input
          id="url-input"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
