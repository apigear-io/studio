package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"

	"github.com/google/go-github/v47/github"
	"github.com/magefile/mage/sh"
)

var gh = github.NewClient(nil)

func Checkout(branch string) error {
	return sh.RunV("git", "checkout", branch)
}

func checksum(file string) (string, error) {
	hasher := sha256.New()
	f, err := os.Open(file)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := io.Copy(hasher, f); err != nil {
		return "", err
	}
	return hex.EncodeToString(hasher.Sum(nil)), nil
}

func Checksum(target string, file string) error {
	f, err := os.OpenFile(target, os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	hash, err := checksum(file)
	if err != nil {
		return err
	}
	fmt.Fprintf(f, "%s %s\n", hash, file)
	return nil
}

func CreateRelease(owner, repo, tag string) error {
	_, _, err := gh.Repositories.CreateRelease(context.Background(), owner, repo, &github.RepositoryRelease{
		TagName: &tag,
	})
	return err
}

// func DownloadArtifact(owner, repo, name, target string) {
// 	gh.Repositories.UploadReleaseAsset(context.Background(), owner, repo, nil)
// 	gh.Repositories.DownloadReleaseAsset(context.Background(), owner, repo, name, target)
// 	gh.DownloadArtifact(repo, name, target)
// }
