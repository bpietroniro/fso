import { useEffect, useState } from "react";
import axios from "axios";
import Country from "./components/Country";

// TODO ex 2.20 - add weather data
function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [selectedCountry, setSelectedCountry] = useState(
    filteredCountries.length === 1 ? filteredCountries[0] : null
  );

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => setCountries(res.data));
  }, []);

  useEffect(() => {
    setSelectedCountry(null);
    setFilteredCountries(
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [countries, filter]);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setSelectedCountry(filteredCountries[0]);
    }
  }, [filteredCountries]);

  return (
    <>
      <div>
        find countries{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <div>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : selectedCountry ? (
          <Country country={selectedCountry} />
        ) : (
          filteredCountries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default App;
