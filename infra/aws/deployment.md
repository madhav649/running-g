# AWS Deployment Blueprint

1. **Networking**
   - Create VPC across 3 AZs, public subnets for ALB, private subnets for ECS/RDS/ElastiCache.
2. **Containers**
   - Deploy backend to ECS Fargate with autoscaling on CPU + request count.
   - Serve frontend via S3 + CloudFront for low-latency static assets.
3. **Data**
   - RDS PostgreSQL with PostGIS extension enabled.
   - ElastiCache Redis for socket session fanout, cache, and BullMQ queues.
4. **Realtime Scale**
   - Socket.io with Redis adapter and sticky sessions through ALB.
   - Use regional shards by city slug as traffic grows.
5. **Security**
   - Store JWT/OAuth secrets in AWS Secrets Manager.
   - WAF rules for auth abuse and DDoS protections.
   - Use Cognito or Auth0 for OAuth broker integration.
6. **Observability**
   - CloudWatch logs + metrics and OpenTelemetry traces.
   - Alerts for queue latency, capture fraud spikes, and websocket disconnect rate.
7. **CI/CD**
   - GitHub Actions: test -> build -> image push to ECR -> deploy with CDK or Terraform.
