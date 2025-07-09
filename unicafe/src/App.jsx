import { useState } from "react";

const App = () => {
  const [goodCount, setGoodCount] = useState(0);
  const [neutralCount, setNeutralCount] = useState(0);
  const [badCount, setBadCount] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <div>
        <Button onClick={() => setGoodCount(goodCount + 1)} label="good" />
        <Button
          onClick={() => setNeutralCount(neutralCount + 1)}
          label="neutral"
        />
        <Button onClick={() => setBadCount(badCount + 1)} label="bad" />
      </div>
      <h2>statistics</h2>
      <Statistics good={goodCount} neutral={neutralCount} bad={badCount} />
    </div>
  );
};

const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  return total > 0 ? (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={(good - bad) / total} />
        <StatisticLine text="good" value={`${(100 * good) / total}%`} />
      </tbody>
    </table>
  ) : (
    <p>No feedback given</p>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <th scope="row">{text}</th>
      <td>{value}</td>
    </tr>
  );
};

export default App;
