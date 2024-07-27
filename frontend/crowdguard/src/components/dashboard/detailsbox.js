import { useMediaQuery } from 'react-responsive';

const { Card, CardDescription, CardTitle } = require('../ui/card');

const DetailsBox = ({ description, location, accident_type }) => {
  const getGmapsLink = (location) => {
    const { latitude, longitude } = location;
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const desktopAbsolutePosition = {
    position: 'absolute',
    bottom: 150,
    left: 120,
    zIndex: 1000,
  };

  const mobileAbsolutePosition = {
    position: 'absolute',
    bottom: 150,
    left: 60,
    zIndex: 1000,
  };

  return (
    <div
      className='w-[300px] h-[150px] transition-all'
      style={isMobile ? mobileAbsolutePosition : desktopAbsolutePosition}
    >
      <Card className='p-4'>
        <CardTitle className='text-lg font-bold'>{accident_type}</CardTitle>
        <CardDescription className='text-sm'>
          <div className='flex flex-col space-y-2'>
            <p>{description}</p>
            <a
              className='text-blue-500 hover:underline'
              href={getGmapsLink(location)}
              target='_blank'
            >
              View on Google Maps
            </a>

            <p className='text-sm text-muted-foreground'>
              What to do? Call 911 or the emergency number in your country.{' '}
              <br />
              <a className='text-blue-500 hover:underline'>
                Click here for more information
              </a>
            </p>
          </div>
        </CardDescription>
      </Card>
    </div>
  );
};

export { DetailsBox };
