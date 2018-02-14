## Create a Docker Image Repository

In this module, you'll create a Docker container image repository in Amazon
Elastic Container Registry (ECR). Amazon ECR is a fully-managed Docker container
registry that makes it easy for developers to store, manage, and deploy Docker
container images without worrying about managing or scaling the underlying
infrastructure.

Amazon ECR is integrated with Amazon ECS to simplify production deployment
workshop and IAM which provides resource-level control of each repository.

You'll use this repository to store our Docker container images so that we can
deploy them to AWS Fargate via Amazon ECS.

### Implementation

Create a new repository in Amazon ECR called `workshop`. Note the **Repository
URI** of the repository.

**✅\  Step-by-step Instructions (AWS Management Console)**

1. Go to the AWS Management Console, click **Services** then select **Elastic
   Container Service** under Compute.

1. Click **Repositories** in the left-hand navigation.

1. Click **Get started** if this is your first visit to the Amazon ECR console,
   or **Create repository** if you've used it before.

1. Enter `workshop` into **Repository name**.

1. Note the contents of the **Repository URI** field.

    ![](images/repository-create-form.png)

1. Click **Next step**. Your repository has been created.

    ![](images/repository-created.png)

**✅\  Step-by-step Instructions (AWS CLI)**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Use the AWS CLI to create the repository by running `aws ecr create-repository --repository-name workshop`
   in the Cloud9 terminal:

    ```console
    aws ecr create-repository --repository-name workshop
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

    ```console
    Admin:~/environment $ aws ecr create-repository --repository-name workshop
    ```
    ```json
    {
        "repository": {
            "registryId": "123456789012",
            "repositoryName": "workshop",
            "repositoryArn": "arn:aws:ecr:us-east-1:123456789012:repository/workshop",
            "createdAt": 1515180775.0,
            "repositoryUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/workshop"
        }
    }
    ```

1. Note the contents of the **repositoryUri** field.

### ⭐ Recap

🔑\  Amazon ECR is a fully managed Docker image registry that makes it easy to
store built Docker images in the cloud without worrying about managing or
scaling the underlying infrastructure.

🛠️\  You created a Docker image repository in Amazon ECR. The repository has a URI
which you've noted for use in the coming modules.

### Next

✅\  Proceed to the next module, [Build and Push a Docker
Image][build-and-push-a-docker-image], wherein you'll clone a sample application
from GitHub, build a Docker container from it, and push that into your new
repository in Amazon ECR.

[build-and-push-a-docker-image]: build-and-push-a-docker-image.html
