import { useSelector, useDispatch } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdotesList = () => {
  const anecdotes = useSelector((state) =>
    state.anecdotes
      .filter((a) => a.content.toLowerCase().includes(state.filter))
      .sort((a, b) => (a.votes < b.votes ? 1 : -1))
  );

  const dispatch = useDispatch();

  const voteOnAnecdote = (anecdote) => {
    dispatch(vote(anecdote));
    dispatch(setNotification(`you voted for "${anecdote.content}"`, 5));
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteOnAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdotesList;
