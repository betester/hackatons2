package service

import (
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/geo"
	"hackatons2/backend/gpt"
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
    
    return response
}

func GetAccidentSummary() []data.AccidentSummary  {
    response := GetAccidentReport()
    locations := make([][2]float64, len(response))

    for i := range response {
        locations[i][0] = response[i].Location.Latitude
        locations[i][1] = response[i].Location.Longitude
    }
    
    clusteredLocs := geo.Dbscan(locations, MAX_RADIUS)
    clusterSummary := make([]data.AccidentSummary, len(clusteredLocs))

    for i := range clusteredLocs {
        descriptions := make([]string, len(clusteredLocs[i]))
        clusterIds := clusteredLocs[i]

        for j := range clusterIds {
            descriptions[j] =  response[clusterIds[j]] .Description
        }

        result, err := gpt.SummarizeAccidentDescription(descriptions)

        if err != nil {
            fmt.Println(err)
        }

        clusterSummary[i] = result
    }

    return clusterSummary
}
