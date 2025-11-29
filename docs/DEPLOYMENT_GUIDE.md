# 🚀 Deploy in 3 Steps - Sentient Earth Oracle

## Quick Deployment Guide

### Step 1: Environment Setup (2 minutes)
```bash
# Clone and install
git clone [your-repo-url]
cd sentient-earth-oracle
npm run install:all

# Configure environment
cp .env.example .env
# Edit .env with your API keys:
# - GEMINI_API_KEY (required)
# - OPENWEATHER_API_KEY (required)
# - DATABASE_URL and REDIS_URL
```

### Step 2: Services & Database (3 minutes)
```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Setup database
npm run db:migrate
npm run db:seed
```

### Step 3: Launch Application (1 minute)
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Access at http://localhost:3000
```

**Total Setup Time: ~6 minutes**

---

## Production Deployment Options

### Option A: AWS (Recommended)
**Infrastructure:**
- **Frontend:** S3 + CloudFront
- **Backend:** Lambda + API Gateway
- **Database:** RDS PostgreSQL
- **Cache:** ElastiCache Redis
- **Secrets:** AWS Secrets Manager

**Deployment:**
```bash
# Build for production
npm run build

# Deploy with AWS CDK/Terraform
# (Infrastructure as Code templates available)
```

### Option B: Docker Compose
**Single-command deployment:**
```bash
docker-compose up --build
```

**Includes:**
- Application containers
- PostgreSQL database
- Redis cache
- Nginx reverse proxy

### Option C: Traditional VPS
**Requirements:**
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Nginx (optional)

**Commands:**
```bash
npm run build:backend
npm run build:frontend
npm start
```

---

## Environment Variables Reference

### Required Variables
```env
# AI Services
GEMINI_API_KEY=your_gemini_api_key

# External APIs  
OPENWEATHER_API_KEY=your_openweather_key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379

# Security
JWT_SECRET=your_random_secret_here
```

### Optional Variables
```env
# Alternative AI
AWS_BEDROCK_REGION=us-east-1

# Air Quality (fallback data if not provided)
IQAIR_API_KEY=your_iqair_key

# Server Configuration
PORT=3001
NODE_ENV=production
```

---

## Health Checks & Monitoring

### Verify Deployment
```bash
# Backend health
curl http://localhost:3001/health

# API test
curl -X POST http://localhost:3001/api/oracle/generate \
  -H "Content-Type: application/json" \
  -d '{"emotionalText":"I feel great","latitude":37.7749,"longitude":-122.4194}'
```

### Expected Responses
- **Health Check:** `{"status":"healthy","timestamp":"..."}`
- **Oracle API:** `{"success":true,"data":{...}}`

---

## Troubleshooting

### Common Issues
1. **Database Connection:** Verify PostgreSQL is running and credentials are correct
2. **Redis Connection:** Check Redis service status with `redis-cli ping`
3. **API Keys:** Ensure Gemini and OpenWeather keys are valid
4. **Port Conflicts:** Default ports 3000 (frontend) and 3001 (backend)

### Quick Fixes
```bash
# Reset database
npm run db:migrate

# Clear Redis cache
redis-cli FLUSHALL

# Restart services
docker-compose restart
```

---

## Performance Optimization

### Production Settings
- **Node.js:** Use PM2 for process management
- **Database:** Enable connection pooling
- **Redis:** Configure memory limits
- **Frontend:** Enable gzip compression

### Scaling Considerations
- **Horizontal:** Load balance multiple backend instances
- **Vertical:** Increase server resources for AI processing
- **Caching:** Extend Redis cache duration for stable data
- **CDN:** Serve static assets globally

---

## Security Checklist

### Pre-Deployment
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API keys have appropriate permissions
- [ ] CORS configured for production domains
- [ ] SSL/TLS certificates installed
- [ ] Security headers enabled

### Post-Deployment
- [ ] Health checks responding
- [ ] Error logging configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts set up
- [ ] Performance metrics tracked

---

## Support & Maintenance

### Monitoring Endpoints
- **Health:** `/health`
- **Metrics:** `/metrics` (if implemented)
- **Status:** Check application logs

### Backup Strategy
- **Database:** Daily PostgreSQL backups
- **Redis:** Periodic snapshots for session data
- **Code:** Git repository with tagged releases

### Update Process
1. Test in staging environment
2. Create database backup
3. Deploy new version
4. Verify health checks
5. Monitor error rates

---

**🎉 Congratulations! Your Sentient Earth Oracle is now live and ready to connect emotions with the cosmos!**

**Need help?** Check the troubleshooting guide or review the comprehensive documentation in `/docs/`.