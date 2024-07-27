import { atom } from "jotai";

// drawer open state atom
const drawerOpenStateAtom = atom(false);

// submit useref atom
const submitRefAtom = atom(null);

export { drawerOpenStateAtom };
