#!/usr/bin/env node

const {
  STSClient,
  AssumeRoleCommand,
} = require('@aws-sdk/client-sts');
const {
  fromTemporaryCredentials,
  fromNodeProviderChain,
} = require('@aws-sdk/credential-providers');

const { program } = require('commander');
program
  .option('-r --role [arn]',
    'Role(s) ARN to assume (env AWS_ROLE default)',
    process.env.AWS_ROLE)
  .option('--region [region]',
    'Region to contact (env AWS_REGION default)',
    process.env.AWS_REGION)
  .option('-d --duration [seconds]',
    'Session length (30 minute default)',
    Number,
    process.env.AWS_SESSION_DURATION || 1800)
  .option('-b --debug', 'Enable logging', process.env.DEBUG)
  .parse(process.argv);

program.parse();

const run = (argv) => {
  let { role, region, duration, credentials } = argv;
  if (process.env.DEBUG === 'true') console.log('args: ', JSON.stringify(argv, null, 2));
  if (!role) return Promise.resolve();

  const logger = process.env.DEBUG === 'true' ? console : undefined;
  const clientConfig = { logger, region };

  const roles = role.split('|');
  if (roles.length > 1) {
    credentials = fromTemporaryCredentials({
      params: {
        RoleArn: roles[0],
        RoleSessionName: 'aws-assume-role-cicd',
        DurationSeconds: duration,
      },
      clientConfig,
      masterCredentials: fromNodeProviderChain({ clientConfig }),
    });
    role = roles[1];
  }

  const params = {
    RoleArn: role,
    RoleSessionName: 'aws-assume-role-cicd',
    DurationSeconds: duration,
  };

  const STS = new STSClient({
    logger,
    region,
    credentials,
  });

  return STS.send(new AssumeRoleCommand(params))
    .then((data) => {
      const { AccessKeyId, SecretAccessKey, SessionToken } = data.Credentials;
      process.stdout.write(`AWS_ACCESS_KEY_ID=${AccessKeyId} AWS_SECRET_ACCESS_KEY=${SecretAccessKey} AWS_SESSION_TOKEN=${SessionToken}`);
    });
};

run(program.opts()).catch(err => {
  console.error(err.message)
  process.exit(1)
});
