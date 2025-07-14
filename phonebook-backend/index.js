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

app.get("/info", (request, response) => {
  const numEntries = PhonebookEntry.find({}).then((result) => result.length);

  response.send(
    `<p>Phonebook has info for ${numEntries} people</p><p>${new Date()}</p>`
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

app.delete("/api/persons/:id", (request, response, next) => {
  PhonebookEntry.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new PhonebookEntry({ name: body.name, number: body.number });

  person
    .save()
    .then((savedEntry) => response.json(savedEntry))
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  PhonebookEntry.findById(request.params.id)
    .then((entry) => {
      if (!entry) {
        return response.status(404).end();
      }

      entry.name = name;
      entry.number = number;

      entry
        .save()
        .then((updatedEntry) => response.json(updatedEntry))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

// should be the last loaded middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (
    error.name === "ValidationError" ||
    error.name === "ValidatorError"
  ) {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
