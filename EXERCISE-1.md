# Repository Strategy

## Monorepo Approach

A monorepo structure containing both application code and infrastructure code.

## Multi-Repo

Separate repos for application code and infrastructure, so that developer can only focus on code.

## Advantages Monorepo Approach

* Application code and infrastructure changes can be committed and deployed together
* Shared dependencies (e.g., CDK constructs, utilities) are defined once
* Single checkout required for development
* Single pipeline definition handles both application and infrastructure
* Reduced complexity in orchestrating deployments across multiple repos
* Unified testing strategy (unit tests, integration tests, infrastructure tests)

## Disadvantages Monorepo Approach

* Monorepo can grow large over time
* Harder to restrict access to specific parts of the codebase

## Advantages Multi-Repo

* Large Organizations with Separate Teams - Infrastructure team is completely separate from application development teams
* Single infrastructure repository supports multiple application repositories
* Different Technology Stacks - Application code in Python/Java, infrastructure in TypeScript CDK
* Infrastructure changes are infrequent, applications change daily

## Disadvantages Multi-Repo

A multi-repo approach (separate repos for app and infrastructure) would introduce:

* Complex dependency management: Need to publish and consume internal packages
* Cross-repo changes: Changes spanning app and infrastructure require multiple PRs
* Pipeline orchestration complexity: Need to coordinate deployments across repositories
* Slower development velocity: More overhead for making changes

For a small to medium-sized team managing, the monorepo approach provides better developer experience and reduces operational complexity.

---

# 🏗️ AWS CDK Application Structure – Multi-Environment Setup

## Question

> Explain how you would organize your CDK application to manage multiple environments (`dev`, `uat`, `stage`, `prod`).

---

## Answer

### 🧩 Approach

Organize the CDK application using a layered pattern of:

- **CDK Context** → Selects the target environment (e.g., `dev`, `uat`, `prod`)

- **Configuration Files** → Contain per-environment settings and parameters

- **CDK Stages** → Represent full deployable environments (grouping multiple stacks)

- **CDK Stacks** → Define actual AWS resources such as VPCs, Lambdas, and databases

This structure provides **clear separation of concerns**, **type safety**, and **flexible CI/CD deployments**.

---

## 🧠 How Stages, Stacks, and Config Files Work Together

| Concept | Purpose | Example in Context |
|----------|----------|-------------------|
| **Configuration Files** | Store environment-specific parameters such as instance size, scaling limits, or feature flags. | `/config/dev.ts`, `/config/prod.ts` |
| **Stacks** | Logical groupings of AWS resources (e.g., `NetworkStack`, `DataStack`, `AppStack`). | Each Stack defines part of the infrastructure. |
| **Stages** | Group multiple stacks into a single deployable unit representing one environment. | `AppStage` includes all stacks for `dev` or `prod`. |
| **Context** | Used at deploy time to pick the correct environment configuration. | `--context env=dev` or `--context env=prod` |

---

### 🔄 Flow Diagram

```
[ cdk.json / CLI Context (--context env=dev) ]
                ↓
[ main.ts reads env and loads config ]
                ↓
[ AppStage (for dev) is created ]
                ↓
[ Stacks inside the Stage are instantiated ]
                ↓
[ Each Stack uses environment-specific config values ]
```

---

## ⚙️ Configuration Structure

Define a type-safe interface such as `EnvironmentConfig` that covers all infrastructure aspects.

| Category | Description |
|-----------|--------------|
| **Basic Info** | Environment name, AWS account, region |
| **VPC Settings** | CIDR block, number of AZs |
| **Database Config** | Instance size, backup retention, Multi-AZ, deletion protection |
| **Lambda Settings** | Memory size, timeout, concurrency, log retention |
| **API Gateway** | Throttling and caching settings |
| **Monitoring** | Alarm email, detailed monitoring flags |
| **Feature Flags** | Enable or disable X-Ray, backups, WAF |
| **Tags** | Environment, cost center, compliance, etc. |

