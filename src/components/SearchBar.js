import './SearchBar.css';
import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';

function SearchResults({ results, setSelected, selected }) {
  function contains(lst, obj) {
    return lst.some(elem => { return obj.name === elem.name; });
  } 

  function handleClick(r) {
    if (selected.length > 9 || contains(selected,r)) return;
    setSelected(selected.concat(r));
  }

  const lis = results.map((r) => {
    return (
      <li key={r.name} onClick={() => handleClick(r)}>
        <div>{r.name}</div>
      </li>
    );
  });

  return (
    <div className="results-container">
      <ul>
        {lis}
      </ul>
    </div>
  );
}

export default function SearchBar({ classes, setSelected, selected }) {
  const [results, setResults] = useState([]);

  function handleChange(e) {
    const value = e.target.value.toLowerCase();
    const newResults = [] 
    let count = 100;
    if (value) {
      for (const c of classes) {
        if (c.name.toLowerCase().includes(value)) {newResults.push(c); count--;}
        if (count === 0) {break;}
      }
    }
    setResults(newResults);
  }

  return (
    <div>
      <div className="bar-container">
        <div id="spotlight">
          <FaSearchLocation />
        </div>
        <input 
          placeholder='"CS 3110", "Functional Programming", etc' 
          onChange={handleChange}
        />
      </div>
      <SearchResults 
        results={results} 
        setSelected={setSelected} 
        selected={selected}
      />
    </div>
  );
}