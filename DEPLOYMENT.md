# Deployment Guide

This guide covers deploying the Bookmark UI to AWS S3 using Terraform and GitHub Actions.

## Prerequisites

1. **AWS CLI** installed and configured
2. **Terraform** installed
3. **GitHub repository** with the code
4. **AWS credentials** with S3 permissions

## Setup Steps

### 1. Create S3 Bucket with Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `CLOUDFRONT_DISTRIBUTION_ID`: (Optional) If using CloudFront

### 3. AWS IAM User Setup

Create an IAM user with the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::bookmark-ui-frontend",
                "arn:aws:s3:::bookmark-ui-frontend/*"
            ]
        }
    ]
}
```

## Deployment Options

### Option 1: GitHub Actions (Recommended)

The pipeline automatically runs on push to `main` or `master` branch:

1. Push your code to GitHub
2. Check the Actions tab for deployment status
3. Your app will be available at: `http://bookmark-ui-frontend.s3-website-us-east-1.amazonaws.com`

### Option 2: Local Deployment

#### Windows:
```bash
scripts/deploy.bat
```

#### Linux/Mac:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Option 3: Manual Deployment

```bash
npm run build
aws s3 sync dist/ s3://bookmark-ui-frontend --delete
```

## Troubleshooting

### Common Issues:

1. **S3 Access Denied**: Check IAM permissions
2. **Build Failures**: Check Node.js version and dependencies
3. **Terraform Errors**: Verify AWS credentials and region

### Useful Commands:

```bash
# Check S3 bucket contents
aws s3 ls s3://bookmark-ui-frontend

# Test website endpoint
curl http://bookmark-ui-frontend.s3-website-us-east-1.amazonaws.com

# Destroy infrastructure (if needed)
cd terraform && terraform destroy
```

## Next Steps

Consider adding:
- CloudFront distribution for better performance
- Custom domain with Route 53
- SSL certificate with ACM
- Environment-specific deployments (staging/production)
