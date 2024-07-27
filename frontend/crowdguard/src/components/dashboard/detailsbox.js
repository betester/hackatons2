import { useMediaQuery } from 'react-responsive';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { eventTypes, severityDetails } from '../forms/eventTypes';
import { Badge } from '../ui/badge';

const DetailsBox = ({
  description,
  location,
  accident_type,
  accident_advice,
  setDetailsboxOpen,
  severity,
}) => {
  const getGmapsLink = (location) => {
    const { latitude, longitude } = location;
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const desktopAbsolutePosition = {
    position: 'absolute',
    bottom: 'calc(10%)',
    right: 'calc(10%)',
    zIndex: 1000,
  };

  const mobileAbsolutePosition = {
    position: 'absolute',
    bottom: 'calc(50% - 300px)',
    left: 'calc(50% - 150px)',
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
        <CardTitle className='text-lg font-bold'>
          <div className='flex justify-between items-center'>
            {eventTypes.find((el) => el.key === accident_type).value}
            <div
              className='cursor-pointer font-normal text-sm text-gray-500'
              onClick={() => setDetailsboxOpen(false)}
            >
              X
            </div>
          </div>
        </CardTitle>
        <CardDescription className='text-sm'>
          <div className='flex flex-col'>
            <p>{description}</p>
            <p className='text-muted-foreground'>
              Severity:{' '}
              <span className='font-semibold'>
                {severity > 3
                  ? severityDetails[3].value
                  : severityDetails[severity].value}
              </span>
            </p>
            <a
              className='text-blue-500 hover:underline mb-2'
              href={getGmapsLink(location)}
              target='_blank'
            >
              View location on Google Maps
            </a>

            <p className='text-sm text-muted-foreground'>
              What to do? {accident_advice}
              <br />
            </p>
          </div>
        </CardDescription>
      </Card>
    </div>
  );
};

export { DetailsBox };
