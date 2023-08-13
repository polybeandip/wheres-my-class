import './App.css';
import { useState } from 'react';
import classes from './course-scraper';
import Map from './components/MapBox';
import SearchBar from './components/SearchBar';
import ClassDisplay from './components/ClassDisplay';

const colordict = 
  [
    "red",
    "green",
    "blue",
    "orange",
    "yellow",
    "purple",
    "violet",
    "indigo",
    "cyan",
    "pink"
  ]

/* const classes = [
  {
    code: 'CS 3110',
    title: 'Functional Programming',
    name: 'CS 3110: Functional Programming',
    desc: 'reee',
    locations: [{bldg: 'Uris Library', room: 'Uris 104', type:'LEC'}, {bldg: 'Uris Hall', room: 'Uris 105', type:'LEC'}],
  },
  {
    code: 'CS 3111',
    title: 'Not Func Programming and other shit homie',
    name: 'CS 3111: Not Func Programming',
    desc: 'REEEEEE',
    locations: [{bldg: 'Albert R Mann Library', room: 'Mann 105', type:'LEC'}],
  }
] */

export default function App() {
  const [selected, setSelected] = useState([]);

  return (
    <div id="App">
      <div id="container" className="grid-expanded">
        <div id="sidebar">
          <h1>How it works</h1>
          <p>
            What is going on here?
          </p>
          <ClassDisplay 
            selected={selected} 
            setSelected={setSelected}
            colordict={colordict} 
          />
        </div>
        <div>
        <div id="search">
          <SearchBar 
            classes={classes} 
            setSelected={setSelected} 
            selected={selected}
          />
        </div>
        <Map 
          selected={selected} 
          setSelected={setSelected}
          colordict={colordict} 
        />
        </div>
      </div>
    </div>
  )
}