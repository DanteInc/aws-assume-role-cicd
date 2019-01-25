#!/usr/bin/env node

const AWS = require('aws-sdk');

const argv = require('yargs')
  .option('role', {
    alias: 'r',
    describe: 'Role ARN to assume (env AWS_ROLE default)',
    type: 'string',
    default: process.env.AWS_ROLE
  })
  .option('duration', {
    alias: 'd',
    describe: 'Session length (30 miniute default)',
    type: 'number',
    default: process.env.AWS_SESSION_DURATION || 1800, // 30 minutes
  })
  .option('debug', {
    alias: 'b',
    type: 'boolean',
    default: false,
  })
  .help()
  .argv;

const assumeRole = (role, duration, debug) => {
  AWS.config.logger = debug ? process.stdout : undefined;

  const params = {
    RoleArn: role,
    RoleSessionName: 'aws-assume-role-cicd',
    DurationSeconds: duration,
  };

  const STS = new AWS.STS()
  return STS.assumeRole(params).promise()
    .then((data) => {
      const { AccessKeyId, SecretAccessKey, SessionToken } = data.Credentials;
      process.stdout.write(`AWS_ACCESS_KEY_ID=${AccessKeyId} AWS_SECRET_ACCESS_KEY=${SecretAccessKey} AWS_SESSION_TOKEN=${SessionToken}`);
    });
};

const run = (argv) => {
  const { role, duration, debug } = argv;
  if (debug) console.log('args: %j', argv);
  if (!role) return Promise.resolve();
  return assumeRole(role, duration, debug);
};

run(argv).catch(err => {
  console.error(err.message)
  process.exit(1)
});
