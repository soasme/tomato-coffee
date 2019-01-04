package main

import (
    "net/http"
    "github.com/labstack/echo"
    "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Record struct {
    gorm.Model
    id int
    content string
	startTime  int
    endTime int
    createTime int
    updateTime int
}

func getRecords(c echo.Context) error {
    //id := c.Param("id")
    return c.String(http.StatusOK, "OK")
}

func addRecord(c echo.Context) error {
    return c.String(http.StatusOK, "OK")
    //return c.JSON(http.StatusCreated, u)
}

func updateRecord(c echo.Context) error {
    return c.String(http.StatusOK, "OK")
}

func deleteRecord(c echo.Context) error {
    return c.String(http.StatusOK, "OK")
}

func main() {
    db, err := gorm.Open("sqlite3", "test.db")
    if err != nil {
        panic("failed to connect database")
    }
    defer db.Close()

    e := echo.New()

    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "Pomodoro Technique + Get Things Done + Gist = tomato.coffee")
    })

    e.GET("/health/ping", func(c echo.Context) error {
        return c.String(http.StatusOK, "OK")
    })

    // TODO: apply oauth2 authentication.

    e.GET("/records/:id", getRecords);
    e.POST("/records", addRecord);
    e.PUT("/records/:id", updateRecord);
    e.DELETE("/records/:id", deleteRecord);

    e.Logger.Fatal(e.Start(":1323"))
}
