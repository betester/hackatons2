import { useMediaQuery } from 'react-responsive';
import { Card, CardDescription, CardTitle } from '../ui/card';

const DetailsBox = ({ description, location, accident_type }) => {
  const getGmapsLink = (location) => {
    const { latitude, longitude } = location;
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const desktopAbsolutePosition = {
    position: 'absolute',
    bottom: 10,
    right: 120,
    zIndex: 1000,
  };

  const mobileAbsolutePosition = {
    position: 'absolute',
    bottom: 50,
    left: 65,
    zIndex: 1000,
  };

  return (
    <div
      className={
        isMobile
          ? 'w-[300px] h-[200px] transition-all'
          : 'w-[400px] h-[250px] transition-all'
      }
      style={isMobile ? mobileAbsolutePosition : desktopAbsolutePosition}
    >
      <Card className='p-4'>
        <CardTitle className='text-lg font-bold'>{accident_type}</CardTitle>
        <CardDescription className='text-sm'>
          <div className='flex flex-col'>
            <p>{description}</p>
            <a
              className='text-blue-500 hover:underline mb-2'
              href={getGmapsLink(location)}
              target='_blank'
            >
              View on Google Maps
            </a>

            <p className='text-sm text-muted-foreground'>
              {/* Use dynamic from DB TODO: */}
              What to do? Call 911 or the emergency number in your country.{' '}
              <br />
            </p>
          </div>
        </CardDescription>
      </Card>
    </div>
  );
};

export { DetailsBox };
