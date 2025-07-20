const { test, after, before, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

let user;
let mockBlogsList;

before(async () => {
  await User.deleteMany();

  const passwordHash = await bcrypt.hash("secret", 10);
  user = new User({ username: "root", passwordHash });

  await user.save();

  mockBlogsList = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      user: user._id.toString(),
      __v: 0,
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: user._id.toString(),
      __v: 0,
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      user: user._id.toString(),
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      user: user._id.toString(),
      __v: 0,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      user: user._id.toString(),
      __v: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      user: user._id.toString(),
      __v: 0,
    },
  ];
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(mockBlogsList);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, mockBlogsList.length);
});

test("unique identifier has no underscore", async () => {
  const response = await api.get("/api/blogs");
  assert(response.body[0].id !== undefined);
  assert(response.body[0]._id === undefined);
});

// TODO fix with JWT
describe("adding a blog", () => {
  let token;

  beforeEach(async () => {
    const loginResult = await api.post("/api/login").send({
      username: "root",
      password: "secret",
    });

    token = loginResult.body.token;
  });

  test("succeeds with 201 with valid data", async () => {
    const newBlog = {
      title:
        "New courses on distributed systems and elliptic curve cryptography",
      author: "Martin Kleppmann",
      url: "https://martin.kleppmann.com/2020/11/18/distributed-systems-and-elliptic-curves.html",
      likes: 9,
      userId: user._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const authors = response.body.map((blog) => blog.author);

    assert.strictEqual(response.body.length, mockBlogsList.length + 1);
    assert(authors.includes("Martin Kleppmann"));
  });

  test("missing likes property is parsed as 0", async () => {
    const newBlog = {
      title:
        "New courses on distributed systems and elliptic curve cryptography",
      author: "Martin Kleppmann",
      url: "https://martin.kleppmann.com/2020/11/18/distributed-systems-and-elliptic-curves.html",
      userId: user._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const result = response.body.find(
      (blog) => blog.author === "Martin Kleppmann"
    );

    assert.strictEqual(result.likes, 0);
  });

  test("missing title or URL results in 400 error", async () => {
    const newBlog = {
      author: "Martin Kleppmann",
      userId: user._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
});

// TODO fix with JWT
describe("deleting a blog", () => {
  let token = "token";

  beforeEach(async () => {
    const loginResult = await api.post("/api/login").send({
      username: "root",
      password: "secret",
    });

    token = loginResult.body.token;
  });

  test("succeeds with 204 given a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(204);
  });

  test("fails with 400 for invalid id", async () => {
    const id = "blahblahblah";

    await api
      .delete(`/api/blogs/${id}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(400);
  });
});

// TODO
describe("updating a blog", () => {
  test("succeeds with 200 given valid data", async () => {
    const updatedBlogData = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 8,
    };

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200);

    const result = await api.get(`/api/blogs/${blogToUpdate.id}`);
    assert.strictEqual(result.body.likes, 8);
  });
});

after(async () => {
  await mongoose.connection.close();
});