---

## 🌍 Environment Examples

### 🧪 Dev Environment

- **Database:** `t3.micro`, 1-day backup, single AZ, no deletion protection  

- **Lambda:** 256 MB memory, 30 s timeout, 7-day log retention  

### 🚀 Production Environment

- **Database:** `r6g.xlarge`, 30-day backup, multi-AZ, deletion protection enabled  

- **Lambda:** 1024 MB memory, 60 s timeout, reserved concurrency, 90-day log retention  

---

## 🧾 Example `cdk.json`

```json
{
  "app": "npx ts-node --project tsconfig.json bin/main.ts",
  "context": {
    "env": "dev", // default environment if caller doesn't pass one
    "configs": {
      "dev":  {
        "account": "111111111111",
        "region":  "us-east-1",
        "dbName":  "devdb"
      },
      "test": {
        "account": "222222222222",
        "region":  "us-east-2",
        "dbName":  "testdb"
      },
      "prod": {
        "account": "333333333333",
        "region":  "us-west-2",
        "dbName":  "proddb"
      }
    }
  }
}
```

## Deploying a Specific Environment

```bash
cdk deploy --context env=test
```

The CLI context selects the target environment (test) and loads the corresponding configuration.

## Accessing Context in CDK

```typescript
const envName: string = app.node.tryGetContext('env');
const configs = app.node.tryGetContext('configs');
const envConfig = configs[envName];
```

This configuration object (envConfig) is passed into the CDK Stage for that environment.

---

## 🏗️ Using CDK Stages

A Stage represents one environment (for example, Dev or Prod) and contains one or more Stacks.

```typescript
// lib/app-stage.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ExampleStack } from './example-stack';

export interface AppStageProps extends cdk.StageProps {
  config: any;
}

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    // Stage groups multiple stacks into a single environment
    new ExampleStack(this, `${props.config.appName}-${props.config.envName}-stack`, {
      config: props.config,
    });
  }
}
```

Each Stage corresponds to one environment (dev, uat, stage, prod).

A Stage can contain multiple Stacks (e.g., NetworkStack, AppStack, DatabaseStack).

You can deploy a single Stage at a time or all together.

---

## 🪜 Example Project Structure

```
cdk-app/
├─ bin/
│  └─ main.ts                  # entrypoint: reads context, selects env(s), instantiates stages
├─ lib/
│  ├─ stages/
│  │  └─ app-stage.ts          # Stage wiring (groups stacks per environment)
│  ├─ stacks/
│  │  ├─ network-stack.ts
│  │  ├─ data-stack.ts
│  │  └─ app-stack.ts
│  └─ types.ts                 # shared types for config
├─ config/
│  ├─ base.ts                  # shared defaults used by all envs
│  ├─ dev.ts
│  ├─ uat.ts
│  ├─ stage.ts
│  └─ prod.ts
├─ cdk.json                    # optional defaults; can hold "env=dev", flags, etc.
└─ package.json
```

---

## 🧠 How Everything Connects

**Context** — `cdk deploy --context env=dev` tells CDK which environment to deploy.

**Config File** — The matching environment file (dev.ts) provides parameters.

**Stage** — `AppStage` groups all stacks for that environment.

**Stacks** — Use config to create environment-specific AWS resources.

---

## ✅ Summary

| Concept | Role | Example |
|---------|------|---------|
| Context | Selects which environment to deploy. | `--context env=dev` |
| Configuration File | Holds environment-specific values. | `/config/dev.ts` |
| Stage | Represents a full environment grouping multiple stacks. | `AppStage` |
| Stack | Defines AWS resources (VPC, Lambda, API, etc.). | `NetworkStack`, `AppStack` |
| CI/CD Integration | Deploy one Stage per pipeline stage. | Dev → UAT → Prod |
| Type Safety | Ensured via TypeScript interfaces or Zod validation. | `EnvironmentConfig` |

---

