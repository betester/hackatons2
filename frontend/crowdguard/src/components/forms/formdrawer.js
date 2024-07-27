'use client';
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { useAtom } from 'jotai';
import { drawerOpenStateAtom } from '@/atoms';
import {
  Form,
  FormField,
  Label,
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

const accidentReportSchema = z.object({
  description: z.string(),
  location: z.string(),
  accidentType: z.string(),
  photo: z.string(),
});

const SubmitReport = ({}) => {
  const [drawerOpen, setDrawerOpen] = useAtom(drawerOpenStateAtom);

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
          photo: data.photo,
        }),
      });

      form.reset();

      setDrawerOpen(false);

      toast.success('Report submitted successfully');
    } catch (error) {
      console.error(error);
      // alert('An error occurred while submitting the report');
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = `${position.coords.longitude}, ${position.coords.latitude}`;
        form.setValue('location', location);
      });
    }
  };

  return (
    <Drawer
      tite='Submit a report'
      open={drawerOpen}
      onOpenChange={(open) => setDrawerOpen(open)}
    >
      <DrawerContent>
        <div className='p-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col space-y-4'
            >
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Bicycle accident at the park'
                        {...field}
                      />
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
                render={({ field }) => (
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
                        <p className='text-sm text-gray-500'>
                          {form.watch('location')}
                        </p>
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
                render={({ field }) => (
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
