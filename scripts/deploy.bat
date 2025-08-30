@echo off
echo 🚀 Starting deployment process...

REM Build the application
echo 📦 Building application...
call npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed - dist directory not found
    exit /b 1
)

echo ✅ Build completed successfully

REM Deploy to S3
echo ☁️ Deploying to S3...
aws s3 sync dist/ s3://bookmark-ui-frontend --delete

echo ✅ Deployment completed successfully!
echo 🌐 Your application is available at: http://bookmark-ui-frontend.s3-website.ap-south-1.amazonaws.com

REM Optional: Invalidate CloudFront cache if using CloudFront
if defined CLOUDFRONT_DISTRIBUTION_ID (
    echo 🔄 Invalidating CloudFront cache...
    aws cloudfront create-invalidation --distribution-id %CLOUDFRONT_DISTRIBUTION_ID% --paths "/*"
    echo ✅ CloudFront cache invalidated
)

pause
