import { Stack, StackProps, CfnOutput, Duration, aws_lambda as lambda } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { join,  } from 'path';

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloFn = new NodejsFunction(this, 'HelloFunction', {
      entry: join(process.cwd(), "src/handlers/hello-world/index.ts"),
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
    });


    const api = new RestApi(this, 'ServiceApi', {
      restApiName: 'Lambda Api',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    });

    const helloIntegration = new LambdaIntegration(helloFn);

    api.root.addMethod('GET', helloIntegration);


    // API URL
    new CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Base URL of the REST API'
    });

  }
}
