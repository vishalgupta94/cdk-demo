# CDK Lambda API Demo

A simple serverless REST API built with AWS CDK, Lambda, and API Gateway using TypeScript.

## What This Does

This project deploys a serverless API that responds with a "Hello from Lambda!" message. It demonstrates:
- Infrastructure as Code using AWS CDK
- Lambda function with API Gateway integration
- TypeScript for both infrastructure and application code

## CI/CD Setup

This repo includes CI/CD configurations for both GitHub Actions and Bitbucket Pipelines that automatically deploy to AWS when you push to the `main` branch.

### GitHub Actions

**File:** `.github/workflows/cdk-deploy.yml`

Configure these in your GitHub repository settings (Settings → Secrets and variables → Actions):

**Secrets:**
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key

**Variables:**
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `AWS_ACCOUNT_ID` - Your AWS account ID

### Bitbucket Pipelines

**File:** `bitbucket-pipelines.yml`

Configure these in your Bitbucket repository settings (Repository Settings → Pipelines → Repository variables):

**Variables (mark as secured):**
- `AWS_ACCESS_KEY_ID` - Your AWS access key (secured)
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key (secured)
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `AWS_ACCOUNT_ID` - Your AWS account ID
- `AWS_DEFAULT_REGION` - Same as AWS_REGION (for CDK)

Also enable Pipelines in Repository Settings → Pipelines → Settings.

## Prerequisites

- Node.js 18 or higher
- AWS CLI configured with credentials (`aws configure`)
- An AWS account

## Quick Start

**1. Install dependencies:**
```bash
npm install
```

**2. Bootstrap CDK (first time only):**
```bash
npx cdk bootstrap
```

**3. Deploy to AWS:**
```bash
npm run build
npx cdk deploy
```

**4. Test the API:**

After deployment, you'll get an API URL. Test it:
```bash
curl https://YOUR-API-URL.execute-api.REGION.amazonaws.com/prod/
```

Expected response:
```json
{
  "message": "Hello from Lambda!",
  "timestamp": "2025-11-12T00:00:00.000Z"
}
```

## Project Structure

```
├── bin/cdk-demo.ts              # CDK app entry point
├── lib/stacks/api-stack.ts      # Infrastructure definition
├── src/handlers/hello-world/    # Lambda function code
```

