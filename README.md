# AWS Cloud Developer Portfolio

A sleek, responsive, and high-performance developer portfolio website designed to be built and deployed on **AWS in 10 minutes or less**. This project is adapted from the AWS Builder Center guide (*"Ship a portfolio website in 10 minutes or less"*), tailored specifically for **Antigravity IDE** and the **AWS MCP (Model Context Protocol) Suite**.

> 📖 **Looking for architectural notes & learning guides?** Check the [Learning Guides (`docs/`)](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/) for in-depth explanations on AWS hosting options, CloudFront OAC security, and Antigravity tooling.

---

## Quick Navigation
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Deployment Options](#deployment-options)
  - [Option A: AWS Amplify Hosting (Recommended / 10 Minutes)](#option-a-aws-amplify-hosting-recommended)
  - [Option B: Amazon S3 + CloudFront CDN](#option-b-amazon-s3--cloudfront-cdn)
- [Useful Commands](#useful-commands)
- [Learning Guides (`docs/`)](#learning-guides-docs)

---

## Prerequisites

1. **AWS CLI (v2)** authenticated with your AWS account:
   ```bash
   aws sts get-caller-identity
   ```
2. **`uv` Package Manager** (for running the AWS MCP proxy):
   ```bash
   uv --version
   ```
3. **Local HTTP Server** (any tool such as Python or Node):
   ```bash
   python3 -m http.server 3000
   ```

---

## Project Structure

```
my-portfolio/
├── docs/                                # In-depth architectural & deployment guides
│   ├── 01-portfolio-architecture-and-aws-hosting.md # S3, CloudFront & Amplify hosting models
│   ├── 02-antigravity-and-aws-toolkit.md            # Antigravity IDE & AWS MCP proxy integration
│   ├── 03-deployment-and-ci-cd-guide.md             # Production shipping & domain configuration
│   └── 04-architectural-decisions-and-comparisons.md # ADRs, cost analysis, and comparisons
├── .agents/
│   └── mcp_config.json                  # AWS MCP proxy configuration for Antigravity
├── AGENTS.md                            # Guidelines for AI coding agents (< 50 lines)
├── README.md                            # Main project operational guide (this file)
├── index.html                           # Portfolio website markup
├── style.css                            # Modern styling & design system tokens
└── script.js                            # Interactive client-side logic
```

---

## Local Development

Start a lightweight local server to preview your portfolio in the browser:

```bash
# Using Python 3
python3 -m http.server 3000

# Or using npx serve
npx serve .
```

Open `http://localhost:3000` to preview the site.

---

## Deployment Options

### Option A: AWS Amplify Hosting (Recommended)

1. **Create an Archive**:
   ```bash
   zip -r portfolio.zip index.html style.css script.js assets/
   ```
2. **Deploy via AWS Amplify Console**:
   - Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify).
   - Select **Deploy without Git**, drag and drop `portfolio.zip`, and hit **Save and Deploy**.
   - Your site is live with a global HTTPS URL in under 2 minutes.

### Option B: Amazon S3 + CloudFront CDN

For enterprise-grade infrastructure with full control:

1. **Sync to S3 Bucket**:
   ```bash
   aws s3 sync . s3://<your-portfolio-bucket-name>/ \
     --exclude ".git/*" \
     --exclude ".agents/*" \
     --exclude "docs/*" \
     --exclude "*.md" \
     --delete
   ```
2. **Invalidate CloudFront Edge Cache**:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id <YOUR_DISTRIBUTION_ID> \
     --paths "/*"
   ```

---

## Useful Commands

| Command | Purpose |
| :--- | :--- |
| `python3 -m http.server 3000` | Start local development server |
| `aws sts get-caller-identity` | Verify active AWS credentials |
| `aws amplify list-apps` | List deployed AWS Amplify applications |
| `aws s3 sync . s3://<bucket>` | Sync static files to private S3 bucket |
| `aws cloudfront list-distributions` | Inspect CloudFront CDN edge distributions |

---

## Learning Guides (`docs/`)

Explore the detailed architecture guides in [`docs/`](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/):
- [01 - Portfolio Architecture & AWS Hosting](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/01-portfolio-architecture-and-aws-hosting.md)
- [02 - Antigravity IDE & AWS Toolkit](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/02-antigravity-and-aws-toolkit.md)
- [03 - Deployment & CI/CD Guide](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/03-deployment-and-ci-cd-guide.md)
- [04 - Architectural Decisions & Comparisons](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/04-architectural-decisions-and-comparisons.md)
