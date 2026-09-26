# 04 - Architectural Decisions & System Comparisons

This document captures the key architectural decisions, trade-offs, and platform comparisons for building and hosting a developer portfolio website on AWS.

---

## 1. Hosting Platform Decision Matrix

| Metric / Consideration | AWS Amplify Hosting | Amazon S3 + CloudFront (OAC) | Vercel / Netlify | GitHub Pages |
| :--- | :--- | :--- | :--- | :--- |
| **AWS Ecosystem Native** | ✅ High (Part of AWS console & IAM) | ✅ Maximum (Direct AWS resources) | ❌ Third-party SaaS | ❌ Third-party SaaS |
| **Setup Time** | ~5 minutes | ~15 minutes | ~3 minutes | ~5 minutes |
| **Custom Domain & SSL** | Free automated SSL via ACM | Free automated SSL via ACM | Free automated SSL (Let's Encrypt)| Free automated SSL |
| **DDoS Protection** | AWS Shield Standard (included) | AWS Shield Standard + WAF option | Cloudflare / Proprietary | Basic DDoS |
| **Edge Network** | Amazon CloudFront (450+ PoPs) | Amazon CloudFront (450+ PoPs) | Global Edge Network | Fastly CDN |
| **Dynamic Capabilities** | SSR (Next.js), Serverless APIs | Requires API Gateway / Lambda | Edge functions, SSR | Strictly static only |
| **AWS Learning Value** | ⭐⭐⭐⭐ (PaaS cloud operations) | ⭐⭐⭐⭐⭐ (IaC, CDN, IAM, OAC) | ⭐ (Platform abstraction) | ⭐ (Git hosting only) |

---

## 2. Decision Record: S3 Website vs. S3 + CloudFront (OAC)

### Context
When hosting static websites on Amazon S3, AWS previously supported "Static Website Hosting" directly on public S3 buckets.

### Decision
**We strictly reject public S3 website hosting in favor of private S3 with CloudFront Origin Access Control (OAC).**

### Rationale
1. **Security & Compliance**: Public S3 buckets trigger security posture warnings (AWS Security Hub, AWS Config). OAC keeps the S3 bucket 100% private, accessible solely via signed CloudFront requests.
2. **Protocol Modernity**: S3 public website endpoints only support HTTP for custom domains. CloudFront provides end-to-end TLS 1.3 with custom domain certificates.
3. **Global Performance**: CloudFront caches static HTML/CSS/JS at global edge points of presence (PoPs), reducing latency from 200–500ms (direct regional S3) down to 10–30ms.

---

## 3. Cost & Free Tier Analysis

Static portfolio websites hosted on AWS have exceptionally low operating costs and fit comfortably within the **AWS Free Tier**:

| Service | Free Tier Allowance | Typical Portfolio Usage | Estimated Monthly Cost |
| :--- | :--- | :--- | :--- |
| **AWS Amplify Hosting** | 1,000 build minutes/month, 15 GB served/month | < 100 build minutes, < 2 GB served | **$0.00 / month** |
| **Amazon S3** | 5 GB standard storage, 20,000 GET requests | < 20 MB storage, < 5,000 GETs | **$0.00 / month** |
| **Amazon CloudFront** | 1 TB data transfer out, 10M HTTP/HTTPS requests | < 2 GB transfer, < 50,000 requests | **$0.00 / month** (Always Free) |
| **AWS Certificate Manager** | Unlimited public certificates | 1 custom domain certificate | **$0.00 / month** |
| **Route 53 (Optional)** | None (pay per hosted zone) | 1 hosted zone | **$0.50 / month** |

*Conclusion*: Running your portfolio on AWS costs **$0.00/month** (or ~$0.50/month if using a custom Route 53 domain).

---

## 4. Frontend Architecture: Vanilla Web Stack vs. Heavy Frameworks

### Decision
For a fast, reliable personal portfolio, we utilize **semantic HTML5, modern CSS3 (with CSS Custom Properties & responsive design), and vanilla JavaScript**.

### Key Advantages:
- **Zero Build Step**: Files can be deployed instantly to S3 or Amplify without running bundlers or transpilation.
- **Fastest First Contentful Paint (FCP)**: Near-instant page loads (no 500KB+ React/Vue runtime bundle).
- **Zero Maintenance / Long-Term Durability**: Vanilla web standards do not suffer from breaking dependency updates or framework obsolescence.
- **100/100 Lighthouse Score**: Effortless achievement of perfect performance, accessibility, best practices, and SEO scores.
