#!/bin/bash

# Build and Deploy Script for Bookmark UI

set -e

echo "🚀 Starting deployment process..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to S3
echo "☁️ Deploying to S3..."
aws s3 sync dist/ s3://bookmark-ui-frontend --delete

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is available at: http://bookmark-ui-frontend.s3-website.ap-south-1.amazonaws.com"

# Optional: Invalidate CloudFront cache if using CloudFront
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
    echo "✅ CloudFront cache invalidated"
fi
