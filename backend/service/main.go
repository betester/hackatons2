package service

import (
	"hackatons2/backend/data"
	"time"
)

var reportDatabase map[int]data.AccidentReport = make(map[int]data.AccidentReport) 
var currentAccidentReportId int = 0

const (
    REPORT_BASE_PATH string = "accident_report" 
    SUMMARY_BASE_PATH string = "accident_summary"
    MAX_RADIUS float64 = 1000
)

func AddAccidentReport(report data.AccidentReport) {

    report.Id = currentAccidentReportId
    report.CreatedTimeStamp = time.Now()
    currentAccidentReportId += 1
    reportDatabase[report.Id] = report;

    // TODO: when adding on this place emit the gabagoo to another function which will decide the severity
}

func GetAccidentReport() []data.AccidentReport {

    response := make([]data.AccidentReport, len(reportDatabase))
    locations := make([][2]float64, len(response))

    for i := range response {
        locations[i][0] = response[i].Location.Latitude
        locations[i][1] = response[i].Location.Longitude
    }
    
    // clusteredLocs := geo.Dbscan(locations, MAX_RADIUS)
    return response
}
