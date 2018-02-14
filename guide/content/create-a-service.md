## Create a Service

In this module, you will create a new task definition and service to run the
sample application we built in the previous module. To support this service,
you'll need to create an AWS Identity and Access Management (IAM) role to allow
our application to read from and write to the Amazon DynamoDB table it uses to
store data. We'll also need to create an Application Load Balancer to distribute
traffic across the running tasks that are being ran by the service.

### Implementation

#### 1. Create the Task Role

Task roles are IAM roles that can be used by the containers in the task. For our
application, we need to grant permission to read from and write to the Amazon
DynamoDB table we created in the last module.

**✅\  Step-by-step Instruction**

1. Go to the AWS Management Console, click **Services** then select **IAM**
   under Security, Identity & Compliance.

1. Click on **Roles** in the left-hand navigation.

1. Click **Create role**.

1. First, we'll configure which AWS service can assume this role. Click
   **Elastic Container Service** from the **Choose the service that will use this
   role** list.

1. Next, choose **Elastic Container Service Task** from **Select
   your use case**.

1. Click **Next: Permissions**.

1. Click **Create policy**. The visual policy editor will open in a new tab.

1. Click on **Choose a service** and click **DynamoDB**.

1. Click on **Actions**.

1. Expand the **Read** permissions and check the **Scan** and **GetItem**
   checkboxes.

1. Expand the **Write** permissions and check the **PutItem** and **DeleteItem**
   checkboxes.

1. Click **Resources** to limit the role to the **quotes** table.

1. Click **Add ARN** next to **table**.

1. Enter `us-east-1` in **Region**, your [Account ID][find-account-id] in
   **Account**, and `quotes` in **Table name**.

    ![](images/create-a-service/add-arn.png)

1. Click **Add**.

    ![](images/create-a-service/visual-editor.png)

    This will result in a policy allowing **dynamodb:PutItem**,
    **dynamodb:Scan**, **dynamodb:DeleteItem**, and **dyanmodb:GetItem**.

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:Deletetem",
                    "dynamodb:Scan"
                ],
                "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/quotes"
            }
        ]
    }
    ```

1. Click **Review policy**.

1. Enter `WorkshopAppPolicy` in **Name**.

    ![](images/create-a-service/review-policy.png)

1. Click **Create policy**.

    ![](images/create-a-service/policy-confirmation.png)

1. Return to the original tab where you were creating the role. Click
   **Refresh** and type `WorkshopAppPolicy` in the **Filter** textbox. Check the
   **WorkshopAppPolicy** checkbox. Click **Next: Review**.

1. Enter `WorkshopAppRole` in **Role name**.

    ![](images/create-a-service/review-role.png)

1. Click **Create role**.

#### 2. Create the Task Definition

Task definitions are blueprints for your application. They include details about
what containers to run, their resource requirements, environment settings,
networking configuration, and task role permission settings. In this step, we'll
create a task definition for our application. Complete either the directions
using the AWS Management Console or the AWS Command Line Interface.

**✅\  Step-by-step Instructions (AWS Management Console)**

1. Go to the AWS Management Console, click **Services** then select **Elastic
   Container Service** under Compute.

1. Click **Task Definitions** in the left-hand navigation.

1. Click **Create new Task Definition**.

1. Click **Fargate** to select the Fargate launch type.

    ![](images/create-a-service/launch-type.png)

1. Click **Next step**.

1. Enter `workshop` into **Task Definition Name**.

1. Select **WorkshopAppRole** from **Task Role**.

1. Select **0.5GB** from **Task memory (GB)**.

1. Select **0.25 vCPU** from **Task CPU (vCPU)**.

1. Click **Add container**.

1. Enter `workshop` into **Container name**.

1. In **Image**, paste the repository URI for the Docker image you built and
   pushed in the previous module. For example, if your Account ID was
   123456789012, then you'd enter:
   `123456789012.dkr.ecr.us-east-1.amazonaws.com/workshop`

1. Enter `80` into **Container port** and select **tcp** from **Protocol** in
   **Port mappings**.

1. Click **Add**.

1. Click **Create**.

**✅\  Step-by-step Instructions (AWS CLI)**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Open the file `fargate-workshop-app/ecs/task_definition.json` by navigating
   to it in the environment tree and double clicking the filename.

1. The file has the following contents:

    ```json
    {
      "family": "workshop",
      "requiresCompatibilities": ["FARGATE"],
      "cpu": "256",
      "memory": "512",
      "networkMode": "awsvpc",
      "taskRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID_HERE:role/WorkshopAppRole",
      "executionRoleArn": "arn:aws:iam::YOUR_ACCOUNT_ID_HERE:role/ecsTaskExecutionRole",
      "containerDefinitions": [
        {
          "name": "workshop",
          "image": "YOUR_ACCOUNT_ID_HERE.dkr.ecr.us-east-1.amazonaws.com/workshop",
          "essential": true,
          "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
              "awslogs-group": "/ecs/workshop",
              "awslogs-region": "us-east-1",
              "awslogs-stream-prefix": "ecs"
            }
          },
          "portMappings": [
            {
              "protocol": "tcp",
              "containerPort": 80
            }
          ]
        }
      ]
    }
    ```

1. Replace the **YOUR_ACCOUNT_ID_HERE** placeholders with your [Account
   ID][find-account-id]. Save the file by going to **File** and selecting
   **Save** in the menu bar, or pressing **⌘-S** (macOS) or **Ctrl-S** (Windows
   / Linux).

1. Create a new task definition from the JSON file by running this command in
   your Cloud9 terminal:

    ```console
    aws ecs register-task-definition --cli-input-json file://~/environment/fargate-workshop-app/ecs/task_definition.json
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Create the CloudWatch Logs log group `/ecs/workshop` configured in your new
   task definition by running this command in your Cloud9 terminal:

    ```console
    aws logs create-log-group --log-group-name /ecs/workshop
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

#### 3. Create an Application Load Balancer

**✅\  Step-by-step Instructions**

1. Go to the AWS Management Console, click **Services** then select **EC2**
   under Compute.

1. Click on **Load Balancers** in the left-hand navigation.

1. Click **Create Load Balancer**.

1. In **Application Load Balancer**, click **Create**.

    ![](images/create-a-service/application-load-balancer.png)

1. Enter `workshop` into **Name**.

1. Select the **VPC** created in the first module when you created the ECS
   cluster in the first module. If you need to find the VPC ID do one of the
   following:

    **AWS Management Console**

    1. Click on **Services**, right-click on **VPC** under Networking &
       Content Delivery and click **Open Link in New Tab**.

    1. Click on **Your VPCs** in the left-hand navigation.

    1. Click on each VPC, and click on its **Tags** tab. The VPC you're
       looking for has a tag with **Key** `aws:cloudformation:stack-name` and
       **Value** `EC2ContainerService-workshop`

    **AWS CLI**

    1. Run the following command in your Cloud9 terminal:

        ```console
        aws ec2 describe-vpcs --query Vpcs[0].VpcId --output text \
          --filters Name=tag:aws:cloudformation:stack-name,Values=EC2ContainerService-workshop
        ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Select all **Availability Zones** configured for the VPC by checking each
   checkbox.

