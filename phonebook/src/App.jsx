import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import phonebookService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((returnedObj) => setPersons(returnedObj));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.map((p) => p.name).includes(newName)) {
      if (
        confirm(
          `${newName} is already in the phonebook, do you want to replace the old number with a new one?`
        )
      ) {
        updateEntry();
      }
      return;
    }
    const newPerson = { name: newName, number: newNumber };

    phonebookService.create(newPerson).then((returnedObj) => {
      setPersons(persons.concat(returnedObj));
      setNewName("");
      setNewNumber("");
      setMessage({ text: `Added ${returnedObj.name}`, status: "success" });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const updateEntry = () => {
    const personToUpdate = persons.find((p) => p.name === newName);

    phonebookService
      .updateNumber({ ...personToUpdate, number: newNumber })
      .then((returnedObj) => {
        setPersons(
          persons.map((p) => (p.id === returnedObj.id ? returnedObj : p))
        );
        setNewName("");
        setNewNumber("");
        setMessage({ text: `Updated ${returnedObj.name}`, status: "success" });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setMessage({ text: error.message, status: "error" });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };

  const deleteEntry = (entry) => {
    if (confirm(`Delete ${entry.name}?`)) {
      phonebookService
        .deleteEntry(entry.id)
        .then((res) => setPersons(persons.filter((p) => p.id !== res.id)))
        .catch((error) => {
          setMessage({ text: error.message, status: "error" });
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {message && (
        <Notification message={message.text} status={message.status} />
      )}
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add new</h2>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onDelete={deleteEntry} />
    </div>
  );
};

export default App;
