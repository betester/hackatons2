package main

import (
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/service"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "authorization, origin, content-type, accept")
		c.Header("Allow", "HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Content-Type", "application/json")

		if c.Request.Method == "OPTIONS" {
			print("masuk ke opstion")
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
    r := gin.Default()
    summaryDuration := time.NewTicker(10 * time.Second)

    go func() {
        for {
            select {
            case <-summaryDuration.C: 
                service.CreateAccidentSummary()
        }
        }
    }()

    r.Use(CORSMiddleware())

    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "pong",
        })
    })

    r.POST(fmt.Sprintf("%s/", service.REPORT_BASE_PATH), func(c *gin.Context) {
        var report data.AccidentReport
        if err := c.ShouldBindJSON(&report); err != nil {
            // If there's an error in binding, respond with a 400 status code
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        service.AddAccidentReport(report)
        c.JSON(200, gin.H{
            "message" : "Accident Reported",
        })
    })

    r.GET(fmt.Sprintf("%s/", service.REPORT_BASE_PATH), func(c *gin.Context) {
        reports := service.GetAccidentReport()
        response := make(map[string][]data.AccidentReport)
        response["data"] = reports
        c.JSON(http.StatusOK, response)
    })

    r.GET(fmt.Sprint("%s/", service.SUMMARY_BASE_PATH), func(ctx *gin.Context) {
        summary := service.GetAccidentSummary()
        response := make(map[string][]data.AccidentSummary)
        response["data"] = summary
        ctx.JSON(http.StatusOK, response)
    })

    r.Run() // listen and serve on 0.0.0.0:8080 (default)
}
