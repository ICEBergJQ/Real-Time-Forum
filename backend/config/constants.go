package config

import (
	"database/sql"
	"time"
)

const EXPIRING_SESSION_DATE = 3 * time.Minute

const STATIC_DIR = "../frontend/public"

var DB *sql.DB
