import { createStore } from 'redux';

const initClicked = []

function clickedReducer(clicked = initClicked, action) {
  switch (action.type) {
    case 'setClicked':
      return action.payload;
    default:
      return clicked;
  }
}

const clickedStore = createStore(clickedReducer);

const initDivMap = {}

function divReducer(divMap = initDivMap, action) {
  switch (action.type) {
    case 'setDivMap':
      return action.payload;
    default:
      return divMap;
  }
}

const divStore = createStore(divReducer);

export { clickedStore, divStore }