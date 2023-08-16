import './DirectionsDisplay.css';
import { pathsStore } from '../stores';
import { useEffect, useReducer } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { HiTrash } from 'react-icons/hi';


export default function DirectionsDisplay() {
  const {index, paths} = pathsStore.getState();

  const forceUpdate = useReducer(x => x + 1, 0)[1];
  useEffect(() => {pathsStore.subscribe(() => {
    forceUpdate();
    const {paths, index, lastAction} = pathsStore.getState();
    if (lastAction !== 'addPath') return;
    if (index !== paths.length - 1) {
      paths[index][2]();
      pathsStore.dispatch({type: 'setIndex', payload: paths.length - 1});
    } 
  });}, []);

  if(paths.length === 0) return;

  if (index > paths.length - 1) {
    pathsStore.dispatch({type: 'setIndex', payload: paths.length - 1});
    return;
  }

  function changeIndex(newdex) {
    const index = pathsStore.getState().index;
    paths[index][2](); //make current path invis
    paths[newdex][3](); //make new path vis
    pathsStore.dispatch({type: 'setIndex', payload: newdex});
  }

  function leftClick() {
    const newdex = index > 0 ? index - 1 : paths.length - 1;
    changeIndex(newdex);
  }

  function rightClick() {
    const newdex = index < paths.length - 1 ? index + 1 : 0;
    changeIndex(newdex);
  }

  function deleteClick() {
    //function for deleting current path
    const del = pathsStore.getState().paths[index][4]; 
    leftClick();
    del();
  }

  const data = paths[index][1];
  const directions = data.steps.map((s,i) => {
    const dist_in_feet = Math.round(s.distance * 3.28084);
    const dist_in_miles = Math.round(s.distance * 0.000621371 * 100) / 100;

    return (
      <li key={i}>
        <div className="direction">{s.maneuver.instruction}</div>
        {
          i < data.steps.length -1 && 
          //the constant converts meters to feet
          <fieldset>
            <legend>
              {
                dist_in_feet < 1056 ? 
                dist_in_feet + " feet" : 
                dist_in_miles + (dist_in_miles === 1 ? " mile" : " miles")
              }
            </legend>
          </fieldset>
        }
      </li>
    );
  });

  const dist_in_feet = Math.round(data.distance * 3.28084);
  const dist_in_miles = Math.round(data.distance * 0.000621371 * 100) / 100;

  return (
    <div id="directions-container">
      <h1>
        {paths.length > 1 && <div id="left" onClick={leftClick}><AiOutlineLeft /></div>}
        Directions 
        {paths.length > 1 && <div id="right" onClick={rightClick}><AiOutlineRight /></div>}
      </h1>
      {paths.length > 1 && <p id="eli5-arrows">Use the arrows to switch paths</p>}
      <div id="time">
        {
          data.duration < 60 ?
          Math.round(data.duration) + " sec" :
          Math.round(data.duration/60) + " min"
        } <span>({dist_in_feet < 1056 ? dist_in_feet + " feet" : dist_in_miles + (dist_in_miles === 1 ? " mile" : " miles")})</span>
      </div>
      <div id="from-to">
        <div>
          <span style={{color:data.origin.color}}> {data.origin.code} </span>
          to
          <span style={{color:data.destination.color}}> {data.destination.code} </span>
        </div>
        <div id="trash-icon" onClick={deleteClick}><HiTrash /></div>
      </div>
      <ul>
        {directions}
      </ul>
    </div>
  );
}