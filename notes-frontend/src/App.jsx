import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Note from "./components/Note";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import notesService from "./services/notes";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";
import { useRef } from "react";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
  const noteFormRef = useRef();

  useEffect(() => {
    notesService.getAll().then((initialNotes) => setNotes(initialNotes));
  }, []);

  useEffect(() => {
    const loggedInUserJson = window.localStorage.getItem("loggedInNoteappUser");
    if (loggedInUserJson) {
      const user = JSON.parse(loggedInUserJson);
      setUser(user);
      notesService.setToken(user.token);
    }
  }, []);

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    notesService
      .create(noteObject)
      .then((returnedNote) => setNotes(notes.concat(returnedNote)));
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);

      window.localStorage.setItem("loggedInNoteappUser", JSON.stringify(user));
      notesService.setToken(user.token);
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
    notesService.setToken(null);
    setUser(null);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    notesService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)))
      )
      .catch((error) => {
        setNotification({
          message: `the note '${note.content}' was already deleted from server`,
          status: "error",
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        console.error(error.message);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      {notification && (
        <Notification
          message={notification?.message}
          status={notification?.status}
        />
      )}

      {user === null ? (
        <Togglable buttonLabel="show login">
          <LoginForm handleSubmit={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>{user.username} logged in</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
