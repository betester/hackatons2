'use client';
import { atom, useAtom } from 'jotai';
import { Button } from '../ui/button';
import { NavigationMenu, NavigationMenuList } from '../ui/navigation-menu';
import { drawerOpenStateAtom } from '@/atoms';

const Header = ({}) => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  return (
    <div className='flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-sans pl-10 pr-10'>
      <NavigationMenu>
        <NavigationMenuList>
          <Button variant='outline'>Map</Button>
          <Button variant='outline'>About</Button>
          <Button variant='destructive' onClick={() => setDrawerOpen(true)}>
            <p className=' font-semibold'>Submit a report!</p>
          </Button>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Header;
