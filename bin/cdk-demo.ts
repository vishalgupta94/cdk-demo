import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/stacks/api-stack';


const app = new cdk.App();
new ApiStack(app, 'ApiStack', {
  env: { account: '339713054130', region: 'ap-south-1' },
});