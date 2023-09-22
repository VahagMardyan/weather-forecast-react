import { Fragment, useRef, useState } from 'react';
import { countries, toCapitalize } from './countries';
import { GrLocation } from 'react-icons/gr';
import './App.css';

const App = () => {

  let optCount = 1;

  const cityRef = useRef();
  const searchRef = useRef();
  const selectRef = useRef();
  const [forecastData, setForecastData] = useState([]);
  const [searchedCountries, setSearchedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tempUnit, setTempUnit] = useState(`°C`);

  const API_KEY = `413d0defb02ebb494ea5e39ceb810e6b`;

  const showForecastInC = () => {
    let API_Unit = 'metric';
    setTempUnit('°C');
    getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},
      ${selectRef.current.value}&units=${API_Unit}&appid=${API_KEY}`)
  }

  const showForecastInF = () => {
    let API_Unit = 'imperial';
    setTempUnit('°F');
    getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},
      ${selectRef.current.value}&units=${API_Unit}&appid=${API_KEY}`)
  }

  const showForecastInK = () => {
    let API_Unit = 'standart';
    setTempUnit('K');
    getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},
      ${selectRef.current.value}&units=${API_Unit}&appid=${API_KEY}`)
  }

  const getDatas = url => {
    setLoading(true);
    fetch(url)
      .then(response => response.json())
      .then(result => {
        setLoading(false);
        setForecastData(
          result.list.map((el, i) => {
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
                <p>Temperature:{Math.round(el.main.temp)}{tempUnit}</p>
                <p>Feels Like:{Math.round(el.main['feels_like'])}{tempUnit}</p>
                <p>Min Temp:{Math.round(el.main['temp_min'])}{tempUnit}</p>
                <p>Max Temp:{Math.round(el.main['temp_max'])}{tempUnit}</p>
                <hr style={{ width: '100%', border: '1px solid black' }} />
                <p className="wind-arrow" style={{ transform: `rotate(${el.wind.deg}deg)` }}>&uarr;</p>
              </div>
            )
          })
        )
      })
      .catch(() => {
        setLoading(false);
        setForecastData(
          <h1 style={{ color: 'red' }}>The city "{cityRef.current.value}" was not found 😥</h1>
        )
      })
  }

  // const showForecastInC = () => {
  //   let API_Unit = 'metric';
  //   setTempUnit('°C');
  //   getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},
  //     ${selectRef.current.value}&units=${API_Unit}&appid=${API_KEY}`)
  // }

  // const showForecastInF = () => {
  //   let API_Unit = 'imperial';
  //   setTempUnit('°F');
  //   getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},
  //     ${selectRef.current.value}&units=${API_Unit}&appid=${API_KEY}`)
  // }

  // const showForecastInK = () => {
  //   let API_Unit = 'standart';
  //   setTempUnit('K');
  //   getDatas(`https://api.openweathermap.org/data/2.5/forecast?q=${cityRef.current.value},
  //     ${selectRef.current.value}&units=${API_Unit}&appid=${API_KEY}`)
  // }

  const createCountryCodes = arr => {
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

  const keyPress = event => event.key === 'Enter' ? showForecastInC('°C') : null;

  return (
    <Fragment>
      <div className='info'>
        <input type='text' placeholder='City Name' id='cityName' ref={cityRef} onKeyUp={keyPress} />
        <input type='text' placeholder='Search Country' ref={searchRef} onKeyUp={keyPress}
          onChange={searchCountries}
        />
        <select id='countryCode' ref={selectRef} defaultValue=''>
          <option value='' disabled>Select Country Code (Optional)</option>
          {
            searchedCountries.length === 0 ? createCountryCodes(countries) : createCountryCodes(searchedCountries)
          }
        </select>
        <button id='showInCBtn' onClick={showForecastInC}>Show (&deg;C)</button>
        <button id='showInCBtn' onClick={showForecastInF}>Show (&deg;F)</button>
        <button id='showInKBtn' onClick={showForecastInK}>Show (K)</button>
        <button id='resetBtn' onClick={() => window.location.reload()}>Reset Page</button>
      </div>
      <section className='container'>
        {
          loading ? <h1>Please Wait...</h1> : <Fragment>{forecastData.length !== 0 ? forecastData : <h1>Weather Forecast</h1>}</Fragment>
        }
      </section>
    </Fragment>
  )
}

export default App;