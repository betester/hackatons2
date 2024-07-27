import { atom } from "jotai";

// drawer open state atom
const drawerOpenStateAtom = atom(false);

// Mobile sheet open state atom
const mobileSheetOpenStateAtom = atom(false);

export { drawerOpenStateAtom, mobileSheetOpenStateAtom };
