## CrowdGuard : Application for Reporting Accident Geographically

### Description
CrowdGuard is a web application that essentially let's you as user to be able to know what kind of accidents happening on certain area.
This allows you to be able to navigate your way more secure and safe while also could provide some help to the people who are affected by the accident. 

### Project Structure
This project has two module which is frontend and backend respectively. If you wish to run the server that provides the logic for collecting the data you could refer
to the backend part and as for the UI you could refer to the frontend.

#### Running Backend

To run the backend, you need to make sure that you have go installed on your PC. On the root project, run the following commands

```
go mod tidy 
go run main.go
```

If you wish to get the executable instead, you could run `go build -o main .`

To see whether the server has running, you could check on `localhost:8080`.

#### Available API

There are two main API which is
- `/acccident_report` (POST, GET)
- `/accident_summary` (GET)

The report will help you to submit or get data related towards accident on certain location. To add new location you could run the following curl

```
curl --location 'http://localhost:8080/accident_report' \               
--header 'Content-Type: application/json' \
--data '{
    "description": "<string>",
    "location": {
        "longitude" : <number>,
        "latitude" : <number>
    },

    "accident_type": "<string>",
}'
```

