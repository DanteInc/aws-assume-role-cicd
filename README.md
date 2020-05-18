# aws-assume-role

CLI for easy AWS role-assumption CI/CD pipeline.
Makes use of the `env` cli command which is available on nearly all standard shells.

## Installation

`npm i @valiton/aws-assume-role --save-dev`

## Usage in Script

The `env` command (standard in most shells) allows to run command with certain environment
variables.

The example use `aws s3 ls` but you can run any command that talks to the AWS API there.

### with explicit option
```sh
env $(assume-role --role arn:aws:iam::123456789:role/role-name) aws s3 ls
env $(assume-role --role arn:aws:iam::123456789:role/role-name) aws s3 ls
```

### with role passed via env variable
```sh
# with env variable
export AWS_ROLE="arn:aws:iam::123456789:role/role-name"
env $(assume-role) aws s3 ls
```

## Help

```
$ assume --help
```

