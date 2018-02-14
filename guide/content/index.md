## Welcome!

Welcome to the _Running Containers on AWS Fargate_ workshop.

In this workshop, we're going deploy applications using [Amazon Elastic
Container Service (Amazon ECS)][ecs] to orchestrate our containers on top of
[AWS Fargate][fargate] using [AWS Cloud9][cloud9] to drive our development and
deployment. Amazon ECS and AWS Fargate are deeply integrated into the AWS
platform, so we'll be working with other services along the way including
[Amazon Elastic Container Registry (Amazon ECR)][ecr], [AWS
Identity and Access Management (IAM)][iam], [Amazon DynamoDB][dynamodb], and
[AWS developer tools][dev-tools] including [AWS CodeCommit][codecommit], [AWS
CodePipeline][codepipeline], and [AWS CodeBuild][codebuild].

### Sections

This workshop is divided into sections each of which have one or more individual
modules. Each module describes a scenario of what we're going to build and
step-by-step directions to help you implement the architecture and verify your
work. Some modules contain instructions for both the AWS Management Console and
the AWS Command Line Interface giving you the option to choose either to
complete the task.

#### Introduction

This is a 200-level workshop designed to illustrate how to deploy containerized
applications to AWS without managing clusters or provisioning servers. It
contains four modules which start from stratch to create a cluster, a Docker
image repository, to build and push a new Docker container image, and to
configure a new service to run our container on Amazon ECS using AWS Fargate.

The modules build on each other and are intended to be executed linearly.

Ensure that you've followed the [setup guide][setup] before starting the
workshop.

| Module | Description |
| ---------------- | -------------------------------------------------------- |
| [Getting Started with Amazon ECS using AWS Fargate][getting-started] | Create a new Amazon ECS cluster using the AWS Management Console. At the end of this module, we'll have a new ECS cluster, supporting infrastructure such as a VPC and subnets, and a small Hello World application running. |
| [Create a Docker Image Repository][create-docker-image-repository] | Create a new Docker registry repository for workshop images in Amazon ECR. |
| [Build and Push a Docker Image][build-push-image] | Fork a sample application from GitHub which uses an Amazon DynamoDB table to store notable quotations, build it as a Docker container image, and push it to your new Docker image repository. |
| [Create a Service][create-a-service] | Create a task definition, a load balancer, and a service to run your Docker container image. |

#### CI/CD

Building on the application we've deployed in the Introduction section, we'll
create a continuous deployment pipeline to deploy our application.. With
continuous deployment, revisions are deployed to a production environment
automatically without explicit approval from a developer, making the entire
software release process automated.

| Module | Level | Description |
| ---------------- | --- | -------------------------------------------------------- |
| [Build a Continuous Deployment Pipeline][build-a-continuous-deployment-pipeline] | 200 | Using [AWS CodeCommit][codecommit], [AWS CodePipeline][codepipeline], and [AWS CodeBuild][codebuild], create a continuous deployment pipeline to automatically deploy changes to your application. |

### Issues, Comments, Feedback?

I'm [open source][repo]! If you see an issue, want to contribute content, or
have overall feedback please open an [issue][issue] or [pull request][pull].

### Next

✅\  Review and follow the directions in the [setup guide][setup], wherein you'll
configure your AWS Cloud9 IDE and setup pre-requisites like an AWS Account.

[ecs]: http://aws.amazon.com/ecs/
[ecr]: http://aws.amazon.com/ecr/
[fargate]: http://aws.amazon.com/fargate/
[cloud9]: http://aws.amazon.com/cloud9/
[iam]: http://aws.amazon.com/iam/
[dynamodb]: http://aws.amazon.com/dynamodb/
[dev-tools]: https://aws.amazon.com/products/developer-tools/
[codepipeline]: http://aws.amazon.com/codepipeline/
[codebuild]: http://aws.amazon.com/codebuild/
[codecommit]: http://aws.amazon.com/codecommit/
[setup]: setup.html
[getting-started]: getting-started-with-amazon-ecs-using-aws-fargate.html
[create-docker-image-repository]: create-a-docker-image-repository.html
[build-push-image]: build-and-push-a-docker-image.html
[create-a-service]: create-a-service.html
[build-a-continuous-deployment-pipeline]: build-a-continuous-deployment-pipeline.html
[repo]: https://github.com/aws-samples/aws-fargate-workshop
[issue]: https://github.com/aws-samples/aws-fargate-workshop/issues
[pull]: https://github.com/aws-samples/aws-fargate-workshop/pulls
