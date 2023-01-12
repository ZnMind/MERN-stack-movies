import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState('2009');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMovies();
  }, []);

  const handleYear = event => {
    setYear(event.target.value);
  }

  const getMovies = () => {
    fetch(`https://mern-stack-movies.vercel.app/movies/${year}`)
      .then(res => res.json())
      .then(details => {
        setData(details);
        setMessage("Try a different year: Some years don't have movies!")
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="App">
      <h2>Movie List</h2>

      <p>Sample dataset supplied by MongoDB for award winning movies.</p>
      <p>Search below by year and top movies from that time period will be pulled from the database.</p>

      <div className='inputs'>
        <input onChange={handleYear} placeholder='Year (1893 - 2016)'></input>
        <button onClick={getMovies}>Search</button>
      </div>

      <h4>{year ? `Year: ${year} - Movies: ${data.length}` : ""}</h4>

      <div className='card-container'>
        {data.length === 0
          ? <p>{message}</p>
          : data.map((details, index) => (
            <div key={index} className='card'>

              <h4>{details.title}</h4>

              {/* All of these ternary operators are checking for undefined in each movie object */}
              <p>{
                details.released
                  ? `Date: ${details.released.split("-")[1]}/${details.released.split("-")[2].split("T")[0]}`
                  : ""
              }</p>

              {
                details.tomatoes
                  ? details.tomatoes.boxOffice
                    ? <p>{`Box Office: ${details.tomatoes.boxOffice}`}</p>
                    : ""
                  : ""
              }

              <p>{
                details.tomatoes
                  ? details.tomatoes.critic
                    ? `Ratings - IMDB: ${details.imdb.rating} / Tomatoes: ${details.tomatoes.critic.meter}`
                    : `Ratings - IMDB: ${details.imdb.rating}`
                  : `Ratings - IMDB: ${details.imdb.rating}`
              }</p>

              <p>{`Awards: ${details.awards.text}`}</p>

              <p>{
                details.cast
                  ? `Cast: ${details.cast.join(', ')}`
                  : ""
              }</p>

              <img src={details.poster} alt='* No movie poster *' className='poster'></img>
              
              {
                details.fullplot
                  ? <p className='card-bottom'>{details.fullplot}</p>
                  : <p>* Description not available *</p>
              }

            </div>
          ))}
      </div>

    </div>
  );
}

export default App;
