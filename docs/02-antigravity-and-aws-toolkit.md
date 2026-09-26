# 02 - Antigravity IDE & AWS Toolkit

> **Executive Summary**: While the original AWS Builder tutorial references Kiro, this project uses **Google Antigravity IDE** paired with the **AWS MCP (Model Context Protocol) Suite** to generate, validate, and deploy cloud infrastructure autonomously.

---

## 1. Comparing Environments: Antigravity IDE vs. Kiro

| Capability | AWS Builder Center Guide (Kiro) | Antigravity IDE (This Project) |
| :--- | :--- | :--- |
| **Agent Core** | Kiro Agent Architecture | Antigravity AI Pair Programmer |
| **MCP Integration** | `.kiro/settings/mcp.json` | Project-scoped `.agents/mcp_config.json` |
| **Authentication** | AWS CLI local credentials via proxy | AWS CLI local credentials via `mcp-proxy-for-aws` |
| **Workspace Control** | Chat interface + workspace files | Direct tool calls (`write_to_file`, `run_command`, etc.) |
| **Documentation Access** | Embedded editor links | Real-time `aws___search_documentation` MCP queries |

---

## 2. Tooling Architecture: How Antigravity Talks to AWS

```
┌────────────────────────────────────────────────────────┐
│                   Antigravity IDE                      │
│   (Agent reasoning, code synthesis & file creation)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Stdio JSON-RPC (MCP)
                           ▼
┌────────────────────────────────────────────────────────┐
│       uvx mcp-proxy-for-aws (Local FastMCP Proxy)       │
│  - Signs requests with local AWS CLI credentials (SigV4)│
│  - Endpoint: https://aws-mcp.us-east-1.api.aws/mcp      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS (SigV4 Signed)
                           ▼
┌────────────────────────────────────────────────────────┐
│            Official AWS MCP Server Backend             │
│  - Documentation search & skills retrieval             │
│  - Cloud resource inspection & execution tooling       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Project Configuration: `.agents/mcp_config.json`

Antigravity automatically discovers and loads MCP servers defined in the workspace root at `.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "aws-mcp": {
      "command": "uvx",
      "args": [
        "mcp-proxy-for-aws",
        "https://aws-mcp.us-east-1.api.aws/mcp"
      ]
    }
  }
}
```

### Key Parameters:
- **`command`**: Uses `uvx` (from the Astral `uv` toolchain) to run the official AWS proxy in an isolated, fast Python virtual environment with zero dependency conflicts.
- **`args`**: Targets the regional SigV4 endpoint (`https://aws-mcp.us-east-1.api.aws/mcp`), which signs requests using the user's active AWS credentials in `~/.aws/credentials` or `~/.aws/config`.

---

## 4. Available AWS MCP Tools

When working with Antigravity on AWS tasks, the following tools are available:

1. **`aws___run_script`**: Runs AWS CLI commands or scripts within a secure sandbox and returns stdout/stderr.
2. **`aws___search_documentation` & `aws___read_documentation`**: Searches official AWS documentation chunks directly to verify up-to-date syntax, API parameters, and best practices.
3. **`aws___retrieve_skill`**: Retrieves curated AWS solution architect skills and architectural patterns.
4. **`aws___list_regions` & `aws___get_regional_availability`**: Dynamically checks feature and service availability across all global AWS regions.
5. **`aws___get_presigned_url`**: Generates pre-signed S3 URLs for asset transfers without exposing credentials.
