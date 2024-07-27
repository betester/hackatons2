package service

import (
	"context"
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/geo"
	"hackatons2/backend/gpt"
	"hackatons2/backend/repository"
	"time"

	"github.com/google/generative-ai-go/genai"
)


const (
    REPORT_BASE_PATH string = "accident_report" 
    SUMMARY_BASE_PATH string = "accident_summary"
    MAX_RADIUS float64 = 1000
)

type AccidentReportService interface {
    AddAccidentReport(report data.AccidentReport) error
    GetAccidentReport()
    CreateAccidentSummary()
    GetAccidentSummary()
}

type AccidentReportServiceImpl struct {
    AccidentReportRepository repository.AccidentReportRepository 
    AccidentSummaryRepository repository.AccidentReportSummaryRepository
    Client *genai.Client
    Context context.Context
    BiggestTime time.Time
}

func (ars *AccidentReportServiceImpl) AddAccidentReport(report data.AccidentReport) error {
    return ars.AccidentReportRepository.AddAccidentReport(report)
}

func (ars *AccidentReportServiceImpl) GetAccidentReport() []data.AccidentReport {
    return ars.AccidentReportRepository.GetAllAccidentReport()
}

func (ars *AccidentReportServiceImpl) CreateAccidentSummary() []data.AccidentSummary  {

    response := ars.GetAccidentReport()
    filteredResponse := make([]data.AccidentReport, 0)
    currentTime := time.Now()

    var tempBiggestTimeScan time.Time 

    // filter out response that the cluster already created 
    // could also use batching and run concurrently for better performance
    for i := range response {
        if response[i].CreatedTimeStamp.Before(ars.BiggestTime) {
            continue
        }

        if (response[i].CreatedTimeStamp.After(ars.BiggestTime)) {
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

        result, err := gpt.SummarizeAccidentDescription(ars.Client, &ars.Context, descriptions)

        if err != nil {
            fmt.Println(err)
        }

        if (result.Severity == -1)  {
            continue;
        }


        latitude, longitude := geo.GetCoordinateMiddlePoint(localLocations)

        result.Location.Latitude = latitude
        result.Location.Longitude = longitude
        result.CreatedTimeStamp = currentTime

        clusterSummary = append(clusterSummary, result)
        ars.AccidentSummaryRepository.AddAccidentSummary(result)
    }

    ars.BiggestTime = tempBiggestTimeScan
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

func (ars *AccidentReportServiceImpl) GetAccidentSummary() []data.AccidentSummary {

    allData := ars.AccidentSummaryRepository.GetAllAccidentSummary()
    results := make([]data.AccidentSummary, 0)
    currentTime := time.Now()

    for i := range allData {
        time := (allData)[i].CreatedTimeStamp.Add(time.Minute * time.Duration(getSeverityTime((allData)[i].Severity)))
        if currentTime.After(time) {
            continue
        }

        results = append(results, (allData)[i])
    }  

    return results
}
