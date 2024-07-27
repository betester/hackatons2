'use client';
import { useAtom } from 'jotai';
import { Button } from '../ui/button';
import { NavigationMenu, NavigationMenuList } from '../ui/navigation-menu';
import { drawerOpenStateAtom, mobileSheetOpenStateAtom } from '@/atoms';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useMediaQuery } from 'react-responsive';
import { usePathname } from 'next/navigation';

const Header = ({}) => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  const [mobileSheetOpen, setMobileSheetOpen] = useAtom(
    mobileSheetOpenStateAtom
  );

  const goToLink = (link) => {
    window.location.href;
  };
  const currentPath = usePathname();

  const props = {
    goToLink,
    setDrawerOpen,
    currentPath,
    setMobileSheetOpen,
    mobileSheetOpen,
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div className='flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-sans pl-10 pr-10'>
      {isMobile ? <MobileHeader {...props} /> : <DesktopHeader {...props} />}
    </div>
  );
};

const MobileHeader = ({
  goToLink,
  setMobileSheetOpen,
  setDrawerOpen,
  currentPath,
}) => {
  return (
    <div className='flex justify-start items-center h-16 bg-white text-black relative shadow-sm font-sans sm:pl-0 sm:pr-0 lg:pl-10 lg:pr-10 sm:ml-10'>
      <Sheet onOpenChange={(isOpen) => setMobileSheetOpen(isOpen)}>
        <SheetTrigger asChild>
          <Button variant='outline'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </Button>
        </SheetTrigger>

        <SheetContent>
          <div className='flex flex-col space-y-4 mt-10'>
            <Button
              variant='outline'
              onClick={() => goToLink('https://crowdguard.org/')}
            >
              <Link href='/'>Home</Link>
            </Button>
            <Button variant='outline'>
              <Link href='/advisory'>Advisory</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <h1 className='text-xl font-bold mr-5 ml-2'>CrowdGuard</h1>

      <Button
        variant='destructive'
        onClick={() => {
          if (currentPath !== '/') {
            window.location.href = '/';
          } else {
            setDrawerOpen(true);
          }
        }}
        className='ml-5'
      >
        <p className=' font-semibold'>Submit a report!</p>
      </Button>
    </div>
  );
};

const DesktopHeader = ({ goToLink, setDrawerOpen, currentPath }) => {
  return (
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
        <Button
          variant='destructive'
          onClick={() => {
            if (currentPath !== '/') {
              window.location.href = '/';
            } else {
              setDrawerOpen(true);
            }
          }}
        >
          <p className=' font-semibold'>Submit a report!</p>
        </Button>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Header;
