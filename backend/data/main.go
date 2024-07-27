package data

import "time"

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
    Severity string `json:"severity"`
}
