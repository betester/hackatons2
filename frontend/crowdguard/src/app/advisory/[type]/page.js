import { whatToDo } from '@/components/advisory/advisoryContent';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const AdvisoryDetailPage = ({ params }) => {
  const content = whatToDo.find((content) => content.key === params.type);
  console.log(content);

  return (
    <div className='p-4 flex flex-row space-x-4 justify-start'>
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

      <div className='bg-white rounded-md p-4 flex flex-col space-y-4'>
        <AspectRatio ratio='16:9'>
          {content?.video && (
            <iframe
              width={560}
              height={315}
              src={'https://www.youtube.com/embed/' + content.video}
              frameBorder='0'
              allowFullScreen
            />
          )}
          {/* <iframe width="420" height="315" src="https://www.youtube.com/embed/A6XUVjK9W4o" frameborder="0" allowfullscreen></iframe> */}
        </AspectRatio>
      </div>
    </div>
  );
};

export default AdvisoryDetailPage;
