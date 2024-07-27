package service

import (
	"hackatons2/backend/data"
	"hackatons2/backend/geo"
	"time"
)

var reportDatabase map[int]data.AccidentReport = make(map[int]data.AccidentReport) 
var summaryDatabase map[int]data.AccidentSummary = make(map[int]data.AccidentSummary) 

var currentAccidentReportId int = 0
var currentSummaryDatabaseId int = 0
var biggestTimeScan time.Time

const (
    REPORT_BASE_PATH string = "accident_report" 
    SUMMARY_BASE_PATH string = "accident_summary"
    MAX_RADIUS float64 = 1000
)

func AddAccidentReport(report data.AccidentReport) {

    report.Id = currentAccidentReportId
    report.CreatedTimeStamp = time.Now()
    reportDatabase[report.Id] = report
    currentAccidentReportId += 1
}


func GetAccidentReport() []data.AccidentReport {

    response := make([]data.AccidentReport, len(reportDatabase))

    for _, value := range reportDatabase {
        response = append(response, value)
    }

    return response
}

func CreateAccidentSummary() []data.AccidentSummary  {
    response := GetAccidentReport()
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
        descriptions := make([][2]string, len(clusteredLocs[i]))
        locations := make([][2]float64, len(clusteredLocs[i]))
        clusterIds := clusteredLocs[i]

        for j := range clusterIds {
            descriptions[j][0] =  filteredResponse[clusterIds[j]] .Description
            descriptions[j][1] =  filteredResponse[clusterIds[j]] .AccidentType

            locations[j][0] = filteredResponse[clusterIds[j]].Location.Latitude
            locations[j][1] = filteredResponse[clusterIds[j]].Location.Longitude
        }

        // result, err := gpt.SummarizeAccidentDescription(descriptions)
        //
        // if err != nil {
        //     fmt.Println(err)
        // }
        //
        // if (result.Severity == -1)  {
        //     continue;
        // }
        // 

        latitude, longitude := geo.GetCoordinateMiddlePoint(locations)

        result := data.AccidentSummary{
            AccidentType: "TEST",
            Location : data.GeoLocation{
                Latitude: latitude,
                Longitude: longitude,
            },
            Severity: 1,
            CreatedTimeStamp: currentTime,
        }

        result.CreatedTimeStamp = time.Now()

        clusterSummary = append(clusterSummary, result)
        summaryDatabase[currentSummaryDatabaseId] = result
        currentSummaryDatabaseId += 1
    }

    biggestTimeScan = tempBiggestTimeScan
    return clusterSummary
}

func getSeverityTime(severity int) int {
    if severity > 3 {
        return 90
    } else if severity == 2 {
        return 60
    } 

    return 30
}

func GetAccidentSummary() []data.AccidentSummary {

    results := make([]data.AccidentSummary, 0)
    currentTime := time.Now()

    for i := range summaryDatabase {
        time := summaryDatabase[i].CreatedTimeStamp.Add(time.Duration(getSeverityTime(summaryDatabase[i].Severity)))
        if currentTime.After(time) {
            continue
        }

        results = append(results, summaryDatabase[i])
    }  

    return results
}
