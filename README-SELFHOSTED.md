# LanOnasis Documentation - 100% Self-Hosted Solution

## 🎯 Overview

A beautiful, searchable, and interactive documentation site for LanOnasis Memory Service - completely self-hosted with **ZERO external dependencies**.

## ✅ What We've Eliminated

- ❌ ~~Vercel/Netlify~~ → ✅ Docker + Nginx
- ❌ ~~Algolia Search~~ → ✅ MeiliSearch (self-hosted)
- ❌ ~~Google Analytics~~ → ✅ Plausible (self-hosted)
- ❌ ~~GitHub Pages~~ → ✅ Gitea (self-hosted)
- ❌ ~~External CDNs~~ → ✅ Local hosting

## 🚀 Quick Start

### Development Mode

```bash
# Install dependencies
bun install

# Start development server
bun run start

# View at http://localhost:3000
```

### Production Deployment (All Self-Hosted)

```bash
# Deploy entire stack with one command
./deploy.sh

# Services will be available at:
# - Documentation: http://localhost:3000
# - Search Engine: http://localhost:7700
# - Analytics: http://localhost:8000
# - Git Server: http://localhost:3001
```

## 📦 Stack Components

| Component | Purpose | Self-Hosted Alternative |
|-----------|---------|------------------------|
| **Docusaurus 3.0** | Documentation Framework | React-based, runs anywhere |
| **MeiliSearch** | Search Engine | Lightning-fast, <50ms response |
| **Plausible** | Analytics | Privacy-first, GDPR compliant |
| **Gitea** | Git Server | GitHub alternative |
| **Nginx** | Web Server | Production-grade serving |
| **Docker** | Containerization | Consistent deployment |

## 🛠️ Available Commands

```bash
# Development
bun run start          # Start dev server
bun run build          # Build for production
bun run serve          # Preview production build

# Deployment
./deploy.sh            # Deploy full stack
./monitor.sh           # Check health status

# Docker
docker-compose up -d   # Start all services
docker-compose down    # Stop all services
docker-compose logs    # View logs
```

## 📁 Project Structure

```
docs-LanOnasis/
├── docs/              # Documentation content
│   ├── intro.md       # Landing page
│   ├── api/           # API documentation
│   ├── sdks/          # SDK guides
│   └── getting-started/ # Quick start guides
├── src/
│   ├── css/          # Custom styling (Warp-like theme)
│   └── components/   # React components
├── static/           # Static assets
├── docker-compose.yml # Complete stack configuration
├── Dockerfile        # Documentation container
├── deploy.sh         # One-click deployment
└── monitor.sh        # Health monitoring
```

## 🎨 Features

- **Beautiful Warp-like Design** - Clean, modern interface
- **Instant Search** - MeiliSearch provides <50ms search
- **Multi-language Support** - i18n ready (en, es, fr, de)
- **Interactive API Explorer** - Test APIs directly in docs
- **Version Control** - Built-in with Gitea
- **Analytics** - Privacy-first with Plausible
- **Dark Mode** - Automatic theme switching
- **Mobile Responsive** - Works on all devices

## 💰 Cost Analysis

### Previous External Dependencies
- Vercel: $20/month
- Algolia: $50/month
- Analytics: $9/month
- **Total**: $79/month + vendor lock-in

### Current Self-Hosted Solution
- Software: $0 (all open source)
- Infrastructure: ~$20/month (or use existing)
- **Total**: $0-20/month with complete control

## 🔧 Configuration

### Update URLs

Edit `docusaurus.config.ts`:
```javascript
url: 'http://docs.yourdomain.com',
baseUrl: '/',
```

### Customize Theme

Edit `src/css/custom.css` for colors and styling.

### Add Content

1. Add markdown files to `docs/` directory
2. Include frontmatter:
```markdown
---
title: Page Title
sidebar_position: 1
---
```

## 📊 Monitoring

Check health status anytime:
```bash
./monitor.sh
```

Output:
```
✅ Documentation Site: Running
✅ Search Engine: Healthy
✅ Analytics: Active
✅ Git Server: Running
```

## 🚨 Troubleshooting

### Port Conflicts
```bash
# Check what's using ports
lsof -i :3000  # Documentation
lsof -i :7700  # MeiliSearch
lsof -i :8000  # Analytics
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

## 📈 Next Steps

1. **Custom Domain**: Update nginx configuration for your domain
2. **SSL Certificates**: Add Let's Encrypt for HTTPS
3. **Backup Strategy**: Set up automated backups
4. **CI/CD**: Configure Drone CI for automated deployments
5. **Monitoring**: Add Prometheus/Grafana for metrics

## 📝 License

MIT - Use freely for your documentation needs.

---

**Built with ❤️ by the LanOnasis team - 100% self-hosted, no compromises!**
