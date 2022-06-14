/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { stationData } from './stationData';
import { stationInfo } from './stationInfo';
import { extraStationInfo } from './extraStationInfo';

const color = [
  '#00ffff',
  '#00bfff',
  '#009fff',
  '#0080ff',
  '#0060ff',
  '#0040ff',
  '#0020ff',
  '#0010d9',
  '#0000b3',
];

function getIconIndex(freq: number) {
  if (freq > 10000) return 8;
  else if (freq > 5000) return 7;
  else if (freq > 2000) return 6;
  else if (freq > 1000) return 5;
  else if (freq > 500) return 4;
  else if (freq > 200) return 3;
  else if (freq > 100) return 2;
  else if (freq > 50) return 1;
  else return 0;
}

// Adds a marker to the map.
function addMarker(
  location: google.maps.LatLngLiteral,
  icon: google.maps.Symbol,
  zIndex: number,
  map: google.maps.Map,
  infoWindow: google.maps.InfoWindow,
  infoString: string,
) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  const marker = new google.maps.Marker({
    position: location,
    icon: icon,
    zIndex: zIndex,
    map: map,
  });

  google.maps.event.addListener(marker, 'mouseover', function(e) {
    infoWindow.setPosition(e.latLng);
    infoWindow.setContent(infoString);
    infoWindow.open(map);
 });
 
 // Close the InfoWindow on mouseout:
 google.maps.event.addListener(marker, 'mouseout', function() {
    infoWindow.close();
 });
}

function initMap(): void {
  const center = { lat: 23, lng: 80 };
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 5.3,
      center: center,
    }
  );
  const infowindow = new google.maps.InfoWindow();

  // Add a marker at the center of the map.
  // addMarker(center, 'ANCHOR', map);
  stationData.forEach(({
    code,
    location,
    boardingFreq,
    departureFreq,
  }) => {
    const freq = boardingFreq + departureFreq;
    if (freq > 0) {
      const {name = '', cityName = '', stateName = '' } = stationInfo[code];
      const { asHalt, asNonHalt } = extraStationInfo[code] || {};
      const infoString = `<h3>${code}</h3>${name}<br>${cityName}, ${stateName}<br>Boading : ${boardingFreq}<br>Deboarding : ${departureFreq}<br>As Halting : ${asHalt}<br>As Non Haltiing : ${asNonHalt || 0}`;
      addMarker(
        location,
        {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          fillColor: color[getIconIndex(freq)],
          fillOpacity: 1.0,
          strokeWeight: 1,
        },
        getIconIndex(freq),
        map,
        infowindow,
        infoString,
      );
    }
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
