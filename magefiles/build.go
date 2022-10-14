package main

import (
	"os"

	"github.com/magefile/mage/sh"
)

func gitVersion() (string, error) {
	return sh.Output("git", "describe", "--tags", "--always", "--dirty")
}

func writeFile(filename, content string) error {
	return os.WriteFile(filename, []byte(content), 0644)
}
func Build() error {
	version, err := gitVersion()
	if err != nil {
		return err
	}
	return writeFile("version.txt", version)
}

func Test() error {
	return sh.RunV("go", "test", "./...")
}
