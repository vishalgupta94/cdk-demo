import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/stacks/api-stack';


const app = new cdk.App();

console.log("{ account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION }",{ account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION })
new ApiStack(app, 'ApiStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});