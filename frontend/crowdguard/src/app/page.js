'use client';
import Map from '@/components/dashboard/map';
import { SubmitReport } from '@/components/forms/submitAReport';
import { useEffect, useState } from 'react';

export default function Home() {
  const [accidentData, setAccidentData] = useState([]);

  const fetchAccidentData = async () => {
    const res = await fetch(
      'https://test-7jsry5mvrq-as.a.run.app/accident_summary'
    );

    const data = await res.json();

    // filter out data with no location or similar location
    const filteredData = data.data.filter(
      (el, index, self) =>
        el.location !== null &&
        index === self.findIndex((t) => t.location === el.location)
    );

    // make sure all data has actual value for all fields, not empty or ""
    const filteredDataClean = filteredData.filter(
      (el) =>
        el.location !== '' &&
        el.location !== null &&
        el.type !== '' &&
        el.type !== null &&
        el.description !== '' &&
        el.description !== null &&
        el.accident_advice !== '' &&
        el.accident_advice !== null
    );

    setAccidentData(filteredDataClean);
    console.log(filteredDataClean);
  };

  useEffect(() => {
    fetchAccidentData();

    const interval = setInterval(() => {
      fetchAccidentData();
      console.log('fetching data');
    }, 3000);

    return () => clearInterval(interval);
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
