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

const initPathdex = {paths: [], index: 0, lastAction: ''}
function pathReducer(pathdex = initPathdex, action) {
  switch (action.type) {
    case 'addPath':
      return {
        ...pathdex, 
        paths: pathdex.paths.concat([action.payload]), 
        lastAction: 'addPath'
      };
    case 'setPaths':
      return {...pathdex, paths: action.payload, lastAction: 'setPaths'};
    case 'setIndex':
      return {...pathdex, index: action.payload, lastAction: 'setIndex'};
    default:
      return pathdex
  }
}
const pathsStore = createStore(pathReducer);

export { clickedStore, divStore, pathsStore }