package service

import (
	"context"
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/geo"
	"hackatons2/backend/gpt"
	"time"

	"github.com/google/generative-ai-go/genai"
)


var currentAccidentReportId int = 0
var currentSummaryDatabaseId int = 0
var biggestTimeScan time.Time

const (
    REPORT_BASE_PATH string = "accident_report" 
    SUMMARY_BASE_PATH string = "accident_summary"
    MAX_RADIUS float64 = 1000
)

func AddAccidentReport(reportDatabase *map[int]data.AccidentReport, report data.AccidentReport) {

    report.Id = currentAccidentReportId
    report.CreatedTimeStamp = time.Now()
    (*reportDatabase)[report.Id] = report
    currentAccidentReportId += 1
}


func GetAccidentReport(reportDatabase *map[int]data.AccidentReport) []data.AccidentReport {

    response := make([]data.AccidentReport, 0)

    for _, value := range *reportDatabase {
        response = append(response, value)
    }

    return response
}

func CreateAccidentSummary(client *genai.Client, reportDatabase *map[int]data.AccidentReport,
                           summaryDatabase *map[int]data.AccidentSummary,
                            ctx *context.Context) []data.AccidentSummary  {
    response := GetAccidentReport(reportDatabase)
    filteredResponse := make([]data.AccidentReport, 0)
    currentTime := time.Now()

    var tempBiggestTimeScan time.Time 

    // filter out response that the cluster already created 
    // could also use batching and run concurrently for better performance
    for i := range response {
        if response[i].CreatedTimeStamp.Before(biggestTimeScan) {
            continue
        }

        if (response[i].CreatedTimeStamp.After(biggestTimeScan)) {
            tempBiggestTimeScan = response[i].CreatedTimeStamp
        }

        filteredResponse = append(filteredResponse, response[i])
    }

    locations := make([][2]float64, len(filteredResponse))

    for i := range filteredResponse {
        locations[i][0] = filteredResponse[i].Location.Latitude
        locations[i][1] = filteredResponse[i].Location.Longitude
    }
    
    clusteredLocs := geo.Dbscan(locations, MAX_RADIUS)
    clusterSummary := make([]data.AccidentSummary, 0)

    for i := range clusteredLocs {
        descriptions := make([][2]string, 0)
        localLocations := make([][2]float64, 0)
        clusterIds := clusteredLocs[i]

        for j := range clusterIds {
            descriptions = append(descriptions, [2]string{filteredResponse[clusterIds[j]].Description, filteredResponse[clusterIds[j]].AccidentType})
            localLocations = append(localLocations, [2]float64{filteredResponse[clusterIds[j]].Location.Latitude, filteredResponse[clusterIds[j]].Location.Longitude})

        }

        result, err := gpt.SummarizeAccidentDescription(client, ctx, descriptions)

        if err != nil {
            fmt.Println(err)
        }

        if (result.Severity == -1)  {
            continue;
        }


        latitude, longitude := geo.GetCoordinateMiddlePoint(localLocations)

        fmt.Println("latitude", "longitude")
        fmt.Println(latitude,longitude)

        result.Id = currentSummaryDatabaseId
        result.Location.Latitude = latitude
        result.Location.Longitude = longitude
        result.CreatedTimeStamp = currentTime

        clusterSummary = append(clusterSummary, result)
        (*summaryDatabase)[currentSummaryDatabaseId] = result
        currentSummaryDatabaseId += 1
    }

    biggestTimeScan = tempBiggestTimeScan
    return clusterSummary
}

func getSeverityTime(severity int) int {
    if severity >= 3 {
        return 90
    } else if severity == 2 {
        return 60
    } 

    return 30
}

func GetAccidentSummary(summaryDatabase *map[int]data.AccidentSummary) []data.AccidentSummary {

    results := make([]data.AccidentSummary, 0)
    currentTime := time.Now()

    for i := range *summaryDatabase {
        time := (*summaryDatabase)[i].CreatedTimeStamp.Add(time.Minute * time.Duration(getSeverityTime((*summaryDatabase)[i].Severity)))
        if currentTime.After(time) {
            continue
        }

        results = append(results, (*summaryDatabase)[i])
    }  

    return results
}
