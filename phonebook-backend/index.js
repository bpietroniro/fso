require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const PhonebookEntry = require("./models/phonebookEntry");

app.use(express.json());
app.use(express.static("dist"));

morgan.token(
  "person",
  (req) => req.method === "POST" && JSON.stringify(req.body)
);
app.use(morgan(":method :url :status :response-time ms :person"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  PhonebookEntry.find({}).then((entries) => {
    response.json(entries);
  });
});

app.get("/api/persons/:id", (request, response) => {
  PhonebookEntry.findById(request.params.id).then((entry) => {
    response.json(entry);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new PhonebookEntry({ name: body.name, number: body.number });

  person.save().then((savedEntry) => response.json(savedEntry));
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
