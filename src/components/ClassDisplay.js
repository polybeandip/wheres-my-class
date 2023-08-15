import './ClassDisplay.css'
import { divStore, clickedStore, pathsStore } from '../stores';
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
          clicked.some(el => el[0].key === x.key) ? "clicked" : ""
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
    {selected.length > 0 ? <h1>Classes</h1> : <h1>Look up a class</h1>}
    <div id="eli5">
      {
        selected.length > 0 ?
        <>
          <p>Search for a class</p>
          <p> 
            OR select two class icons (on the map or sidebar) to show the walking route between them
          </p>
        </>
        :
        <p>Use the search bar to look for a class.</p>
      }
    </div>
    <ul id="class-display">
      {lis}
      {pathsStore.getState().paths.length > 0 && <hr id="line"/> }
    </ul>
  </div>
  );
}