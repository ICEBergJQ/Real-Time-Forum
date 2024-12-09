package config

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func InitDB(dataSourceName string) *sql.DB {
	db, err := sql.Open("sqlite3", dataSourceName)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	return db
}

func CreateDatabaseTables(db *sql.DB, dbPath string) {
	schema, err := os.ReadFile(dbPath)
	if err != nil {
		log.Fatal("Failed to read the schema: ", err)
	}

	_, err = db.Exec(string(schema))
	if err != nil {
		log.Fatal("Failed to execute the schema: ", err)
	}

	// sqlBytes, err := os.ReadFile("../database/seed.sql")
	// if err != nil {
	// 	log.Fatalf("Failed to read seeds.sql: %v", err)
	// }

	// // Execute the SQL statements
	// _, err = db.Exec(string(sqlBytes))
	// if err != nil {
	// 	log.Fatalf("Failed to execute SQL commands: %v", err)
	// }

	// fmt.Println("Database seeded successfully!")
}
