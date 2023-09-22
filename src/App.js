import { Fragment, useRef, useState } from 'react';
import { countries, toCapitalize } from './countries';
import {GrLocation} from 'react-icons/gr';
import './App.css';

const App = () => {

  let optCount = 1;

  const cityRef = useRef();
  const searchRef = useRef();
  const selectRef = useRef();
  const [weatherData, setWeatherData] = useState([]);
  const [searchedCountries, setSearchedCountries] = useState([]);

  const API_KEY = `YOUR API KEY`;

  const getDatas = url => {
    fetch(url)
      .then(response => response.json())
      .then(result => {
        setWeatherData(
          result.list.map((el,i) => {
            return (
              <div key={i}>
                <h3>{el['dt_txt']}</h3>
                <h2>{result.city.name},{result.city.country}
                  <span>
                    <GrLocation />
                  </span>
                </h2>
                <h4>{el.weather[0].main}</h4>
                <img src={`https://openweathermap.org/img/wn/${el.weather[0].icon}.png`}
                  alt={`${el.weather[0]['description']}`} draggable='false' />
                <p>Temperature:{Math.round(el.main.temp)}&deg;C</p>
                <p>Feels Like:{Math.round(el.main['feels_like'])}&deg;C</p>
                <p>Min Temp:{Math.round(el.main['temp_min'])}&deg;C</p>
                <p>Max Temp:{Math.round(el.main['temp_max'])}&deg;C</p>
                <hr style={{ width: '100%', border: '1px solid black' }} />
                <p className="wind-arrow" style={{ transform: `rotate(${el.wind.deg}deg)` }}>&uarr;</p>
              </div>
            )
          })
        )
      })
  }

  const showInC = () => {
    getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},${selectRef.current.value}&units=metric&appid=${API_KEY}`)
  }

  const createCountryCodes = (arr) => {
    return arr.map(el => {
      optCount++;
      return (
        <option value={el.code} key={optCount}>
          {el.name}
        </option>
      )
    })
  }

  const searchCountries = () => {
    const searchTerm = toCapitalize(searchRef.current.value)
    const newCountries = countries.filter(country =>
      country.name.includes(searchTerm)
    );
    setSearchedCountries(newCountries);
  }

  const keyPress = event => event.key === 'Enter' ? showInC() : null;

  return (
    <Fragment>
      <div className='info'>
        <input type='text' placeholder='City Name' id='cityName' ref={cityRef} onKeyUp={keyPress} />
        <input type='text' placeholder='Search Country' ref={searchRef} onKeyUp={keyPress}
          onChange={searchCountries}
        />
        <select id='countryCode' ref={selectRef} defaultValue=''>
          <option value='' disabled>Select Country Code (Optional)</option>
          {searchedCountries.length === 0 ? createCountryCodes(countries) : createCountryCodes(searchedCountries)

          }
        </select>
        <button id='showInCBtn' onClick={showInC}>Show (&deg;C)</button>
        <button id='resetBtn' onClick={() => window.location.reload()}>Reset Page</button>
      </div>
      <section className='container'>
        {
          weatherData.length !== 0 ? weatherData :
            <h1>Weather Forecast</h1>
        }
      </section>
    </Fragment>
  )
}

export default App;