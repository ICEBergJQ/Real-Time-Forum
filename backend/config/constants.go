package config

import "database/sql"

const EXPIRING_SESSION_DATE = 120

const STATIC_DIR = "../frontend/public"

var DB *sql.DB
