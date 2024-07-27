'use client';
import { whatToDo } from '@/components/advisory/advisoryContent';
import { useMediaQuery } from 'react-responsive';

const AdvisoryDetailPage = ({ params }) => {
  const content = whatToDo.find((content) => content.key === params.type);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div className='p-4 flex flex-col space-x-4 justify-start md:flex-col lg:flex-row'>
      <div className='bg-white rounded-md p-4 flex flex-col space-y-4'>
        <h1 className='text-4xl font-bold mb-5'>
          Advisory content for <b>{params.type}</b>
        </h1>

        {content.howto.map((howto) => (
          <div key={howto.title}>
            <h2 className='text-3xl font-bold'>{howto.header}</h2>
            <p className='text-lg'>{howto.text}</p>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-md flex flex-col'>
        {content?.video && (
          <iframe
            width={isMobile ? '100%' : '620'}
            height={isMobile ? '315' : '315'}
            src={'https://www.youtube.com/embed/' + content.video}
            frameBorder='0'
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default AdvisoryDetailPage;
