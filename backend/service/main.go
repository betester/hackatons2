package service

import(
    "hackatons2/backend/data"
)

var database map[int]data.AccidentReport = make(map[int]data.AccidentReport) 

const REPORT_BASE_PATH string = "accident_report" 

func AddAccidentReport(report data.AccidentReport) {
    database[report.Id] = report;
}

func GetAccidentReport() []data.AccidentReport {

    response := make([]data.AccidentReport, len(database))

    for _, value := range database {
        response = append(response, value)
    }

    return response
}
