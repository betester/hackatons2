import { atom } from 'jotai';

// drawer open state atom
const drawerOpenStateAtom = atom(false);

// Mobile sheet open state atom
const mobileSheetOpenStateAtom = atom(false);

// debugging purpose
const coordinatesClickedAtom = atom({
  latitude: 0,
  longitude: 0,
});
export { drawerOpenStateAtom, mobileSheetOpenStateAtom, coordinatesClickedAtom };
