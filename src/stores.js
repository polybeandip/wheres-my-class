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

const initPaths = []

function pathReducer(paths = initPaths, action) {
  switch (action.type) {
    case 'setPaths':
      return action.payload;
    default:
      return paths
  }
}

const pathsStore = createStore(pathReducer);

export { clickedStore, divStore, pathsStore }