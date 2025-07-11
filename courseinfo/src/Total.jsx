const Total = ({ parts }) => {
  return (
    <p style={{ fontWeight: "bold" }}>
      {`total of ${parts.reduce(
        (acc, cur) => acc + cur.exercises,
        0
      )} exercises`}
    </p>
  );
};

export default Total;
