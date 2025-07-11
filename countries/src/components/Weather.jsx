import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, longitude] = country.latlng;

  useEffect(() => {
    fetch(
      `${WEATHER_URL}?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  }, [latitude, longitude]);

  return (
    <div>
      {weatherData && (
        <>
          <h2>Weather in {country.name.common}</h2>
          <div>Temperature: {weatherData.main.temp} &#8457;</div>
          <div>Humidity: {weatherData.main.humidity}%</div>
          <div>Wind speed: {weatherData.wind.speed} mph</div>
          <figure>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />
            <figcaption>{weatherData.weather[0].main}</figcaption>
          </figure>
        </>
      )}
    </div>
  );
};

export default Weather;
