#!/usr/bin/env node
import * as fs from 'fs';
const aws = require('aws-sdk');
const chalk = require('chalk');
const path = require('path');

const { Command } = require('commander');

const program = new Command();
program
  .version('1.0')
  .description("")
  .option('-r, --region [region]', 'The region to deploy to')
  .option('-t, --template [templateLocation]', 'The cloudformation template to deploy (json or yaml)')
  .option('-n, --stack-name [name]', 'The name of the stack in aws')
  .parse(process.argv);

(async () => {
  const region = regionFromArgs();
  const stackName = stackNameFromArgs();
  const template = templateFromArgs();
  await deploy(region, stackName, template);
})().catch(e => {
  console.error(chalk.red(e));
});

async function deploy(region: string, stackName: string, template: string) {
  console.log(chalk.green(`Creating stack in region ${region} named ${stackName}`));
  const cf = new aws.CloudFormation({region});
  //cf.createStack({}).promise();
  console.log(chalk.yellow(template));
}

function regionFromArgs(): string {
  return program.region ?? 'eu-west-1';
}

function stackNameFromArgs(): string {
  if(program.stackName) {
    return program.stackName
  } else {
    console.error(chalk.red('--stack-name must be provided with the name of the stack as it appears in aws'));
    process.exit(1);
  }
}

function templateFromArgs(): string {
  if(program.template) {
    return fs.readFileSync(program.template).toString();
  } else {
    console.error(chalk.red('--template must be provided with the location of a CloudFormation template'));
    process.exit(1);
  }
}
