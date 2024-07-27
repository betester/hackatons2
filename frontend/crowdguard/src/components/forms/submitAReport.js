'use client';
import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { useAtom } from 'jotai';
import { drawerOpenStateAtom } from '@/atoms';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  SelectContent,
  SelectTrigger,
  Select,
  SelectValue,
  SelectItem,
} from '../ui/select';
import { eventTypes } from './eventtypes';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';

const accidentReportSchema = z.object({
  description: z.string(),
  location: z.string(),
  accidentType: z.string(),
  photo: z.string(),
});

const SubmitReport = ({}) => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);
  const [location, setLocation] = useState([]);

  const form = useForm({
    resolver: zodResolver(accidentReportSchema),
    defaultValues: {
      description: '',
      location: '',
      accidentType: '',
      photo: '',
    },
  });

  const onSubmit = async (data) => {
    if (!data.description || !data.location || !data.accidentType) {
      toast.error('Please fill all fields');
      return;
    }

    const coords = {
      latitude: parseFloat(data.location.split(',')[1].trim()),
      longitude: parseFloat(data.location.split(',')[0].trim()),
    };

    try {
      const response = await fetch('http://localhost:8080/accident_report/', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          location: coords,
          accident_type: data.accidentType,
          description: data.description,
        }),
      });

      form.reset();

      setDrawerOpen(false);

      toast.success('Report submitted successfully');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while submitting the report');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = `${position.coords.longitude}, ${position.coords.latitude}`;
        form.setValue('location', location);
        setLocation(location);
      });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Drawer open={drawerOpen} onOpenChange={(open) => setDrawerOpen(open)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Submit a report</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col space-y-4'
            >
              <FormField
                control={form.control}
                name='description'
                render={({}) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder='There was an accident at the corner of Jl. Radio Dalam and Jl. Gandaria' />
                    </FormControl>
                    <FormDescription>
                      Describe the accident in a few words.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='location'
                render={({}) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className='flex space-x-4 items-center'>
                        <div className='flex space-x-2 items-center border p-2'>
                          <a
                            className='text-black hover:underline text-sm'
                            onClick={getLocation}
                          >
                            Get location
                          </a>
                        </div>
                        {location ? (
                          <p className='text-sm text-gray-500'>{location}</p>
                        ) : (
                          <Skeleton width={100} height={20} />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Press the button to relocate yourself.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='location'
                render={({}) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          form.setValue('accidentType', value)
                        }
                        defaultValue=''
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((item) => (
                            <SelectItem key={item.key} value={item.value}>
                              {item.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the type of accident.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' onClick={form.handleSubmit(onSubmit)}>
                Submit
              </Button>
              <Button variant='outline' onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <FormMessage />
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { SubmitReport };
