import './SearchBar.css';
import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const colors = 
  [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "violet",
    "chocolate",
    "hotpink"
  ]

const letterToDay = {
  'M': 'Monday',
  'T': 'Tuesday',
  'W': 'Wednesday',
  'R': 'Thursday',
  'F': 'Friday',
  'S': 'Saturday',
  'Su': 'Sunday'
}

function SearchResults({ results, setSelected, selected, setResults }) {
  const maxClasses = 8;

  function contains(lst, obj) {
    return lst.some(elem => elem.key === obj.key);
  } 

  function findColor() {
    for (const c of colors) {
      if (!selected.some(x => x.color === c)) return c;
    }
  }

  function handleClick(r, showArrow) {
    if (!showArrow) {
      let c;
      if (r.class) {
        c = {
          ...r.class, 
          room: r.room, 
          code: r.class.code + " (" + r.type + ")", 
          dt: r.dt
        };
      }
      else {c = {...r, room: r.locations[0].room};}
      c = {...c, location: r.locations[0].bldg, drawn_on_map: false};
      const key = c.name + ", " + c.room + (c.dt ? ", " + c.dt : "");
      c = {...c, key: key};
      if (selected.length >= maxClasses || contains(selected,c)) return;
      c = {...c, color: findColor()};
      setSelected(selected.concat(c));
      setResults([]);
    }
    else {
      const newResults = r.locations.map(l => {
        const d = letterToDay[l.days] ? letterToDay[l.days] : l.days;
        return {
          name: l.typeLong + " on " + d + " at " + l.time + " (" + l.room + ")",
          dt: l.days + " " + l.time,
          type: l.type,
          locations: [l],
          room: l.room,
          class: r
        }
      });
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