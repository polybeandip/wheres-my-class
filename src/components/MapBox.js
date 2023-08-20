import './MapBox.css';
import { clickedStore, divStore, pathsStore }from '../stores';
import ReactDOM from 'react-dom/client';
import { useState, useRef, useEffect, useReducer } from 'react';
import { MdSchool } from 'react-icons/md';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import locationsDict from '../locations.json';

// fix for map not showing up after npm build
//@ts-ignore
//eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const theta = 
  [
    0, 
    Math.PI, 
    Math.PI / 2, 
    3 * (Math.PI / 2), 
    5 * (Math.PI / 4), 
    Math.PI / 4, 
    3 * (Math.PI / 4), 
    7 * (Math.PI / 4), 
    5 * (Math.PI / 3), 
    11 * (Math.PI / 6)
  ];

const r = 0.000025;

mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_TOKEN;

export default function MapBox({ selected, setSelected }) {
  //for the map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [clng, clat] = [-76.483448, 42.449052];
  const [lng, setLng] = useState(clng);
  const [lat, setLat] = useState(clat);
  const [zoom, setZoom] = useState(16);

  //other state
  const [coordCount, setCoordCount] = useState(new Map());

  function removeClicked() {
    clickedStore.dispatch({type: "setClicked", payload: []});
  }

  function handleMarkerClick(s, centerMarker) {
    const clicked = clickedStore.getState();
    if (!clicked.some(el => el[0].key === s.key)) {
      clickedStore.dispatch({
        type: "setClicked", 
        payload: clicked.concat([[s, centerMarker]])
      });
    }
    else {
      removeClicked();
    }
  }

  function drawPath() {
    const clicked = clickedStore.getState();
    if(clicked.length < 2) return;

    const start = clicked[0][1];
    const stop = clicked[1][1];
    const oclass = clicked[0][0];
    const dclass = clicked[1][0];
    const label = oclass.key + " to " + dclass.key;

    if (start.toString() === stop.toString() || map.current.getLayer(label)) {
      removeClicked();
      return;
    }

    let url = 
      "https://api.mapbox.com/directions/v5/mapbox/walking/" +
      start[0] + "," +start[1] + ";" +stop[0] + "," + stop[1] +
      "?geometries=geojson" + 
      "&overview=full" + 
      "&steps=true"+
      "&access_token=" + mapboxgl.accessToken;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        map.current.addSource(label, {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': res.routes[0].geometry
          }
        });

        map.current.addLayer({
          'id': label,
          'type': 'line',
          'source': label,
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#6464ff',
            'line-width': 8
          }
        });

        const data = {
          ...res.routes[0].legs[0],
          origin: oclass,
          destination: dclass
        };

        const invis = 
          () => map.current.setLayoutProperty(label, 'visibility', 'none');

        const vis = 
         () => {map.current.setLayoutProperty(label, 'visibility', 'visible');}
        
        const del = () => {
          map.current.removeLayer(label); 
          map.current.removeSource(label);
          const {paths} = pathsStore.getState()
          pathsStore.dispatch({
            type: "setPaths",
            payload: paths.filter(p => p[0] !== label)
          });
        }

        pathsStore.dispatch({
          type: "addPath",
          payload: [label, data, invis, vis, del]
        });
        removeClicked();
      });
  }

  async function effectFunc() {
    if (!map.current) { //init map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/polybeandip/cll8k7mvf00b101po9jsfdcyz",
        attributionControl: false,
        center: [lng, lat],
        zoom: zoom,
        pitch: 45,
        minZoom: 14.5,
        maxBounds: [
          [-76.49770, 42.436908], //southwest coord
          [-76.45095, 42.455924]  //northeast coord
        ]
      });
    
      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      }));

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(6));
        setLat(map.current.getCenter().lat.toFixed(6));
        setZoom(map.current.getZoom().toFixed(2));
      });
    }
    else {
      map.current.resize();
    }

    
    for (const s of selected) {
      if (s.drawn_on_map) continue;
      s.drawn_on_map = true;

      const name = (s.location + ", Cornell University").replace(' ', '%20');
      const sURL = 
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        name +
        ".json?proximity=" +
        clng + "," + clat +
        "&access_token=" +
        mapboxgl.accessToken;

      let centerMarker;
      if (locationsDict[s.location]) {centerMarker = locationsDict[s.location];}
      else {
        const response_obj = await fetch(sURL);
        const res = await response_obj.json();
        centerMarker = res.features[0].center;
      }
      let coords = centerMarker;
      const str = centerMarker.toString();
      let i = 0;
      if (coordCount.has(str)) {i = coordCount.get(str);}
      coords = [coords[0] + r * Math.sin(theta[i]), coords[1] + r * Math.cos(theta[i])];
      const newCoordCount = new Map(coordCount).set(str, i + 1);
      setCoordCount(newCoordCount);

      const el = document.createElement("div");
      const marker = new mapboxgl.Marker(el);

      function MarkerDiv() {
        const forceUpdate = useReducer(x => x + 1, 0)[1];
        const clicked = clickedStore.getState();

        function handleClick() {
          handleMarkerClick(s, centerMarker);
          drawPath();
        }

        function removeMarker() {
          const clicked = clickedStore.getState();
          marker.remove();
          setSelected(selected => selected.filter(e => e.key !== s.key));
          clickedStore.dispatch({
            type: "setClicked",
            payload: clicked.filter(e => e[0].key !== s.key)
          });
          const paths = pathsStore.getState().paths;
          let copy = paths;
          for (const p of paths) {
            if (p[0].includes(s.name)) {
              map.current.removeLayer(p[0]);
              map.current.removeSource(p[0]);
              copy = copy.filter(x => x[0] !== p[0]);
            }
          }
          pathsStore.dispatch({type: "setPaths", payload: copy});
        }

        useEffect(() => {
          clickedStore.subscribe(forceUpdate);
          const divMap = divStore.getState();
          divStore.dispatch({
            type: "setDivMap",
            payload: {...divMap, [s.key]: [handleClick, removeMarker]}
          });
        }, []);

        return (
          <div 
            className={
              clicked.some(el => el[0].key === s.key) ? "marker-clicked" : "marker"
            } 
            onClick={e => {e.stopPropagation(); handleClick();}}
            style={{color: s.color}}
          >
            <MdSchool />
          </div>
        );
      }
      const rootMarker = ReactDOM.createRoot(el)
      rootMarker.render(<MarkerDiv />);

      marker.setLngLat(coords).addTo(map.current);
      map.current.flyTo({
        center: centerMarker, 
        zoom: 17,
        duration: 5000,
        essential: true
      });
    }
  }

  useEffect(() => {effectFunc();});
 
  return <div ref={mapContainer} style={{height: "100%"}} onClick={removeClicked}/>;
}