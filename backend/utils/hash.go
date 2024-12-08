package utils

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func Hash(password *string) error{
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		return err
	}
	*password = string(hashedPassword)
    return nil
}
