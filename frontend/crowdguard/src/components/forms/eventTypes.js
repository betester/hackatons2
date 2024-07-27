const eventTypes = [
  { key: 'EARTHQUAKE', value: 'Earthquake' },
  { key: 'HURRICANE', value: 'Hurricane' },
  { key: 'TORNADO', value: 'Tornado' },
  { key: 'FLOOD', value: 'Flood' },
  { key: 'WILDFIRE', value: 'Wildfire' },
  { key: 'TSUNAMI', value: 'Tsunami' },
  { key: 'LANDSLIDE', value: 'Landslide' },
  { key: 'DROUGHT', value: 'Drought' },
  { key: 'AVALANCHE', value: 'Avalanche' },
  { key: 'BLIZZARD', value: 'Blizzard' },
  { key: 'TROPICAL_STORM', value: 'Tropical Storm' },
  { key: 'STORM_SURGE', value: 'Storm Surge' },
  { key: 'HAILSTORM', value: 'Hailstorm' },
  { key: 'DUST_STORM', value: 'Dust Storm' },
  { key: 'FOG', value: 'Fog' },
  { key: 'THUNDERSTORM', value: 'Thunderstorm' },
  { key: 'TRAFFIC_ACCIDENT', value: 'Traffic Accident' },
  { key: 'PLANE_CRASH', value: 'Plane Crash' },
  { key: 'TRAIN_DERAILMENT', value: 'Train Derailment' },
  { key: 'SHIPWRECK', value: 'Shipwreck' },
  { key: 'BUILDING_COLLAPSE', value: 'Building Collapse' },
  { key: 'FIRE', value: 'Fire' },
  { key: 'CHEMICAL_SPILL', value: 'Chemical Spill' },
  { key: 'INDUSTRIAL_ACCIDENT', value: 'Industrial Accident' },
  { key: 'CONSTRUCTION_ACCIDENT', value: 'Construction Accident' },
  { key: 'NATURAL_GAS_LEAK', value: 'Natural Gas Leak' },
  { key: 'POWER_OUTAGE', value: 'Power Outage' },
  { key: 'TERRORIST_ATTACK', value: 'Terrorist Attack' },
  { key: 'RIOTS', value: 'Riots' },
  { key: 'MASS_SHOOTING', value: 'Mass Shooting' },
  { key: 'OTHER', value: 'Other' },
];

const severityDetails = [
  {
    key: 0,
    value: 'Normal',
    color: 'gray',
  },
  {
    key: 1,
    value: 'Normal',
    color: 'yellow',
  },
  {
    key: 2,
    value: 'Devastating',
    color: 'orange',
  },
  {
    key: 3,
    value: 'Catastrophic',
    color: 'red',
  },
];

export { eventTypes, severityDetails };
