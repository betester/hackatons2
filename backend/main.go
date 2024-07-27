package main

import (
	"context"
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/repository"
	"hackatons2/backend/service"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-pg/pg/v10"
	"github.com/go-pg/pg/v10/orm"
	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

func init() {
	errEnv := godotenv.Load()

	if errEnv != nil {
		fmt.Println(errEnv)
	}
}

func main() {

	r := gin.Default()

	summaryDuration := time.NewTicker(1000 * time.Second)

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("OPEN_AI_API_KEY")))

	if err != nil {
		panic(err)
	}

	url := os.Getenv("URL")
	parsedUrl, err := pg.ParseURL(url)

	if err != nil {
		panic(err)
	}

	db := pg.Connect(parsedUrl)

	defer db.Close()

	err = createSchema(db)

	if err != nil {
		fmt.Println(err)
	}

	reportRepository := repository.PostgresAccidentReportRepository{DB: db}
	summaryRepository := repository.PostgresAccidentSummaryRepository{DB: db}

	accidentReportService := service.AccidentReportServiceImpl{
		AccidentReportRepository:  &reportRepository,
		AccidentSummaryRepository: &summaryRepository,
		Client:                    client,
		Context:                   ctx,
	}

	go func() {
		for {
			select {
			case <-summaryDuration.C:
				accidentReportService.CreateAccidentSummary()
			}
		}
	}()

	r.Use(CORSMiddleware())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.POST(fmt.Sprintf("/%s", service.REPORT_BASE_PATH), func(c *gin.Context) {
		var report data.AccidentReport
		if err := c.ShouldBindJSON(&report); err != nil {
			// If there's an error in binding, respond with a 400 status code
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		accidentReportService.AddAccidentReport(report)
		c.JSON(200, gin.H{
			"message": "Accident Reported",
		})
	})

	r.GET(fmt.Sprintf("/%s", service.REPORT_BASE_PATH), func(c *gin.Context) {
		reports := accidentReportService.GetAccidentReport()
		response := make(map[string][]data.AccidentReport)
		response["data"] = reports
		c.JSON(http.StatusOK, response)
	})

	r.GET(fmt.Sprintf("/%s", service.SUMMARY_BASE_PATH), func(ctx *gin.Context) {
		summary := accidentReportService.GetAccidentSummary()
		response := make(map[string][]data.AccidentSummary)
		response["data"] = summary
		ctx.JSON(http.StatusOK, response)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (default)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Methods, access-control-allow-headers")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func createSchema(db *pg.DB) error {
	models := []interface{}{
		(*data.AccidentSummary)(nil),
		(*data.AccidentReport)(nil),
	}
	for _, model := range models {
		err := db.Model(model).CreateTable(&orm.CreateTableOptions{
			IfNotExists: true,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
