package utils

import (

	"golang.org/x/crypto/bcrypt"
)

func Hash(password *string) error{
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	*password = string(hashedPassword)
    return nil
}
