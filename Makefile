init-server:
	go get -u github.com/jinzhu/gorm
	go get -u github.com/labstack/echo
	go get -u github.com/mattn/go-sqlite3

run-server:
	go run api/server.go
