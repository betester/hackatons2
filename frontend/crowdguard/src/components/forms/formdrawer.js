'use client';
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { useAtom } from 'jotai';
import { drawerOpenStateAtom } from '@/atoms';

const SubmitReport = ({}) => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  return (
    <Drawer
      tite='Submit a report'
      open={drawerOpen}
      onOpenChange={(open) => setDrawerOpen(open)}
    >
      <DrawerContent>
        <div className='p-4'>
          <form>
            <div className='flex flex-col space-y-4'>
              <input
                type='text'
                placeholder='Description'
                className='p-2 border border-gray-200 rounded-lg'
              />
              <input
                type='text'
                placeholder='Location'
                className='p-2 border border-gray-200 rounded-lg'
              />
              <input
                type='text'
                placeholder='Accident type'
                className='p-2 border border-gray-200 rounded-lg'
              />
              <input
                type='file'
                placeholder='Photo'
                className='p-2 border border-gray-200 rounded-lg'
              />
              <button
                type='submit'
                className='bg-blue-500 text-white p-2 rounded-lg'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { SubmitReport };
