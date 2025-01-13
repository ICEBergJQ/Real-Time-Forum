package utils

import (
	"fmt"
	"time"
)

func IsExpired(input string) error {
	expirationTime, err := time.Parse("2006-01-02 15:04:05", input)
	if err != nil {
		return err
	}
	if expirationTime.Before(time.Now()) {
		return nil
	}
	return fmt.Errorf("token expired")
}
