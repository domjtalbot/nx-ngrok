<!-- ![Nx Ngrok. Ngrok for Nx](https://github.com/domjtalbot/nx-ngrok/raw/main/.github/banner.jpg) -->

<h1 align="center">Nx Ngrok</h1>

<p align="center"><a href="https://ngrok.com/">Ngrok</a> support for <a href="http://nx.dev">Nx</a>.</p>

<div align="center">
  <p dir="auto">
    <a href="https://github.com/sponsors/domjtalbot">
      <img src="https://img.shields.io/badge/Sponsor @domjtalbot-30363D?style=flat&logo=GitHub-Sponsors&logoColor=#EA4AAA" alt="Sponsor @domjtalbot on GitHub!" />
    </a>
    <a href="https://www.npmjs.org/package/nx-ngrok">
      <img src="https://img.shields.io/npm/v/nx-ngrok?style=flat" alt="Nx Ngrok package on NPM" />
    </a>
    <a href="https://www.npmjs.org/package/nx-ngrok">
      <img src="https://img.shields.io/npm/dm/nx-ngrok" alt="Nx Ngrok package downloads on NPM" aria-hidden="true" />
    </a>
    <a href="https://sonarcloud.io/summary/new_code?id=domjtalbot_nx-ngrok">
      <img src="https://sonarcloud.io/api/project_badges/measure?project=domjtalbot_nx-ngrok&metric=alert_status" alt="SonarCloud Quality Gate Status" aria-hidden="true" />
    </a>
  </p>
</div>

## Contents

- [Features](#features)
- [Installing](#installing)
- [Getting Started](#getting-started)
  - [Supported Environment Variables](#supported-environment-variables)
- [Executors](#executors)
  - [`tunnel`](#tunnel)
- [Generators](#generators)
  - [`tunnel`](#tunnel-1)
- [Examples](#examples)
- [Compatibility](#compatibility)
- [Credits](#credits)

<br/>

## Features

- Use Ngrok to create a secure tunnel to your applications.
- Manually define the tunnel settings.
- Alternatively, let Ngrok wrap your existing targets to automatically read the server URL.
- Generate a new Ngrok tunnel target for your existing apps.

<br/>

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D nx-ngrok
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D nx-ngrok
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D nx-ngrok
```

</details>

<br/>

## Getting Started

Before you can serve HTML content, Ngrok requires you to [sign up for a free ngrok account](https://dashboard.ngrok.com/signup) to get an authtoken.

It is recommended to follow Ngrok's documentation and [install your authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).

Alternatively, you can set the authtoken via an Environment Variable or as an option in each executor.

> **Warning**
>
> Keep your authtoken private and safe. Do not commit it to git!

<br/>

### Supported Environment Variables

- `NGROK_AUTHTOKEN` - Specifies the authentication token ([authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)) used to connect to the ngrok service.

<br/>

## Executors

### `tunnel`

Start a new Ngrok tunnel.

```json
"targets": {
  "dev": {
    "executor": "nx-ngrok:tunnel",
    "options": {
      "serverTarget": "examples-nextjs:serve",
    },
  },
}
```

<details>
  <summary>tunnel executor options</summary>

| Name           | Type                                     | Required | Default | Description                                                                                              |
| -------------- | ---------------------------------------- | :------: | ------- | -------------------------------------------------------------------------------------------------------- |
| `serverTarget` | `string`                                 |    -     | -       | Server target to run tunnel for.                                                                         |
| `protocol`     | `http`, `tcp`, `tls`                     |    -     | `http`  | The tunnel protocol name. This defines the type of tunnel you would like to start.                       |
| `address`      | `string`, `number`                       |    -     | -       | Forward traffic to this local port number or network address.                                            |
| `auth`         | `string`                                 |    -     | -       | HTTP Basic authentication for tunnel.                                                                    |
| `subdomain`    | `string`                                 |    -     | -       | Subdomain name to request. If unspecified, ngrok provides a unique subdomain based on your account type. |
| `authToken`    | `string`                                 |    -     | -       | Specifies the authentication token (authtoken) used to connect to the ngrok service.                     |
| `region`       | `us`, `eu`, `au`, `ap`, `sa`, `jp`, `in` |    -     | `us`    | Choose the region where the ngrok agent will connect to host its tunnels.                                |
| `ngrokConfig`  | `string`                                 |    -     | -       | Custom path for ngrok config file.                                                                       |

</details>

<br/>

## Generators

### `tunnel`

Generate a target to run a Ngrok tunnel for a local server.

```bash
nx generate nx-grok:tunnel dev --project=my-app --serverTarget=serve
```

<details>
  <summary>tunnel generator output</summary>

```bash
>  NX  Generating nx-ngrok:tunnel

UPDATE apps/my-app/project.json
```

</details>

<details>
  <summary>tunnel generator options</summary>

| Name           | Alias | Type                                     | Required | Default | Description                                                                                              |
| -------------- | ----- | ---------------------------------------- | :------: | ------- | -------------------------------------------------------------------------------------------------------- |
| `name`         | -     | `string`                                 |    ✅    | -       | Target name.                                                                                             |
| `project`      | -     | `string`                                 |    ✅    | -       | What project does the target belong to?                                                                  |
| `serverTarget` | -     | `string`                                 |    -     | -       | Server target to run tunnel for.                                                                         |
| `protocol`     | -     | `http`, `tcp`, `tls`                     |    -     | `http`  | The tunnel protocol name. This defines the type of tunnel you would like to start.                       |
| `address`      | -     | `string`, `number`                       |    -     | -       | Forward traffic to this local port number or network address.                                            |
| `auth`         | -     | `string`                                 |    -     | -       | HTTP Basic authentication for tunnel.                                                                    |
| `subdomain`    | -     | `string`                                 |    -     | -       | Subdomain name to request. If unspecified, ngrok provides a unique subdomain based on your account type. |
| `region`       | -     | `us`, `eu`, `au`, `ap`, `sa`, `jp`, `in` |    -     | `us`    | Choose the region where the ngrok agent will connect to host its tunnels.                                |

</details>

<br/>

## Examples

| Name    | Path                                                                                          |
| ------- | --------------------------------------------------------------------------------------------- |
| nest    | [examples/nest](https://github.com/domjtalbot/nx-ngrok/tree/main/examples/nest)               |
| nextjs  | [examples/nextjs](https://github.com/domjtalbot/nx-ngrok/tree/main/examples/nextjs)           |
| nx-mesh | [examples/nx-mesh-app](https://github.com/domjtalbot/nx-ngrok/tree/main/examples/nx-mesh-app) |

<br/>

## Compatibility

| `nx-ngrok` | Nx        |
| ---------- | --------- |
| `^1.0.0`   | `^15.7.1` |

<br/>

## Credits

This plugin wouldn't be possible without the great teams behind these projects:

- [Ngrok](https://github.com/ngrok) - A simplified API-first ingress-as-a-service that adds connectivity,
  security, and observability to your apps in one line
- [Ngrok Node API](https://github.com/bubenshchykov/ngrok) - A Node wrapper for Ngrok's API.
- [Nrwl](https://github.com/nrwl) - The team behind [Nx](https://github.com/nrwl/nx)

Please show them your support! ❤️

<br/>
<br/>

<p align="center">🌳 🦌 🌳</p>

<br/>
