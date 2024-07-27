'use client';
import { atom, useAtom } from 'jotai';
import { Button } from '../ui/button';
import { NavigationMenu, NavigationMenuList } from '../ui/navigation-menu';
import { drawerOpenStateAtom } from '@/atoms';
import { Separator } from '../ui/separator';
import Link from 'next/link';

const Header = ({}) => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  const goToLink = (link) => {
    window.location.href;
  };

  return (
    <div className='flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-sans pl-10 pr-10'>
      <NavigationMenu>
        <h1 className='text-xl font-bold mr-10'>CrowdGuard</h1>
        <NavigationMenuList>
          <Button
            variant='outline'
            onClick={() => goToLink('https://crowdguard.org/')}
          >
            <Link href='/'>Home</Link>
          </Button>

          <Button variant='outline'>
            <Link href='/advisory'>Advisory</Link>
          </Button>
          <Button variant='destructive' onClick={() => setDrawerOpen(true)}>
            <p className=' font-semibold'>Submit a report!</p>
          </Button>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Header;