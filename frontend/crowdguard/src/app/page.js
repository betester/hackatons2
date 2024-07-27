'use client';
import Map from '@/components/dashboard/map';
import { SubmitReport } from '@/components/forms/formdrawer';
import { useEffect, useState } from 'react';

export default function Home() {
  const [accidentData, setAccidentData] = useState([]);

  useEffect(() => {
    const fetchAccidentData = async () => {
      const res = await fetch('/mockedpositions.json');
      const data = await res.json();
      setAccidentData(data);
    };

    fetchAccidentData();
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-12 h-screen'>
      <div className='flex flex-col items-center justify-center mb-5 '>
        <h1 className='text-4xl font-bold text-center'>
          Welcome to CrowdGuard
        </h1>
        <p className='text-xl text-center'>
          A platform for crowd-sourced safety information
        </p>
        <div className='w-[90vw] pb-12'>
          <Map positions={accidentData} />
        </div>
        <SubmitReport />
      </div>
    </main>
  );
}
