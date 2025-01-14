package config

import (
	"database/sql"
	"time"
)

const EXPIRIATION_SESSION_DATE = 25 * time.Hour
const DELETE_COOKIE_DATE = -time.Hour * 24 * 365

const STATIC_DIR = "../frontend/public"

var DB *sql.DB
