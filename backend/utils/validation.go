package utils

import (
	"errors"
	"regexp"

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

func printable(s string) bool {
	for _, char := range s {
		if char < 33 || char > 126 {
			return false
		}
	}
	return true
}

func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}

func Validation(user models.User, flag bool) error {
	if flag {
		if !isValidEmail(user.Email) {
			return errors.New("invalid email address")
		}
	}
	if user.Username == "" {
		return errors.New("username cannot be empty")
	}
	if len(user.Username) > 20 || len(user.Username) < 3 {
		return errors.New("username must be at most 20 characters long")
	}
	if !printable(user.Username) {
		return errors.New("username must be printable")
	}
	if user.Password == "" {
		return errors.New("password cannot be empty")
	}
	if len(user.Password) < 6 || len(user.Password) > 20 {
		return errors.New("password must be at least 6 or at most 20 characters long")
	}
	if !containsAll(user.Password) {
		return errors.New(`password must contain at least:
		one uppercase letter,
		one lowercase letter, 
		one number, 
		one printable ASCII special character`)
	}
	return nil
}
