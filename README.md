# ApiGear Studio
 
## Install

ApiGear Studio is a desktop application that runs on Windows, Mac and Linux. You can download the latest version from [here](https://github.com/apigear-io/studio-releases/releases/latest).

The product has not yet a certification from Microsoft, Apple or Linux. So you may need to disable the security check to run the application.

## Development


For development you need some environment variables:

```
export APIGEAR_GIT_PUBLIC_TOKEN=your_token
export APIGEAR_GIT_AUTH_TOKEN=your_token
```

The git public token provides access to public repositories. The git auth token provides access to private template repositories.

Now you need to have go 1.9.x installed and run:

```
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

This will install the wails cli. Now you can run the app with:

```
wails dev
```


To build an executable run:

```
wails build
```

## License

MIT