1. Click **Next: Configure Security Settings**.

1. The wizard will warn you that you've not established a secure listener as
   we didn't define an HTTPS listener. Click **Next: Configure Security
   Groups**.

1. Tick the **Create a new security group** radio button. This will create a new
   security group which will permit traffic to port 80 by default.

1. Click **Next: Configure Routing**.

1. Enter `workshop` into **Name**.

1. Enter `80` into **Port**.

1. Select **ip** from **Target type**.

1. Click **Next: Register Targets**. We won't register anything as we'll rely on
   Amazon ECS to manage our Target Group for us.

1. Click **Next: Review**. Review the details you configured, then click
   **Create**.

1. Click on the **workshop** link to view details about the new load balancer.

    ![](images/create-a-service/load-balancer-confirmation.png)

1. Click on the **workshop** link to view details about the new load balancer.

    ![](images/create-a-service/load-balancer-details.png)

    Take note of the **DNSName**. This will be the hostname of our load balancer
    that we'll use to hit our service after we complete the next set of steps.

#### 4. Create the Service

Services maintain a desired number of tasks and manage registration of those
tasks with a load balancer. In this section, we'll create a new service for our
Docker container.

**✅\  Step-by-step Instructions (AWS Management Console)**

1. Go to the AWS Management Console, click **Services** then select **Elastic
   Container Service** under Compute.

1. Click **workshop** in the cluster list.

1. The **Services** tab should be selected. Click **Create**.

1. Tick the **FARGATE** radio button in **Launch Type**.

1. Select **workshop:1** from **Task Definition**.

1. Enter `workshop` into **Service name**.

1. Enter `1` into **Number of tasks**.

    ![](images/create-a-service/configure-service.png)

1. Click **Next step**.

1. Select the **VPC** created in the first module when you created the ECS
   cluster in the first module. If you need to find the VPC ID do one of the
   following:

    **AWS Management Console**

    1. Click on **Services**, right-click on **VPC** under Networking &
       Content Delivery and click **Open Link in New Tab**.

    1. Click on **Your VPCs** in the left-hand navigation.

    1. Click on each VPC, and click on its **Tags** tab. The VPC you're
       looking for has a tag with **Key** `aws:cloudformation:stack-name` and
       **Value** `EC2ContainerService-workshop`

    **AWS CLI**

    1. Run the following command in your Cloud9 terminal:

        ```console
        aws ec2 describe-vpcs --query Vpcs[0].VpcId --output text \
          --filters Name=tag:aws:cloudformation:stack-name,Values=EC2ContainerService-workshop
        ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Select both subnets in **Subnets**.

    ![](images/create-a-service/network-configuration.png)

1. Select **ENABLED** from **Auto-assign public IP**. This allows your tasks
   to retrieve the Docker image from Amazon ECR and stream logs to Amazon
   CloudWatch Logs.

1. Under **Load Balancing**, tick the **Application Load Balancer** radio
   button.

1. Click **Add to load balanacer**.

1. Select **80:HTTP** from **Listener port**.

1. Select **workshop** from **Target group name**.

    ![](images/create-a-service/load-balancer.png)

1. Click **Next step**.

1. The next page allows you to define an Auto Scaling policy. Leave this set to
   **Do not adjust the service's desired count** for now and click **Next
   step**.

1. Review your settings and click **Create Service**.

1. The service will now start your task. Click **View Service** and wait for
   your task to transition to **RUNNING**.

1. Hit your task via the load balancer through the DNSName you noted in
   [Create an Application Load Balancer][create-an-alb]. For example:

    ```console
    curl -Ss http://workshop-123456789.us-east-1.elb.amazonaws.com/quotes | jq
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

