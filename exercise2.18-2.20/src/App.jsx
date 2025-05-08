import { useState, useEffect } from 'react'
import axios from 'axios'


const App = () => {
  const api_key = import.meta.env.VITE_SOME_KEY
  const [value, setValue] = useState('')
  //const [countries, setCountries] = useState([])
  //const [country, setCountry] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
         console.log('fetching all countries...')
      axios
        .get('https://studies.cs.helsinki.fi/restcountries/api/all')
        .then(response => {
          setAllCountries(response.data)
          console.log('countries fetched', response.data)
        })
  },[])
  
  useEffect(() => {
    if (filteredCountries.length === 1) {
      const capitalName = filteredCountries[0].capital[0]
      console.log('fetching weather data for', capitalName)
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${api_key}`)
        .then(response => {
          setWeather(response.data)
          //console.log('weather data fetched', response.data)
        })
    }
  }
  , [filteredCountries])  

  const handleChange = (event) => {
   const c= allCountries.filter((c) => c.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
      setFilteredCountries(c)
      setValue(event.target.value)
   
  }
const onShow = (event) => {
  const countryName = event.target.parentNode.firstChild.data.trim()
  const country = allCountries.find((c) => c.name.common === countryName)
  setFilteredCountries([country])
  console.log(country)
 // console.log(filteredCountries)
}
 return (
    <div>
    <div>find countries <input value={value} onChange={handleChange}/></div>
        {filteredCountries.length === 0 ? <p>no matches</p> : null}
      {filteredCountries.length === 1 ? (
        <div>
          <h1>{filteredCountries[0].name.common}</h1>
          <p>capital {filteredCountries[0].capital}</p>
          <p>area {filteredCountries[0].area}</p>
          <h2>languages</h2>
          <ul>
             {Object.values(filteredCountries[0].languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} />
          <h2>Weather in {filteredCountries[0].capital[0]} </h2>
          {weather ? (
            <div>
              <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      ) : null}
        {(filteredCountries.length > 1 && filteredCountries.length <= 10) ? (filteredCountries.map(country => (<div key={country.name.common}>{country.name.common} <button onClick={onShow}>show</button></div>))):null}
        {(filteredCountries.length > 10) ? <p>Too many matches, specify another filter</p> : null}
    </div>
  )
}
export default App
