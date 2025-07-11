const Country = ({ country }) => {
  const name = country.name.common;

  return (
    <>
      <h1>{name}</h1>
      <div>Capital: {country.capital[0]}</div>
      <div>Area: {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={`${name}-${language}`}>{language}</li>
        ))}
      </ul>
      <div style={{ fontSize: "120px" }}>{country.flag}</div>
    </>
  );
};

export default Country;
