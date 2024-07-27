// {
//     "description": "Bicycle accident at the park",
//     "location": {
//       "longitude": 106.8375,
//       "latitude": -6.2105
//     },
//     "accident_type": "Bicycle",
//     "photo": null
//   },

const { Card, CardDescription, CardTitle } = require('../ui/card');

const DetailsBox = ({ description, location, accident_type }) => {
  const getGmapsLink = (location) => {
    const { latitude, longitude } = location;
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  return (
    <div
      className='w-[300px] h-[150px]'
      style={{ position: 'absolute', bottom: 150, left: 120, zIndex: 1000 }}
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
              <a
                // goto advisory page
                className='text-blue-500 hover:underline'
              >
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
