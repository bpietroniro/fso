import AnecdoteForm from "./components/AnecdoteForm";
import Notification, {
  useNotificationDispatch,
} from "./components/Notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./requests";

const App = () => {
  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const handleVote = (anecdote) => {
    updateNoteMutation.mutate(
      { ...anecdote, votes: anecdote.votes + 1 },
      {
        onSuccess: () =>
          notificationDispatch(`You voted for "${anecdote.content}"`),
        onError: () => notificationDispatch("Voting failed"),
      }
    );
  };

  const updateNoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) =>
          a.id === updatedAnecdote.id ? updatedAnecdote : a
        )
      );
    },
  });

  const anecdotesResult = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (anecdotesResult.isLoading) {
    return <div>loading data...</div>;
  }
  if (anecdotesResult.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = anecdotesResult.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
