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
    name: 'CS 3110: Functional Programming',
    locations: ['Uris Library', "Uris Hall"],
    drawn_on_map: false
  },
  {
    name: 'CS 3110: Not Func Programming',
    locations: ['Amit Bhatia Libe Cafe'],
    draw_on_map: false
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
          <ClassDisplay selected={selected} colordict={colordict} />
        </div>
        <div>
        <div id="search">
          <SearchBar 
            classes={classes} 
            setSelected={setSelected} 
            selected={selected}
          />
        </div>
        <Map selected={selected}/>
        </div>
      </div>
    </div>
  )
}