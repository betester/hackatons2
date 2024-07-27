package repository

import (
	"fmt"
	"hackatons2/backend/data"

	"github.com/go-pg/pg/v10"
)

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
	DB *pg.DB
}

type PostgresAccidentSummaryRepository struct {
	DB *pg.DB
}

func (par *PostgresAccidentReportRepository) AddAccidentReport(report data.AccidentReport) error {
	_, err := par.DB.Model(report).Insert()
	return err
}

func (imr *InMemoryAccidentReportRepository) AddAccidentReport(report data.AccidentReport) error {
	report.Id = len(imr.Data)
	imr.Data = append(imr.Data, report)
	return nil
}

func (par *PostgresAccidentReportRepository) GetAllAccidentReport() []data.AccidentReport {
	var results []data.AccidentReport
	err := par.DB.Model(results).Select()

	fmt.Println(err)

	return results
}

func (imr *InMemoryAccidentReportRepository) GetAllAccidentReport() []data.AccidentReport {
	return imr.Data
}

func (pas *PostgresAccidentSummaryRepository) AddAccidentSummary(report data.AccidentSummary) error {
	_, err := pas.DB.Model(report).Insert()
	return err
}

func (imr *InMemoryAccidentSummaryRepository) AddAccidentSummary(report data.AccidentSummary) error {
	report.Id = len(imr.Data)
	imr.Data = append(imr.Data, report)
	return nil
}

func (pas *PostgresAccidentSummaryRepository) GetAllAccidentSummary() []data.AccidentSummary {
	var results []data.AccidentSummary
	err := pas.DB.Model(&results).Select()

	if err != nil {
		fmt.Println(err)
	}

	return results
}

func (imr *InMemoryAccidentSummaryRepository) GetAllAccidentSummary() []data.AccidentSummary {
	return imr.Data
}
