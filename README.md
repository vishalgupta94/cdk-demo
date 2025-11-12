# CDK Lambda API - Student Assignment

Welcome to your AWS CDK assignment! This project demonstrates how to build a serverless API using AWS CDK, Lambda, and API Gateway with TypeScript.

## 📋 Prerequisites

Before starting this assignment, ensure you have:

- [Node.js](https://nodejs.org/) (v18 or higher) installed
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured with your credentials
- An AWS account (Free Tier is sufficient)
- Basic knowledge of TypeScript and AWS services

## 🚀 Getting Started

### 1. Setup Your Environment

**Clone the repository:**
```bash
git clone <your-repo-url>
cd cdk-demo
```

**Install dependencies:**
```bash
npm install
```

**Configure AWS credentials:**
```bash
aws configure
```
Enter your AWS Access Key ID, Secret Access Key, and preferred region.

**Bootstrap CDK (first time only):**
```bash
npx cdk bootstrap
```

### 2. Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript.

### 3. Review the Infrastructure

**Synthesize the CloudFormation template:**
```bash
npx cdk synth
```

This generates the CloudFormation template without deploying. Review the output to understand what resources will be created.

### 4. Deploy to AWS

```bash
npx cdk deploy
```

After successful deployment, you'll see an output with your API URL:
```
Outputs:
ApiStack.ApiUrl = https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/
```

### 5. Test Your API

```bash
curl https://your-api-url.execute-api.us-east-1.amazonaws.com/prod/
```

Expected response:
```json
{
  "message": "Hello from Lambda!",
  "timestamp": "2025-11-12T00:00:00.000Z"
}
```

## 📁 Project Structure

```
cdk-demo/
├── bin/
│   └── cdk-demo.ts          # CDK app entry point
├── lib/
│   └── stacks/
│       └── api-stack.ts      # Main infrastructure stack
├── src/
│   └── handlers/
│       └── hello-world/
│           ├── index.ts      # Lambda function code
│           └── package.json  # Lambda dependencies
├── test/
│   └── cdk-demo.test.ts     # Infrastructure tests
├── cdk.json                 # CDK configuration
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Useful Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run watch` | Watch for changes and compile automatically |
| `npm run test` | Run Jest unit tests |
| `npx cdk synth` | Generate CloudFormation template |
| `npx cdk deploy` | Deploy the stack to AWS |
| `npx cdk diff` | Compare local changes with deployed stack |
| `npx cdk destroy` | Delete all AWS resources |

## 📝 Assignment Tasks

### Part 1: Understanding the Code (Required)

1. **Explore the Stack:**
   - Open `lib/stacks/api-stack.ts` and understand what resources are being created
   - Identify the Lambda function, API Gateway, and their configurations
   - What runtime is the Lambda using?
   - What is the memory allocation for the Lambda function?

2. **Explore the Lambda Handler:**
   - Open `src/handlers/hello-world/index.ts`
   - Understand the handler function structure
   - What HTTP status code is being returned?
   - What headers are included in the response?

3. **Deploy and Test:**
   - Deploy the stack using `npx cdk deploy`
   - Test the API endpoint using curl or Postman
   - Take a screenshot of the response

### Part 2: Add a New Endpoint (Required)

Create a new Lambda function that returns user information:

1. Create a new handler at `src/handlers/get-user/index.ts` that:
   - Accepts a path parameter `userId` from API Gateway
   - Returns mock user data (name, email, id)
   - Includes proper error handling

2. Update `lib/stacks/api-stack.ts` to:
   - Create a new Lambda function for the get-user handler
   - Add a new API Gateway resource: `GET /users/{userId}`
   - Connect the Lambda function to the new endpoint

3. Deploy and test your changes

### Part 3: Add DynamoDB Integration (Advanced)

1. **Add DynamoDB Table:**
   - Create a DynamoDB table in your CDK stack
   - Table name: `Users`
   - Partition key: `userId` (String)
   - Billing mode: PAY_PER_REQUEST

2. **Grant Permissions:**
   - Give your Lambda function read/write access to the table
   - Pass the table name to Lambda via environment variables

3. **Update Lambda Handler:**
   - Modify your handler to read from/write to DynamoDB
   - Implement proper error handling for database operations

4. **Create CRUD Operations:**
   - POST /users - Create a user
   - GET /users/{userId} - Get a user
   - PUT /users/{userId} - Update a user
   - DELETE /users/{userId} - Delete a user

### Part 4: Add Tests (Advanced)

1. **Infrastructure Tests:**
   - Test that Lambda functions are created with correct properties
   - Test that API Gateway endpoints are configured correctly
   - Test that DynamoDB table has correct attributes
   - Use CDK assertions library

2. **Lambda Handler Tests:**
   - Test successful responses
   - Test error scenarios
   - Mock DynamoDB calls
   - Aim for >80% code coverage

### Part 5: Add Monitoring (Bonus)

1. Add CloudWatch alarms for:
   - Lambda errors
   - Lambda duration
   - API Gateway 4xx/5xx errors

2. Add structured logging to your Lambda functions

3. Export important metrics as CloudFormation outputs

## 🛠️ Troubleshooting

### Issue: "Stack is not bootstrapped"
**Solution:** Run `npx cdk bootstrap` to prepare your AWS environment for CDK.

### Issue: "Unable to locate credentials"
**Solution:** Run `aws configure` and enter your AWS credentials.

### Issue: TypeScript compilation errors
**Solution:** 
- Ensure you're using Node.js 18 or higher
- Delete `node_modules` and run `npm install` again
- Run `npm run build` to see detailed errors

### Issue: Lambda function fails to deploy
**Solution:** Check CloudWatch Logs for your Lambda function in the AWS Console.

### Issue: API returns 502 Bad Gateway
**Solution:** Check Lambda function logs in CloudWatch. Ensure your handler exports a function named `handler`.

## 💰 Cost Considerations

This project uses AWS Free Tier eligible services:
- **Lambda:** 1 million requests/month free
- **API Gateway:** 1 million API calls/month free
- **DynamoDB:** 25 GB storage free, 25 read/write capacity units free
- **CloudWatch:** Basic monitoring free

**Important:** Always run `npx cdk destroy` when you're done to avoid unnecessary charges!

## 🧹 Cleanup

To delete all AWS resources and avoid charges:

```bash
npx cdk destroy
```

This will remove:
- Lambda functions
- API Gateway
- DynamoDB tables (if created)
- IAM roles and policies
- CloudWatch log groups

## 📚 Learning Resources

### AWS CDK
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [CDK Workshop](https://cdkworkshop.com/)
- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/v2/)
- [CDK Examples](https://github.com/aws-samples/aws-cdk-examples)

### AWS Services
- [Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/)
- [API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/latest/developerguide/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## 🎯 Submission Guidelines

Submit the following:

1. **GitHub Repository URL** with your completed code
2. **Screenshots** showing:
   - Successful CDK deployment output
   - API testing with curl/Postman
   - AWS Console showing created resources
3. **Documentation:**
   - Brief explanation of changes made
   - Any challenges faced and how you solved them
   - Testing results

## ✅ Evaluation Criteria

Your assignment will be evaluated on:

- **Functionality (40%)**: Does your code work as expected?
- **Code Quality (30%)**: Is your code clean, readable, and well-structured?
- **Infrastructure (20%)**: Are AWS resources properly configured?
- **Documentation (10%)**: Is your code and process well-documented?

## 🤝 Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Review AWS CloudWatch Logs for detailed error messages
3. Search AWS CDK documentation and examples
4. Ask questions during office hours
5. Check the AWS CDK GitHub issues for similar problems

## 📖 Understanding the Existing Code

### CDK Stack (`lib/stacks/api-stack.ts`)

The stack creates:
- **Lambda Function**: Uses `NodejsFunction` construct which automatically bundles TypeScript code
- **API Gateway**: REST API with CORS enabled
- **Integration**: Connects Lambda to API Gateway root path (`/`)
- **Output**: Exports the API URL for easy access

### Lambda Handler (`src/handlers/hello-world/index.ts`)

The handler:
- Implements the `APIGatewayProxyHandler` type
- Returns a proper API Gateway response format
- Includes CORS headers
- Returns JSON data with a message and timestamp

### CDK Configuration (`cdk.json`)

Tells CDK how to run your app and includes feature flags for new CDK behaviors.

## 🚀 Next Steps

After completing the basic assignment:

1. Add request validation to API Gateway
2. Implement authentication with API keys or Cognito
3. Add multiple environments (dev, staging, prod)
4. Set up CI/CD with GitHub Actions
5. Add X-Ray tracing for debugging
6. Implement caching with API Gateway or DynamoDB DAX
7. Add custom domain name for your API

## 📅 Timeline Suggestion

- **Week 1**: Complete Parts 1-2 (Understanding & New Endpoint)
- **Week 2**: Complete Part 3 (DynamoDB Integration)
- **Week 3**: Complete Parts 4-5 (Tests & Monitoring)

Good luck with your assignment! 🎉
