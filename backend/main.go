package main

import (
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

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

    r.Run() // listen and serve on 0.0.0.0:8080 (default)
}
