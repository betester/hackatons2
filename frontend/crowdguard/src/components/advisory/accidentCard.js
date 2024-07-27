import { Button } from '../ui/button';

const { Card, CardTitle, CardDescription } = require('../ui/card');

// This component renders cards that acts as a button to specific advisory page
const AccidentCard = ({ title, description }) => {
  return (
    <Card className='w-[400px] h-[200px] p-4 bg-white shadow-md rounded-md flex justify-center items-start flex-col'>
      <CardTitle className='mb-3'>
        <h1>{title}</h1>
      </CardTitle>
      <CardDescription>
        <div className='flex flex-col space-y-2'>
          <p>{description}</p>
          <a className='text-blue-500 hover:underline' target='_blank'>
            Read more
          </a>
        </div>
      </CardDescription>
    </Card>
  );
};

export { AccidentCard };
