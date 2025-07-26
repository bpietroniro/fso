import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetailsVisible = () => setDetailsVisible(!detailsVisible);

  return (
    <div className="blog">
      {blog.title} — {blog.author}{" "}
      <button onClick={toggleDetailsVisible}>
        {detailsVisible ? "hide details" : "view details"}
      </button>
      {detailsVisible && (
        <div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes: {blog.likes}{" "}
            <button id="like-button" onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <div>created by: {blog.user.username}</div>
          {blog.user.username === currentUser.username && (
            <button onClick={() => handleDelete(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
