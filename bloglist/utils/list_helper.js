const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0);
};

const favoriteBlog = (blogs) => {
  let maxLikes = 0;
  let favorite = undefined;

  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favorite = blog;
    }
  }

  return favorite;
};

const mostBlogs = (blogs) => {
  const authorsBlogs = _.groupBy(blogs, "author");

  return _.maxBy(_.keys(authorsBlogs), (key) => authorsBlogs[key].length);
};

const mostLikes = (blogs) => {
  const authorsBlogs = _.groupBy(blogs, "author");
  const authorsLikes = _.mapValues(authorsBlogs, (o) =>
    o.reduce((acc, cur) => acc + cur.likes, 0)
  );

  return _.maxBy(_.keys(authorsLikes), (key) => authorsLikes[key]);
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
