package repository

import "hackatons2/backend/data"

type AccidentReportRepository interface {
    AddAccidentReport(report data.AccidentReport) error
    GetAllAccidentReport() []data.AccidentReport
}

type AccidentReportSummaryRepository interface {
    AddAccidentSummary(report data.AccidentSummary) error
    GetAllAccidentSummary() []data.AccidentSummary
}

type InMemoryAccidentReportRepository struct {
    Data []data.AccidentReport
}

type InMemoryAccidentSummaryRepository struct {
    Data []data.AccidentSummary
}

type PostgresAccidentReportRepository struct {
}

type PostgresAccidentSummaryRepository struct {
}

func (imr *InMemoryAccidentReportRepository) AddAccidentReport(report data.AccidentReport) error {
    report.Id = len(imr.Data)
    imr.Data = append(imr.Data, report)
    return nil
}

func (imr *InMemoryAccidentReportRepository) GetAllAccidentReport() []data.AccidentReport {
    return imr.Data
}

func (imr *InMemoryAccidentSummaryRepository) AddAccidentSummary(report data.AccidentSummary) error {
    report.Id = len(imr.Data)
    imr.Data = append(imr.Data, report)
    return nil
}

func (imr *InMemoryAccidentSummaryRepository) GetAllAccidentSummary() []data.AccidentSummary {
    return imr.Data
}
