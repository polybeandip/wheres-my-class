import './SearchBar.css';
import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

function SearchResults({ results, setSelected, selected, setResults }) {
  function contains(lst, obj) {
    return lst.some(elem => {
      return (
        elem.name === obj.name &&
        elem.location === obj.location &&
        elem.room === obj.room
      );
    });
  } 

  function handleClick(r, showArrow) {
    if (!showArrow) {
      let c;
      if (r.class) {c = {...r.class, room: r.room}}
      else {c = {...r, room: r.locations[0].room}}
      c = {...c, location: r.locations[0].bldg, drawn_on_map: false};
      const key = c.name + ", " + c.location + ", " + c.room;
      c = {...c, key: key};
      if (selected.length > 7 || contains(selected,c)) return;
      setSelected(selected.concat(c));
      setResults([]);
    }
    else {
      const newResults = r.locations.map(l => {return {
        name: l.room + " (" + l.type + ")",
        locations: [l],
        room: l.room,
        class: r
      }});
      setResults(newResults);
    }
  }

  const lis = results.map((r) => {
    const showArrow = r.locations.length > 1;
    return (
      <li key={r.name} onClick={() => handleClick(r, showArrow)}>
        <div>{r.name}</div>
        {showArrow && <div><MdOutlineKeyboardArrowRight /></div>}
      </li>
    );
  });

  return (
    <div id="results-container">
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
      <div id="bar-container">
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
        setResults={setResults}
      />
    </div>
  );
}