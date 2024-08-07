'use client';
import { AccidentCard } from '@/components/advisory/accidentCard';
import { advisoryCards } from '@/components/advisory/advisoryContent';

const AdvisoryPage = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4'>
      {advisoryCards.map((event) => (
        <AccidentCard
          title={event.title}
          description={event.description}
          link={event.link}
          key={event.title}
        />
      ))}
    </div>
  );
};

export default AdvisoryPage;
