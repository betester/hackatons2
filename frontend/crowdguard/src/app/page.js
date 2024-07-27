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
    <main className='flex h-[50vh] flex-col items-center justify-between p-8'>
      <div className='w-full h-full'>
        <Map positions={accidentData} />
      </div>
      <SubmitReport />
    </main>
  );
}
