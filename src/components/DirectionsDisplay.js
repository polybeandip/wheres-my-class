import './DirectionsDisplay.css';
import { pathsStore } from '../stores';
import { useState, useEffect, useReducer } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';


export default function DirectionsDisplay() {
  const [index, setIndex] = useState(0);
  const paths = pathsStore.getState();

  const forceUpdate = useReducer(x => x + 1, 0)[1];
  useEffect(() => {pathsStore.subscribe(() => {
    const paths = pathsStore.getState();
    setIndex(paths.length -1);
    if(paths.length != 1) {paths[index][2]();}
    forceUpdate();
  });}, []);

  if(paths.length === 0) return;

  function changeIndex(newdex) {
    paths[index][2](); //make current path invis
    paths[newdex][3](); //make new path vis
    setIndex(newdex);
  }

  function leftClick() {
    const newdex = index > 0 ? index - 1 : paths.length - 1;
    changeIndex(newdex);
  }

  function rightClick() {
    const newdex = index < paths.length - 1 ? index + 1 : 0;
    changeIndex(newdex);
  }

  const data = paths[index][1];
  const directions = data.steps.map((s,i) => <li key={i}>{s.maneuver.instruction}</li>);

  return (
    <div id="directions-container">
      <h1>
        {paths.length > 1 && <div id="left" onClick={leftClick}><AiOutlineLeft /></div>}
        Directions 
        {paths.length > 1 && <div id="right" onClick={rightClick}><AiOutlineRight /></div>}
      </h1>
      <div id="#fromto">{data.origin.code} to {data.destination.code}</div>
      <div>duration: {data.duration} seconds</div> 
      <div>distance: {paths[index][1].distance} meters</div>
      <ul>
        {directions}
      </ul>
    </div>
  );
}