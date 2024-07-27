package service_test

import (
	"context"
	"encoding/json"
	"fmt"
	"hackatons2/backend/data"
	"hackatons2/backend/service"
	"os"
	"testing"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

func TestCreateAccidentSummary(t *testing.T) {
    ctx := context.Background()

    errEnv := godotenv.Load("../.env")
    
    if errEnv != nil {
        t.Error(errEnv)
    }

    reportDatabase := make(map[int]data.AccidentReport)
    summaryDatabase := make(map[int]data.AccidentSummary)

    client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("OPEN_AI_API_KEY"))) 

    if err != nil {
        t.Error(err)
    }

    mockData := []data.AccidentReport{
        {
            Id:           1,
            Description:  "Collision between two cars",
            Location:     data.GeoLocation{Longitude: 106.78380188920285, Latitude: -6.294844667531178},
            AccidentType: "TRAFFIC_ACCIDENT",
            Photo:        "",
            CreatedTimeStamp: time.Now(),
        },
        {
            Id:           2,
            Description:  "Motorbike accident on a busy street",
            Location:     data.GeoLocation{Longitude: 106.78541121523564, Latitude: -6.293351688215008},
            AccidentType: "TRAFFIC_ACCIDENT",
            Photo:        "",
            CreatedTimeStamp: time.Now(),
        },
        {
            Id:           3,
            Description:  "Pedestrian hit by a car",
            Location:     data.GeoLocation{Longitude: 106.78541121533497, Latitude: -6.294738028299098},
            AccidentType: "TRAFFIC_ACCIDENT",
            Photo:        "",
            CreatedTimeStamp: time.Now(),
        },
        {
            Id:           4,
            Description:  "Car accident on a busy street",
            Location:     data.GeoLocation{Longitude: 106.78487477325781, Latitude: -6.294311461348428},
            AccidentType: "TRAFFIC_ACCIDENT",
            Photo:        "",
            CreatedTimeStamp: time.Now(),
        },
    }

    for i := range mockData {
        service.AddAccidentReport(&reportDatabase, mockData[i])
    }

    result := service.CreateAccidentSummary(client, &reportDatabase, &summaryDatabase, &ctx)
    savedResult := service.GetAccidentSummary(&summaryDatabase)

    if len(savedResult) != len(result) {
        fmt.Println("Saved result not the same from returned")
    }

    br, _ := json.Marshal(result)
    sr, _ := json.Marshal(savedResult)

    fmt.Printf("result : %s\n", string(br))
    fmt.Printf("saved result : %s\n", string(sr))
}
