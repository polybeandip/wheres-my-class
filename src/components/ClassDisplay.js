import './ClassDisplay.css'
import { divStore, clickedStore } from '../stores';
import { useReducer, useEffect } from 'react';
import { HiTrash } from 'react-icons/hi';

export default function ClassDisplay({ selected }) {
  const forceUpdate = useReducer(x => x + 1, 0)[1];
  useEffect(() => {clickedStore.subscribe(forceUpdate);}, []);

  const lis = selected.map(x => {
    const clicked = clickedStore.getState();
    function del(e) {
      divStore.getState()[x.key][1]();
      forceUpdate();
      e.stopPropagation();
    }

    function handleClick() {
      divStore.getState()[x.key][0]();
      forceUpdate();
    }
    
    return (
      <li 
        className={
          clicked.some(el => 
            el[0] === x.name && el[2] === x.location && el[3] === x.room) 
          ? "clicked" : ""
        } 
        key={x.key} 
        onClick={handleClick}
      >
        <div className="color" style={{backgroundColor: x.color}} />
        <div className="content">
          <p className="title"><b className="code">{x.code}</b> {" " + x.title}</p>
          <p className="loc">
            {x.room} 
            <span id="trash-icon" onClick={del}>
              <HiTrash />
            </span>
          </p>
        </div>
      </li>
    );
  });

  return (
  <div>
    <h1>Classes</h1>
    <ul id="class-display">
      {lis}
    </ul>
  </div>
  );
}