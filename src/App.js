import './App.css';
import { useState } from 'react';
import classes from './classes.json';
import Map from './components/MapBox';
import SearchBar from './components/SearchBar';
import ClassDisplay from './components/ClassDisplay';
import DirectionsDisplay from './components/DirectionsDisplay';

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