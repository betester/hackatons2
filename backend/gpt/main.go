package gpt

import (
	"context"
	"encoding/json"
	"fmt"
	"hackatons2/backend/data"
	"os"
	"github.com/joho/godotenv"
	"github.com/sashabaranov/go-openai"
)


func SummarizeAccidentDescription(descriptions []string) (data.AccidentSummary, error){


    err := godotenv.Load()
    client := openai.NewClient(os.Getenv("OPEN_AI_API_KEY"))

    prompt := fmt.Sprintf(`Based on the following input, return with the following format
        {
        "severity" : int,
        "type" : string,
        "accident_advice" : string
        }

        Input : list[string] where each input contains description of an accident. Start reading the input from 'Input:' and return based on the format. If you feel like the list of description is not accident then set the severity into -1

        Input: %s`, descriptions)

    resp, err := client.CreateChatCompletion(
        context.Background(),
        openai.ChatCompletionRequest{
            Model: openai.GPT4o,
            Messages: []openai.ChatCompletionMessage{
                {
                    Role:    openai.ChatMessageRoleUser,
                    Content: prompt,
                },
            },
        },
    )

    var summary data.AccidentSummary 

    if err != nil {
        return summary, err
    }

    response := resp.Choices[0].Message.Content

    marshalErr := json.Unmarshal([]byte(response), &summary)

    if marshalErr != nil {
        return summary, err
    }

    return summary, nil
}
