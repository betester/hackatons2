package gpt

import (
	"context"
	"encoding/json"
	"fmt"
	"hackatons2/backend/data"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)


func SummarizeAccidentDescription(ctx *context.Context, descriptions [][2]string) (data.AccidentSummary, error){

    client, err := genai.NewClient(*ctx, option.WithAPIKey(os.Getenv("OPEN_AI_API_KEY")))

    var enumKeys []string

    for key := range data.ACCIDENT_TYPE {
        enumKeys = append(enumKeys, key)
    }

    benum, _ := json.Marshal(enumKeys)
    bdescriptions, _ := json.Marshal(descriptions)


    prompt := fmt.Sprintf(`
        BASED ON THE FOLLOWING INPUT

        Input: Each element contains description and type of an accident. Start reading the input from 'Input:' and return based on the format given. If you feel like the description and type of accident does not match then set the severity into -1. The description field is a one liner summary that you make of the accident given, it should be simple and informative so that user can see what is happening. You should only return the following types: %s

        INPUT IS

        input: %s

        FORMAT IS

        {
        "severity" : int,
        "type" : string,
        "accident_advice" : string,
        "description" : string
        }


        ONLY RETURN YOUR ANSWER IN JSON WITH THE FORMAT. YOUR ANSWER SHOULD BE ONLY ONE JSON, IT SHOULD BE THE SUMMARIZED AND ANALYZED DATA BASED ON THE INFORMATION GIVEN
        `, string(benum), string(bdescriptions))

    model := client.GenerativeModel("gemini-1.5-flash-latest")

    resp, err := model.GenerateContent(
        *ctx,
        genai.Text(prompt),
    )

    var summary data.AccidentSummary 

    if err != nil {
        return summary, err
    }

    var strResp string 

    if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
        if textContent, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
            jsonString := textContent[:len(textContent) - 4][7:]
            strResp = string(jsonString)
        } else {
            fmt.Println("The content is not of type genai.Text")
        }
    } else {
        fmt.Println("No content in the response")
    }

    fmt.Println(strResp)

    marshalErr := json.Unmarshal([]byte(strResp), &summary)

    if marshalErr != nil {
        return summary, err
    }

    return summary, nil
}
