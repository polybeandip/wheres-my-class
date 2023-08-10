import './App.css';
import { useState } from 'react';
//import classes from './course-scraper';
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

export default function App() {
  const [selected, setSelected] = useState([]);

  return (
    <div className="App">
      <div id="container" className="grid-expanded">
        <div className="sidebar">
          <h1>How it works</h1>
          <p>
            What is going on here?
          </p>
          <ClassDisplay selected={selected} colordict={colordict} />
        </div>
        <div>
        <div className="search">
          <SearchBar 
            classes={[{name: 'CS 3110: Functional Programming', location: "Uris Library", drawn_on_map: false}, {name: "CS 3111: Not Func Programming", location: "Amit Bhatia Libe Cafe", drawn_on_map: false}]} 
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