# aws-assume-role-cicd

CLI for assuming an AWS role in a CI/CD pipeline

When using hosted CI/CD tools, such as bitbucket-pipelines or gitlab-ci, we need to source credentials from secure environment variables instead of the `~/.aws/credentials` file. This CLI is specifically designed for these CI/CD requirements. When performing a dev deployment from a developer's machine use [aws-get-session-token](https://github.com/DanteInc/aws-get-session-token) instead.

## Installation

`npm i aws-assume-role-cicd --save-dev`

## Usage

#### Pipeline YAML
```
export AWS_ACCESS_KEY_ID=$PROD_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$PROD_AWS_SECRET_ACCESS_KEY
export AWS_ROLE=$PROD_AWS_ROLE
npm run dp:prd:e
```

#### package.json
```
  "scripts": {
    "dp:prd:e": "eval \"$(assume-role) sls deploy -v -r us-east-1 -s prd --acct prod\""
  },
```

## Help

```
$ assume --help
```