## Benefits of Using CDK Stages

 **Environment Isolation** – Each stage has its own AWS account/region.

 **Reusable Infrastructure** – Same stacks, different configurations.

 **Pipeline Compatibility** – Ideal for CDK Pipelines (dev → stage → prod).

 **Clear Boundaries** – Each environment acts as a clean deployment unit.

 **Consistent Deployments** – Reuse the same app logic across environments safely.

---

## 🧭 Summary Flow

```
cdk deploy --context env=prod
        │
        ▼
Reads "env" from context
        │
        ▼
Loads config from /config/prod.ts
        │
        ▼
Creates AppStage (for prod)
        │
        ▼
AppStage deploys all Stacks (Network, Data, App)
        │
        ▼
AWS resources created with prod-specific configuration
```

---

## 🏁 Final Takeaway

**CDK Context** chooses the environment.

**Configuration files** define how each environment behaves.

**CDK Stages** group all stacks that belong to that environment.

**CDK Stacks** create the actual AWS resources.

---

# 🚀 CI/CD Pipeline Design (Bitbucket Pipelines)

## 🏗️ Pipeline Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          BITBUCKET REPOSITORY                            │
│                                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │ develop  │    │   uat    │    │  stage   │    │   main   │         │
│  │  branch  │    │  branch  │    │  branch  │    │  branch  │         │
│  └─────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘         │
└────────┼──────────────┼───────────────┼───────────────┼────────────────┘
         │              │               │               │
         │ Push/Commit  │ Pull Request  │ Pull Request  │ Pull Request
         │ (Automatic)  │ + Approval    │ + Approval    │ + Approval
         │              │               │               │
         ▼              ▼               ▼               ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│  DEV Pipeline  │ │  UAT Pipeline  │ │ STAGE Pipeline │ │ PROD Pipeline  │
│                │ │                │ │                │ │                │
│ ┌────────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │
│ │   Build    │ │ │ │   Build    │ │ │ │   Build    │ │ │ │   Build    │ │
│ │   & Test   │ │ │ │   & Test   │ │ │ │   & Test   │ │ │ │   & Test   │ │
│ └─────┬──────┘ │ │ └─────┬──────┘ │ │ └─────┬──────┘ │ │ └─────┬──────┘ │
│       │        │ │       │        │ │       │        │ │       │        │
│       ▼        │ │       ▼        │ │       ▼        │ │       ▼        │
│ ┌────────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │
│ │CDK Synth   │ │ │ │CDK Synth   │ │ │ │CDK Synth   │ │ │ │CDK Synth   │ │
│ └─────┬──────┘ │ │ └─────┬──────┘ │ │ └─────┬──────┘ │ │ └─────┬──────┘ │
│       │        │ │       │        │ │       │        │ │       │        │
│       ▼        │ │       ▼        │ │       ▼        │ │       ▼        │
│ ┌────────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │ │ ┌────────────┐ │
│ │CDK Deploy  │ │ │ │CDK Deploy  │ │ │ │CDK Deploy  │ │ │ │CDK Deploy  │ │
│ │(Automatic) │ │ │ │(Manual)    │ │ │ │(Manual)    │ │ │ │(Manual)    │ │
│ └─────┬──────┘ │ │ └─────┬──────┘ │ │ └─────┬──────┘ │ │ └─────┬──────┘ │
└───────┼────────┘ └────────┼────────┘ └────────┼────────┘ └────────┼────────┘
        │                   │                    │                   │
        ▼                   ▼                    ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  AWS Account   │  │  AWS Account   │  │  AWS Account   │  │  AWS Account   │
│      DEV       │  │      UAT       │  │     STAGE      │  │     PROD       │
│  111111111111  │  │  222222222222  │  │  333333333333  │  │  444444444444  │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

---

## Behavior on develop branch (auto-deploy only to dev)

A push to `develop` triggers:

1. **Build & Unit Tests**
2. **CDK Synth + Diff** (safety/visibility)
3. **Automatic Deploy to dev** using:

