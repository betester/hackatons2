'use strict';
import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DetailsBox } from './detailsbox';
import { useAtom } from 'jotai';
import { drawerOpenStateAtom } from '@/atoms';

const Map = ({
  // props
  positions,
}) => {
  //   console.log(positions);
  const [markerClickedData, setMarkerClickedData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibmFiaWxhbGthaGFyIiwiYSI6ImNseDZhaGhjZjFlbTUybXE0ZG1vdTYxN3AifQ.kzhXjMakEI6ZcAPf4Kqmeg';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [106.865, -6.2088],
      zoom: 5,
    });

    const locateUser = (map) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          map.flyTo({ center: userLocation, zoom: 14 });
        });
      }
    };

    // Add geolocate control to the map.
    mapRef.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    mapRef.current.on('load', () => {
      locateUser(mapRef.current);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  //   render markers on the map
  useEffect(() => {
    // console.log(positions, "called!");
    if (!positions || !mapRef.current) return;

    positions.forEach((el) => {
      const marker = new mapboxgl.Marker()
        ?.setLngLat([el.location.longitude, el.location.latitude])
        ?.addTo(mapRef.current);

      marker.getElement().addEventListener('click', () => {
        setMarkerClickedData(el);
      });
    });
  }, [positions]);

  return (
    <div className='mb-12'>
      <div id='map' ref={mapContainerRef} style={{ height: '80vh' }}></div>

      {markerClickedData && !drawerOpen && (
        <DetailsBox
          description={markerClickedData?.description}
          location
          accident_type={markerClickedData?.accident_type}
          photo={markerClickedData?.photo}
        />
      )}
    </div>
  );
};

export default Map;
