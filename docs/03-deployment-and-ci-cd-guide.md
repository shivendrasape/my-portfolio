# 03 - Deployment & CI/CD Guide

This guide provides practical, step-by-step instructions to ship the portfolio website to AWS using either **AWS Amplify Hosting** (the 10-minute path) or **Amazon S3 + Amazon CloudFront** (the IaC path).

---

## Path A: Deploy via AWS Amplify Hosting (10 Minutes)

### Method 1: AWS Amplify Console (Zero-CLI Path)
1. Log in to the [AWS Management Console](https://console.aws.amazon.com/amplify).
2. Click **Host a web app**.
3. Choose your deployment source:
   - **Deploy without Git**: Drag and drop a `.zip` archive containing your site (`index.html`, `style.css`, assets). Amplify immediately provisions a live HTTPS URL (e.g., `https://main.d123456789.amplifyapp.com`).
   - **GitHub / GitLab**: Connect your repository and select the `main` branch. Amplify sets up continuous deployment triggers automatically.
4. Click **Save and Deploy**. Your site goes live across global edge locations within 2–3 minutes.

### Method 2: AWS CLI Automated Deployment
You can deploy directly from your terminal using the AWS CLI:

```bash
# 1. Zip website files
zip -r website.zip index.html style.css script.js assets/

# 2. Create Amplify App
APP_ID=$(aws amplify create-app --name "my-developer-portfolio" --query "app.appId" --output text)

# 3. Create Branch
aws amplify create-branch --app-id "$APP_ID" --branch-name main

# 4. Generate deployment upload URL & deploy
DEPLOY_URL=$(aws amplify create-deployment --app-id "$APP_ID" --branch-name main --query "zipUploadUrl" --output text)
curl -X PUT -T website.zip "$DEPLOY_URL"
aws amplify start-deployment --app-id "$APP_ID" --branch-name main --job-id 1
```

---

## Path B: Deploy via Amazon S3 + CloudFront (Full Infrastructure Path)

For full control using S3 private storage and CloudFront CDN:

### 1. Create S3 Bucket (Private)
```bash
BUCKET_NAME="my-portfolio-$(aws sts get-caller-identity --query 'Account' --output text)"

aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region us-east-1

# Ensure Block Public Access is active
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. Upload Website Files
```bash
aws s3 sync . s3://"$BUCKET_NAME"/ \
  --exclude ".git/*" \
  --exclude ".agents/*" \
  --exclude "docs/*" \
  --exclude "AGENTS.md" \
  --exclude "README.md" \
  --delete
```

### 3. Invalidate CloudFront Cache After Updates
Whenever you update your HTML, CSS, or JS, invalidate the edge cache so visitors immediately see new changes:

```bash
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"
```

---

## 4. Custom Domain Setup (Route 53 & ACM)

1. **Request Certificate**: Request a public certificate in AWS Certificate Manager in `us-east-1` (required for CloudFront / Amplify).
2. **Domain Mapping**:
   - In **Amplify**: Go to **App Settings → Domain Management → Add Domain**.
   - In **Route 53**: Create an **A Record** with **Alias = Yes**, targeting your CloudFront distribution or Amplify domain.