**✅\  Step-by-step Instructions (AWS CLI)**

1. Switch to the tab where you have your Cloud9 environment opened.

1. Open the file `fargate-workshop-app/ecs/service.json` by navigating to it in
   the environment tree and double clicking the filename.


1. Inspect the file contents. There are several placeholders in this file to
   fill-in: the ARN of the target group and the IDs of the subnets and security
   group created for us in the first run wizard.

   ```json
   {
       "cluster": "workshop",
       "serviceName": "workshop",
       "taskDefinition": "workshop:1",
       "desiredCount": 1,
       "launchType": "FARGATE",
       "platformVersion": "LATEST",
       "loadBalancers": [
           {
               "targetGroupArn": "YOUR_TARGET_GROUP_ARN_HERE",
               "containerName": "workshop",
               "containerPort": 80
           }
       ],
       "networkConfiguration": {
           "awsvpcConfiguration": {
               "subnets": ["YOUR_SUBNET1_ID_HERE", "YOUR_SUBNET2_ID_HERE"],
               "securityGroups": ["YOUR_SECURITY_GROUP_ID_HERE"],
               "assignPublicIp": "ENABLED"
           }
       }
   }
   ```

1. Fill in the **YOUR_TARGET_GROUP_ARN_HERE** placeholder. To find the ARN of
   the target group, run this command in the Cloud9 terminal:

    ```console
    aws elbv2 describe-target-groups --names workshop --query TargetGroups[0].TargetGroupArn --output text
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Fill in the **YOUR_SUBNET1_ID_HERE** and **YOUR_SUBNET2_ID_HERE**
   placeholders. To find the IDs of the subnets created in the first run wizard,
   run this command in the Cloud9 terminal:

    ```console
    aws ec2 describe-subnets --query Subnets[].SubnetId --output text \
       --filters Name=tag:aws:cloudformation:stack-name,Values=EC2ContainerService-workshop
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Fill in the **YOUR_SECURITY_GROUP_ID_HERE** placeholder. To find the ID of
   the security group created in the first run wizard, run this command in the
   Cloud9 terminal:

    ```console
    aws ec2 describe-security-groups --query SecurityGroups[].GroupId --output text \
       --filters Name=tag:aws:cloudformation:stack-name,Values=EC2ContainerService-workshop
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Save the file by going to File and selecting Save in the menu bar, or
   pressing **⌘-S** (macOS) or **Ctrl-S** (Windows / Linux).

1. Now that all the values are filled-in, we can create the service by running
   this command in the Cloud9 terminal:

    ```console
    aws ecs create-service --cli-input-json file://~/environment/fargate-workshop-app/ecs/service.json
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. The service will now start your task. Wait for your task to transition to
   **RUNNING**. You can view the status of your task by running this in your
   Cloud9 terminal:

    ```console
    aws ecs describe-tasks \
      --cluster workshop \
      --tasks `aws ecs list-tasks --service-name workshop --cluster workshop --query taskArns[] --output text` \
      --query tasks[].lastStatus \
      --output text
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

1. Hit your task via the load balancer through the DNSName you noted in
   [Create an Application Load Balancer][create-an-alb]. For example:

    ```console
    curl -Ss http://workshop-123456789.us-east-1.elb.amazonaws.com/quotes | jq
    ```
<button class="btn btn-outline-primary copy">Copy to Clipboard</button>

### ⭐ Recap

🔑\   Amazon ECS services keep the desired number of tasks running and integrate with Elastic
Load Balancing to distribute traffic across them.

🛠️\   You've deployed the sample application as a service behind an Application
Load Balancer.

🎉\   You've completed this section!

### Next

✅\  If you want to dive into CI/CD, try our next section, [Build a Continuous
Deployment Pipeline][build-a-cd-pipeline], wherein you'll use AWS CodeBuild to
automatically build your container and create a CI/CD pipeline with AWS
CodePipeline to orchestrate the process and deploy it to Amazon ECS.

[find-account-id]: https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html
[create-an-alb]: #create-an-application-load-balancer
[build-a-cd-pipeline]: build-a-continuous-deployment-pipeline.html
