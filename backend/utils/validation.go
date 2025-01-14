package utils

import (
    "errors"
    "net/mail"

	"forum/models"
)

func containsAll(s string) bool {
    hasUpper := false
    hasLower := false
    hasNumber := false
    hasSpecial := false

    for _, char := range s {
        if char >= 'A' && char <= 'Z' {
            hasUpper = true
        } else if char >= 'a' && char <= 'z' {
            hasLower = true
        } else if char >= '0' && char <= '9' {
            hasNumber = true
        } else if (char >= 33 && char <= 47) || (char >= 58 && char <= 64) || 
			(char >= 91 && char <= 96) || (char >= 123 && char <= 126) {
            hasSpecial = true
        }
    }

    return hasUpper && hasLower && hasNumber && hasSpecial
}

func Validation(user models.User) error {
    if _, err := mail.ParseAddress(user.Email); err != nil {
        return errors.New("invalid email address")
    }
    if len(user.Password) < 6 {
        return errors.New("password must be at least 6 characters long")
    }
    if !containsAll(user.Password) {
        return errors.New(`password must contain at least:
		one uppercase letter,
		one lowercase letter, 
		one number, 
		one printable ASCII special character`)
    }
    if user.Username == "" {
        return errors.New("username cannot be empty")
    }
    return nil
}
