init-database:
	rm test.db
	sqlite3 test.db < sql.txt
