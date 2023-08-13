import './ClassDisplay.css'
import { divStore, clickedStore } from '../stores';
import { useState, useEffect } from 'react';
import { HiTrash } from 'react-icons/hi';

export default function ClassDisplay({ selected, colordict }) {
  const clicked = clickedStore.getState();
  const forceUpdate = useState(false)[1]

  function handleDrop(e) {
    const key = e.dataTransfer.getData("delete");
    divStore.getState()[key][1]();
    forceUpdate(f => !f);
  }

  const lis = selected.map((x,i) => {
    function handleDrag(e) {
      e.dataTransfer.setData("delete", x.key);
      setTimeout(() => {e.target.style.visibility = "hidden";}, 0.5);
    }

    return (
      <li 
        className={
          clicked.some(el => 
            el[0] === x.name && el[2] === x.location && el[3] === x.room) 
          ? "clicked" : ""
        } 
        key={x.key} 
        draggable
        onClick={async () => {await divStore.getState()[x.key][0](); forceUpdate(f => !f);}}
        onDragStart={handleDrag}
        onDragEnd={(e) => setTimeout(() => {e.target.style.visibility = "";}, 1)}
      >
        <div className="color" style={{backgroundColor: colordict[i]}} />
        <div className="content">
          <p className="title"><b className="code">{x.code}</b> {" " + x.title}</p>
          <p className="loc">{x.room}</p>
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
    {
      selected.length > -1 &&
      <div id="trash" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <div id="trash-icon"><HiTrash /></div> Delete Class
      </div>
    }
  </div>
  );
}