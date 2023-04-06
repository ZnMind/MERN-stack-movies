import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState('2009');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(15);
  const [render, setRender] = useState(false);

  useEffect(() => {
    getMovies();
    setTimeout(() => setRender(true), 2000);
  }, []);

  const handleYear = event => {
    setYear(event.target.value);
  }

  const getMovies = () => {
    fetch(`https://mern-stack-movies.vercel.app/movies/${year}`)
      .then(res => res.json())
      .then(details => {
        setData(details);
        setMessage("Try a different year: Some years don't have movies!");
        setPage(1);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleAmount = e => {
    let currentPage = amount * page - amount + 1;
    let newPage = Math.floor((currentPage / e.target.value) + 1);
    setAmount(e.target.value)
    setPage(newPage);
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


      <div className='arrow-box'>
        <div className='select'>
          <label htmlFor='results'>Results per page: </label>
          <select onChange={handleAmount}>
            <option value={15} defaultValue={15}>15</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div className={`arrow ${page === 1 ? 'disabled' : 'arrow-left'}`} onClick={() => setPage(page - 1)}></div>
        <p style={{ marginLeft: '1em', marginRight: '1em' }}>{`${page * amount - amount + 1} - ${page * amount}`}</p>
        <div className={`arrow ${page === Math.ceil(data.length / amount) ? 'disabled' : 'arrow-right'}`} onClick={() => setPage(page + 1)}></div>
      </div>

      <div className='card-container'>
        {data.length === 0
          ? <p>{message}</p>
          : data.map((details, index) => (
            <div key={index} className='card'>
              <p>{index + 1}</p>
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
          )).slice(page * amount - amount, page * amount)}
      </div>

      {render ?
        <div className='arrow-box'>
        <div className='select'>
          <label htmlFor='results'>Results per page: </label>
          <select onChange={handleAmount}>
            <option value={15} defaultValue={15}>15</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div className={`arrow ${page === 1 ? 'disabled' : 'arrow-left'}`} onClick={() => setPage(page - 1)}></div>
        <p style={{ marginLeft: '1em', marginRight: '1em' }}>{`${page * amount - amount + 1} - ${page * amount}`}</p>
        <div className={`arrow ${page === Math.ceil(data.length / amount) ? 'disabled' : 'arrow-right'}`} onClick={() => setPage(page + 1)}></div>
      </div>
      : ""}

    </div>
  );
}

export default App;