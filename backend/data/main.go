package data

type GeoLocation struct {
    Longitude float64 `json:"longitude"`
    Latitude float64  `json:"latitude"`
}

type AccidentReport struct {
    Id int `json:"id"`
    Description string `json:"description"`
    Location GeoLocation `json:"location"`
    AccidentType string `json:"accident_type"`
}
