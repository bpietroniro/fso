import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { setNotes } from "./reducers/noteReducer";
import noteService from "./services/notes";
import store from "./store";

noteService.getAll().then((notes) => store.dispatch(setNotes(notes)));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
