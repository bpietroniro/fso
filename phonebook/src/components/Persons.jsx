const Persons = ({ persons, filter, onDelete }) => {
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(filter))
        .map((person) => (
          <p key={person.name}>
            {person.name} {person.number}{" "}
            <button onClick={() => onDelete(person)}>delete</button>
          </p>
        ))}
    </div>
  );
};

export default Persons;
