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
import { eventTypes } from './eventTypes';

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

  const onSubmit = (data) => {
    console.log(data);
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
                      <Input placeholder='106.8375, -6.2105' {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide the location of the accident.
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
              <FormField
                control={form.control}
                name='photo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input type='file' {...field} accept='image/*' />
                    </FormControl>
                    <FormDescription>
                      Provide a photo of the accident.
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
