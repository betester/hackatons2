package main

import (
	"context"
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/service"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
    errEnv := godotenv.Load()
    
    if errEnv != nil {
        fmt.Println(errEnv)
    }
}

func main() {
    r := gin.Default()
    summaryDuration := time.NewTicker(10 * time.Second)
    ctx := context.Background()

    go func() {
        for {
            select {
            case <-summaryDuration.C: 
                service.CreateAccidentSummary(&ctx)
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

    r.GET(fmt.Sprintf("%s/", service.SUMMARY_BASE_PATH), func(ctx *gin.Context) {
        summary := service.GetAccidentSummary()
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
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
