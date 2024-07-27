package data

import "time"

var ACCIDENT_TYPE map[string]string = map[string]string{
    "CAR_ACCIDENT":         "Car Accident",
    "PLANE_CRASH":          "Plane Crash",
    "TRAIN_DERAILMENT":     "Train Derailment",
    "SHIPWRECK":            "Shipwreck",
    "BUILDING_COLLAPSE":    "Building Collapse",
    "FIRE":                 "Fire",
    "EXPLOSION":            "Explosion",
    "CHEMICAL_SPILL":       "Chemical Spill",
    "RADIATION_LEAK":       "Radiation Leak",
    "FOOD_POISONING":       "Food Poisoning",
    "INDUSTRIAL_ACCIDENT":  "Industrial Accident",
    "CONSTRUCTION_ACCIDENT": "Construction Accident",
    "MEDICAL_MALPRACTICE":  "Medical Malpractice",
    "NATURAL_GAS_LEAK":     "Natural Gas Leak",
    "POWER_OUTAGE":         "Power Outage",
    "CYBERATTACK":          "Cyberattack",
    "TERRORIST_ATTACK":     "Terrorist Attack",
    "RIOTS":                "Riots",
    "MASS_SHOOTING":        "Mass Shooting",
    "DROWNING":             "Drowning",
    "EARTHQUAKE":           "Earthquake",
    "HURRICANE":            "Hurricane",
    "TORNADO":              "Tornado",
    "FLOOD":                "Flood",
    "WILDFIRE":             "Wildfire",
    "TSUNAMI":              "Tsunami",
    "VOLCANIC_ERUPTION":    "Volcanic Eruption",
    "LANDSLIDE":            "Landslide",
    "DROUGHT":              "Drought",
    "AVALANCHE":            "Avalanche",
    "BLIZZARD":             "Blizzard",
    "HEATWAVE":             "Heatwave",
    "COLD_WAVE":            "Cold Wave",
    "TROPICAL_STORM":       "Tropical Storm",
    "STORM_SURGE":          "Storm Surge",
    "HAILSTORM":            "Hailstorm",
    "DUST_STORM":           "Dust Storm",
    "FOG":                  "Fog",
    "THUNDERSTORM":         "Thunderstorm",
    "SOLAR_FLARE":          "Solar Flare",
    "OTHER":                "other",
}

type GeoLocation struct {
    Longitude float64 `json:"longitude"`
    Latitude float64  `json:"latitude"`
}

type AccidentReport struct {
    Id int `json:"id"`
    Description string `json:"description"`
    Location GeoLocation `json:"location"`
    AccidentType string `json:"accident_type"`
    Photo string `json:"photo"`
    CreatedTimeStamp time.Time
}

type AccidentSummary struct {
    Id int `json:"id"`
    AccidentType string `json:"type"`
    Location GeoLocation `json:"location"`
    Severity int `json:"severity"`
    CreatedTimeStamp time.Time
}
