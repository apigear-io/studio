# ApiGear Studio

ApiGear Studio is a desktop application that helps you to create and manage your API projects. It is documented at [ApiGear](https://docs.apigear.io).

Studio focus on the user interface integration towards platform or external services. APIs are co-created by designers and developers. The API projects are created using [ObjectAPI](https://docs.apigear.io/docs/category/objectapi) and [technology templates](https://docs.apigear.io/docs/category/sdk-templates). The technology templates are used to generate SDKs for the API projects.

The workflow extends the API driven process with API monitoring and API simulation. This allows to create a complete API driven process with feedback loops.

## Features

- Create new API projects from templates using [ObjectAPI](https://docs.apigear.io/docs/category/objectapi)
- Install [technology templates](https://docs.apigear.io/docs/category/sdk-templates) from our Marketplace
- Generate SDKs for your API projects using solutions
- Run [API simulations](https://docs.apigear.io/docs/category/api-simulation) based on provided scenarios
- View [API monitoring](https://docs.apigear.io/docs/category/api-monitoring) results

## Development

We use Taskfile to manage the development tasks. You can install Taskfile from [here](https://taskfile.dev/#/installation).

To install the dependencies run:

```bash
task init
```

To run the development version of the application run:

```bash
task dev
```

To build the application run:

```bash
task build
```

Releases are automatically created by Github Actions. To create a new release create a new tag and push it to git main branch.

```bash
git tag -a v0.1.0 -m "Initial release"
git push origin v0.1.0
```

The releases are available at [Studio release page](https://github.com/apigear-io/studio-releases/releases).

## Install

ApiGear Studio is a desktop application that runs on Windows, Mac and Linux. You can download the latest version from [Studio release page](https://github.com/apigear-io/studio-releases/releases/latest).

The product has not yet a certification from Microsoft, Apple or Linux. So you may need to disable the security check to run the application.

## License

ApiGear Studio is licensed under the [MIT License](./LICENSE).
