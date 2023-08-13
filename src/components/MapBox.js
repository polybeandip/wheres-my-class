import './MapBox.css';
import ReactDOM from 'react-dom/client';
import { useState, useRef, useEffect } from 'react';
import { MdSchool } from 'react-icons/md';
import { clickedStore, divStore }from '../stores';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

export default function MapBox({ selected, setSelected, colordict }) {
  //for the map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [clng, clat] = [-76.483448, 42.449052];
  const [lng, setLng] = useState(clng);
  const [lat, setLat] = useState(clat);
  const [zoom, setZoom] = useState(16);

  //other state
  const [coordCount, setCoordCount] = useState(new Map());

  function handleMarkerClick(s, centerMarker) {
    const clicked = clickedStore.getState();
    if (!clicked.some(el => el[0] === s.name && el[2] === s.location)) {
      clickedStore.dispatch({
        type: "setClicked", 
        payload: clicked.concat([[s.name, centerMarker, s.location, s.room]])
      });
    }
  }

  async function drawPath() {
    const clicked = clickedStore.getState();

    if(clicked.length < 2) return;

    const start = clicked[0][1];
    const stop = clicked[1][1];
    let url = 
      "https://api.mapbox.com/directions/v5/mapbox/walking/" +
      start[0] + "," +start[1] + ";" +stop[0] + "," + stop[1] +
      "?geometries=geojson" + 
      "&overview=full" + 
      "&access_token=" + mapboxgl.accessToken;

    const resp = await fetch(url);
    const res = await resp.json();

    const label = clicked[0][0] + " to " + clicked[1][0];
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

    clickedStore.dispatch({type: "setClicked", payload: []});
  }

  useEffect(() => {
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
          [-76.48770, 42.436908], //southwest coord
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

    
    for (const [index,s] of selected.entries()) {
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

      fetch(sURL)
        .then(res => res.json())
        .then(res => {
          const centerMarker = res.features[0].center;
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
            const forceUpdate = useState(true)[1];
            const clicked = clickedStore.getState();

            async function handleClick() {
              handleMarkerClick(s, centerMarker);
              await drawPath();
            }

            function removeMarker() {
              marker.remove();
              setSelected(selected.filter(e => e != s));
              clickedStore.dispatch({
                type: "setClicked",
                payload: clicked.filter(e => e[0] != s.name || e[2] != s.location || e[3] != s.room)
              });
            }

            useEffect(() => {
              clickedStore.subscribe(() => forceUpdate(f => !f));
              const divMap = divStore.getState();
              console.log(divMap);
              divStore.dispatch({
                type: "setDivMap",
                payload: {...divMap, [s.key]: [handleClick, removeMarker]}
              });
            }, []);

            return (
              <div 
                className={
                  clicked.some(el => 
                    el[0] === s.name && el[2] === s.location && el[3] === s.room) 
                  ? "marker-clicked" : "marker"
                } 
                onClick={async () => await handleClick()}
                style={{color: colordict[index]}}
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
        });
      }
  });
 
  return <div ref={mapContainer} style={{height: "100%"}} />;
}