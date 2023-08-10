import { createStore } from 'redux';

const initClicked = []

/*
function setClicked(c) {
  return {
    type: 'setClicked',
    payload: c
  };
}
*/

function reducer(clicked = initClicked, action) {
  switch (action.type) {
    case 'setClicked':
      return action.payload;
    default:
      return clicked;
  }
}

let store = createStore(reducer);

export default store