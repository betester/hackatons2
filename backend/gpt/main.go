package gpt

import (
	"context"
	"encoding/json"
	"fmt"
	"hackatons2/backend/data"
	"os"
	"github.com/sashabaranov/go-openai"
)


func SummarizeAccidentDescription(descriptions [][2]string) (data.AccidentSummary, error){

    client := openai.NewClient(os.Getenv("OPEN_AI_API_KEY"))

    // this will make things slow but fuck it
    var enumKeys []string
    for key := range data.ACCIDENT_TYPE {
        enumKeys = append(enumKeys, key)
    }

    prompt := fmt.Sprintf(`Based on the following input, return with the following format
        {
        "severity" : int,
        "type" : string,
        "accident_advice" : string
        }

        Input : list[string][2] where each element contains description and type of an accident. Start reading the input from 'Input:' and return based on the format. If you feel like the list of description is not accident then set the severity into -1. You should only return the following types : %s if no type match then just put OTHER.

        Input: %s`, descriptions, enumKeys)

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
