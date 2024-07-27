'use strict';
import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { DetailsBox } from './detailsbox';
import { useAtom } from 'jotai';
import { drawerOpenStateAtom, mobileSheetOpenStateAtom } from '@/atoms';

const Map = ({ positions }) => {
  const [markerClickedData, setMarkerClickedData] = useState(null);
  const [detailsboxOpen, setDetailsboxOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  const [mobileSheetOpen, setMobileSheetOpen] = useAtom(
    mobileSheetOpenStateAtom
  );
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    setDetailsboxOpen(false);
  }, [drawerOpen, mobileSheetOpen]);

  useEffect(() => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibmFiaWxhbGthaGFyIiwiYSI6ImNseDZhaGhjZjFlbTUybXE0ZG1vdTYxN3AifQ.kzhXjMakEI6ZcAPf4Kqmeg';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [106.865, -6.2088],
      zoom: 8,
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
    if (!positions || !mapRef.current) return;

    const addCircleRadius = (coordinates) => {
      try {
        const sourceId = `marker - ${coordinates[0]} - ${coordinates[1]}`;

        // draw a circle of 1km radius from the accident location
        mapRef.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates,
            },
          },
        });

        const severityColor = {
          1: 'yellow',
          2: 'orange',
          3: 'red',
        };

        mapRef.current.addLayer({
          id: sourceId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 15,
            'circle-color':
              severityColor[Math.floor(Math.random() * (3 - 1 + 1)) + 1],
            'circle-opacity': 0.5,
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    positions.forEach((el) => {
      const marker = new mapboxgl.Marker()
        ?.setLngLat([el.location.longitude, el.location.latitude])
        ?.addTo(mapRef.current);

      marker.getElement().addEventListener('click', () => {
        setMarkerClickedData(el);
        setDetailsboxOpen(true);
      });

      addCircleRadius([el.location.longitude, el.location.latitude]);
    });
  }, [positions]);

  return (
    <div className='mb-12'>
      <div
        id='map'
        ref={mapContainerRef}
        className='w-full h-[88vh] rounded-lg shadow-md'
      ></div>
      {detailsboxOpen && (
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
