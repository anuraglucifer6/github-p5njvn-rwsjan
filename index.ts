/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { stationData } from './stationData';

const mapIcons: {
  color: string;
  opacity: number;
}[] = [
  { color: '#0F0', opacity: 0.4 },
  { color: '#0F0', opacity: 0.7 },
  { color: '#0F0', opacity: 1.0 },
  { color: '#00F', opacity: 0.4 },
  { color: '#00F', opacity: 0.7 },
  { color: '#00F', opacity: 1.0 },
  { color: '#F00', opacity: 0.4 },
  { color: '#F00', opacity: 0.7 },
  { color: '#F00', opacity: 1.0 },
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
  map: google.maps.Map
) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  new google.maps.Marker({
    position: location,
    icon: icon,
    zIndex: zIndex,
    map: map,
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

  // Add a marker at the center of the map.
  // addMarker(center, 'ANCHOR', map);
  stationData.forEach((station) => {
    const freq = station.boardingFreq + station.departureFreq;
    if (freq > 0) {
      addMarker(
        station.location,
        {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 5,
          fillColor: mapIcons[getIconIndex(freq)].color,
          fillOpacity: mapIcons[getIconIndex(freq)].opacity,
          strokeWeight: 1,
        },
        getIconIndex(freq),
        map
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
