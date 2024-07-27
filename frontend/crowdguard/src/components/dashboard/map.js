'use strict';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import { DetailsBox } from './detailsbox';
import { useAtom } from 'jotai';
import {
  coordinatesClickedAtom,
  drawerOpenStateAtom,
  mobileSheetOpenStateAtom,
} from '@/atoms';

const Map = ({ positions }) => {
  const [markerClickedData, setMarkerClickedData] = useState(null);
  const [detailsboxOpen, setDetailsboxOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  const [mobileSheetOpen, setMobileSheetOpen] = useAtom(
    mobileSheetOpenStateAtom
  );
  const [coordinatesClicked, setCoordinatesClicked] = useAtom(
    coordinatesClickedAtom
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
      center: [106.865, -6.2088], // Jakarta coords
      zoom: 8,
    });

    const locateUser = (map) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          map.flyTo({ center: userLocation, zoom: 10 });
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

    // Add zoom control
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on('load', () => {
      locateUser(mapRef.current);
    });

    // set clicked coordinates to atom
    mapRef.current.on('click', (e) => {
      setCoordinatesClicked(`${e.lngLat.lng},${e.lngLat.lat}`);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  // render markers on the map
  useEffect(() => {
    if (!positions || !mapRef.current) return;

    const addCircleRadius = (coordinates) => {
      try {
        const sourceId = `marker - ${coordinates[0]} - ${coordinates[1]}`;

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
              severityColor[
                positions.find((el) => el.location.longitude === coordinates[0])
                  ?.severity
              ],
            'circle-opacity': 0.5,
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    positions?.forEach((el) => {
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
        className='w-full h-[85vh] rounded-lg shadow-md'
      ></div>
      {detailsboxOpen && (
        <DetailsBox
          description={markerClickedData?.description}
          location
          accident_advice={markerClickedData?.accident_advice}
          accident_type={markerClickedData?.type}
          severity={markerClickedData?.severity}
          photo={markerClickedData?.photo}
        />
      )}
    </div>
  );
};

export default Map;