```bash
cdk deploy --context env=dev
```

**No other environments are touched.** This keeps dev continuously updated while protecting higher envs.

---

## Promotion to uat, stage, and prod

Create a **release branch** (e.g., `release/1.2.3`) or open a PR into it.

Pipeline runs **Build → Synth/Diff**, then shows manual gates:

- **Manual approval to deploy UAT:**

```bash
cdk deploy --context env=uat
```

- **Manual approval to deploy Stage:**

```bash
cdk deploy --context env=stage
```

- **For Prod**, use a tag (e.g., `v1.2.3`) or merges to `main`, plus a manual approval (and optional change control):

```bash
cdk deploy --context env=prod
```

This gives **controlled, auditable promotions** across environments.
# Deploying a CDK App with OIDC Using Bitbucket Pipelines

This document explains how Bitbucket Pipelines securely authenticates with AWS using OpenID Connect (OIDC) to deploy the Application across multiple AWS accounts.

---


## **How OIDC Works**

OIDC allows Bitbucket to **assume AWS IAM roles** without storing static AWS credentials.

OIDC tokens are **short-lived, signed JWTs** issued by Bitbucket. They are exchanged with AWS STS using `AssumeRoleWithWebIdentity` to obtain temporary credentials.

### **CDK Internal Workflow**

The AWS CDK (Cloud Development Kit) deploys applications using a **Stack Synthesizer**, which relies on several IAM roles:

| Role | Description |
|------|--------------|
| **Deploy Role** | Uploads synthesized CloudFormation templates to AWS CloudFormation. |
| **Exec Role** | Executes CloudFormation deployments (invoked by `cdk deploy`). |
| **File Asset Role** | Publishes assets to S3 during deployments. |

For CDK to deploy successfully, the **actor** (either a profile or OIDC role) must have permission to assume these roles.

---

## **Difference Between Profile and OIDC**

| Mechanism | Description |
|------------|-------------|
| **AssumeRole** | Used by AWS users or roles inside AWS to assume other roles. |
| **AssumeRoleWithWebIdentity** | Used by **external federated identities** (like Bitbucket OIDC) to assume AWS roles. |

A **profile** uses `AssumeRole`, while **OIDC** uses `AssumeRoleWithWebIdentity` — ideal for CI/CD pipelines.

---

## **How to Configure OIDC with Bitbucket**

Sample Bitbucket Pipeline Configuration:
```yaml
pipelines:
  default:
    - step:
        oidc: true
        script:
          - export AWS_REGION=us-east-1
          - export AWS_ACCOUNT=123456789012
          - export AWS_ROLE_ARN=arn:aws:iam::${AWS_ACCOUNT}:role/oidc-cdk-deploy-assume-role
          - export AWS_WEB_IDENTITY_TOKEN_FILE=$(pwd)/web-identity-token
          - echo $BITBUCKET_STEP_OIDC_TOKEN > $(pwd)/web-identity-token
```

> 🔸 Note: Setting `oidc: true` enables Bitbucket to provide the OIDC token (`BITBUCKET_STEP_OIDC_TOKEN`) to the job.

Bitbucket uses this token to exchange with AWS STS and assume `AWS_ROLE_ARN`.

---

## **Security & Authentication Overview**

### **Authentication Flow**
1. Bitbucket receives a short-lived OIDC token from Atlassian OIDC provider.
2. It exchanges the token with AWS STS via `AssumeRoleWithWebIdentity`.
3. STS validates the token and issues temporary credentials.
4. These credentials allow Bitbucket to assume roles required for CDK deployment.

### **Security Advantages**
- **No static IAM keys** stored in Bitbucket.
- **Least Privilege:** Role trust policies restrict repo, branch, and service access.
- **Auditability:** CloudTrail logs all role assumptions and STS token exchanges.
- **Separation of Concerns:** Managed and Target accounts have distinct trust relationships.

---
