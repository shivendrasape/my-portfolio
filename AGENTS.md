# Agent Guidelines: AWS Cloud Portfolio Website

## Project Goal & Purpose
The primary purpose of this project is to build and ship a modern, high-performance **Developer Portfolio Website** hosted on AWS (Amplify Hosting / S3 + CloudFront CDN) in 10 minutes or less, utilizing **Antigravity IDE** and **AWS MCP Tools**.

## Operational Reference
- **Deployments & Commands**: See [README.md](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/README.md).
- **Core Concepts & Theory**: See [docs/](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/) and [docs/04-architectural-decisions-and-comparisons.md](file:///Users/shivendrag/Downloads/My%20Projects/my-portfolio/docs/04-architectural-decisions-and-comparisons.md).

## Architecture & Code Standards
- **Frontend Stack**: Modern semantic HTML5, CSS3 (curated design tokens, responsive glassmorphism, dark mode), and lightweight vanilla JavaScript.
- **AWS Hosting**: Deployable via AWS Amplify Hosting or Amazon S3 + CloudFront (with Origin Access Control and HTTPS).
- **Performance & SEO**: Semantic tags, accessible landmarks, OpenGraph meta tags, 100/100 Lighthouse target, fast Core Web Vitals.
- **Version Control**: Clean git commits, modular structure, assets organized cleanly.

## AWS MCP Tool Usage
Always leverage the configured `aws-mcp` server (`.agents/mcp_config.json` via `mcp-proxy-for-aws`):
1. **Cloud Verification & Execution**: Use `aws___run_script` for executing AWS deployment and management tasks.
2. **Docs & Guidance**: Use `aws___search_documentation` and `aws___read_documentation` for authoritative AWS service configurations.
3. **Best Practices**: Query `aws___retrieve_skill` and `aws___get_tasks` for architecture recommendations.
4. **Regions & Status**: Use `aws___list_regions` and `aws___get_regional_availability` to confirm service support.

## Essential Commands
- Local Dev Server: `npx serve .` or `python3 -m http.server 3000`
- Check AWS Identity: `aws sts get-caller-identity`
- S3 Sync Deploy: `aws s3 sync . s3://<bucket-name> --delete`
- CloudFront Invalidation: `aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"`
- Amplify Deploy: `aws amplify create-app` or AWS Amplify Console
