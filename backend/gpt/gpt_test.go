package gpt_test

import (
	"context"
	"fmt"
	"hackatons2/backend/gpt"
	"testing"

	"github.com/joho/godotenv"
)

func TestSummarizeAccidentDescription(t *testing.T) {

    errEnv := godotenv.Load("../.env")
    
    if errEnv != nil {
        fmt.Println(errEnv)
    }
    descriptions := [][2]string{
	{"HELP THERES A FIRE IN MY HOUSE PLASE SEND HELP", "FIRE"},
	{"There's a fire in my neighbour's house I think no one's at home", "FIRE"},
	{"Please help there are 3 poeople inside the house, the house is burning please send help to 51 Charming avenue", "FIRE"},
	{"THE FIRE HAS GONE TO THREE HOUSES SO FAR, IT NEEDS TO BE STOPPED", "FIRE"},
    }
    ctx := context.Background()
    result, err := gpt.SummarizeAccidentDescription(ctx, descriptions)

    if err != nil {
        t.Error(err)
    }

    fmt.Println(result)
}
