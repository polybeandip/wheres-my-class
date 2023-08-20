import './App.css';
import { useState } from 'react';
import classes from './classes.json';
import Map from './components/MapBox';
import SearchBar from './components/SearchBar';
import ClassDisplay from './components/ClassDisplay';
import DirectionsDisplay from './components/DirectionsDisplay';

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
    locations: [{bldg: 'Albert R Mann Library', room: 'Mann 105 Some more text just so that it goes on to the next', type:'LEC'}],
  }
] */

export default function App() {
  const [selected, setSelected] = useState([]);

  return (
    <div id="App">
      <div id="container">
        <div id="sidebar">
          <ClassDisplay 
            selected={selected} 
            setSelected={setSelected}
          />
          <DirectionsDisplay />
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
        />
        </div>
      </div>
    </div>
  )
}