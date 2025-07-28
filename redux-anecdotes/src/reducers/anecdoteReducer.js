import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addNewAnecdote(state, action) {
      state.push(action.payload);
    },
    vote(state, action) {
      const toVoteOn = state.find((anecdote) => anecdote.id === action.payload);
      const votedOn = { ...toVoteOn, votes: toVoteOn.votes + 1 };
      return state.map((a) => (a.id === action.payload ? votedOn : a));
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { addNewAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(addNewAnecdote(newAnecdote));
  };
};

export const vote = (anecdote) => {
  return async (dispatch, getState) => {
    const updatedAnecdote = await anecdoteService.vote(anecdote);
    const updatedAnecdoteList = getState().anecdotes.map((a) =>
      a.id === updatedAnecdote.id ? updatedAnecdote : a
    );
    dispatch(setAnecdotes(updatedAnecdoteList));
  };
};
export default anecdoteSlice.reducer;
