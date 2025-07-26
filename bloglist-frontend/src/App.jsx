import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "../../notes-frontend/src/components/Togglable";
import { useRef } from "react";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1)))
      );
  }, []);

  useEffect(() => {
    const loggedInUserJson = window.localStorage.getItem(
      "loggedInBloglistUser"
    );
    if (loggedInUserJson) {
      const user = JSON.parse(loggedInUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat({ ...returnedBlog, user }));

      blogFormRef.current.toggleVisibility();
      setNotification({
        message: "blog successfully created",
        status: "success",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (e) {
      setNotification({ message: e.message, status: "error" });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleLike = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update({
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      });
      setBlogs(
        blogs
          .map((blog) =>
            blog.id === updatedBlog.id
              ? { ...updatedBlog, user: blog.user }
              : blog
          )
          .sort((a, b) => (a.likes < b.likes ? 1 : -1))
      );
      setNotification({
        message: "blog successfully updated",
        status: "success",
      });
      setTimeout(() => setNotification(null), 5000);
    } catch (e) {
      setNotification({ message: e.message, status: "error" });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDelete = async (blogToDelete) => {
    if (window.confirm(`Delete ${blogToDelete.title}?`))
      try {
        await blogService.deleteBlog(blogToDelete.id);
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id));
        setNotification({
          message: "blog successfully deleted",
          status: "success",
        });
        setTimeout(() => setNotification(null), 5000);
      } catch (e) {
        setNotification({ message: e.message, status: "error" });
        setTimeout(() => setNotification(null), 5000);
      }
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);

      window.localStorage.setItem("loggedInBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (e) {
      setNotification({ message: "wrong credentials", status: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    blogService.setToken(null);
    setUser(null);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          status={notification.status}
        />
      )}
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>{user.username} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <h2>blogs</h2>
          <div data-testid="blogs-div">
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                currentUser={user}
              />
            ))}
          </div>
          <div>
            <h2>create new</h2>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm addBlog={addBlog} />
            </Togglable>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
