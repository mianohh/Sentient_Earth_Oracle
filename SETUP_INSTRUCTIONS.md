# 🚀 Sentient Earth Oracle - Setup Instructions

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** and npm
- **PostgreSQL 14+** 
- **Redis 6+**
- **Git**

## API Keys Required

You'll need these API keys:

1. **OpenAI API Key** - Get from https://platform.openai.com/api-keys
2. **OpenWeatherMap API Key** - Get from https://openweathermap.org/api
3. **IQAir API Key** (optional) - Get from https://www.iqair.com/air-pollution-data-api

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd sentient-earth-oracle

# Install all dependencies
npm run install:all
```

### 2. Database Setup

**Option A: Local PostgreSQL & Redis**
```bash
# Install PostgreSQL and Redis locally
# On macOS with Homebrew:
brew install postgresql redis

# Start services
brew services start postgresql
brew services start redis

# Create database
createdb sentient_earth_oracle
```

**Option B: Docker (Easier)**
```bash
# Start PostgreSQL and Redis with Docker
docker-compose up postgres redis -d
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values:
nano .env
```

**Required .env values:**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/sentient_earth_oracle
REDIS_URL=redis://localhost:6379

# AI Services  
OPENAI_API_KEY=your_openai_key_here

# External APIs
OPENWEATHER_API_KEY=your_openweather_key_here
IQAIR_API_KEY=your_iqair_key_here

# Server
PORT=3001
NODE_ENV=development
JWT_SECRET=your_random_secret_here

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Database Migration

```bash
# Run database migrations
npm run db:migrate

# Seed with test data (optional)
npm run db:seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### 6. Verify Setup

1. **Backend Health Check**: Visit http://localhost:3001/health
2. **Frontend**: Visit http://localhost:3000
3. **Test Oracle**: Enter emotions and check if you get a response

## Testing the Application

### Run Tests
```bash
# All tests
npm run test:all

# Backend only
npm run test:backend

# Frontend only  
npm run test:frontend
```

### Manual Testing
1. Open http://localhost:3000
2. Enter emotional text (minimum 10 characters)
3. Allow location access when prompted
4. Wait for oracle response (may take 10-30 seconds)
5. Verify all sections appear: emotions, earth data, narrative, insights, actions

## Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string in .env
# Ensure database exists
```

**2. Redis Connection Error**
```bash
# Check if Redis is running
redis-cli ping

# Should return "PONG"
```

**3. OpenAI API Error**
```bash
# Verify API key is correct
# Check OpenAI account has credits
# Test with curl:
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.openai.com/v1/models
```

**4. Location Access Denied**
```bash
# Use HTTPS in production
# For development, manually enter coordinates in browser console:
# navigator.geolocation.getCurrentPosition = (success) => success({coords: {latitude: 37.7749, longitude: -122.4194}})
```

**5. CORS Errors**
```bash
# Check frontend is running on port 3000
# Check backend CORS configuration
# Verify REACT_APP_API_URL in .env
```

### Performance Issues

**Slow Oracle Response:**
- Check internet connection
- Verify all API keys are working
- Monitor backend logs for errors
- Consider using fallback data for development

**High Memory Usage:**
- Restart Redis: `redis-cli FLUSHALL`
- Check for memory leaks in logs
- Reduce concurrent requests

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
REDIS_URL=your_production_redis_url
# Add all other production values
```

### Build for Production
```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

### AWS Deployment (Recommended)
1. Deploy backend to AWS Lambda + API Gateway
2. Deploy frontend to S3 + CloudFront
3. Use RDS PostgreSQL and ElastiCache Redis
4. Store secrets in AWS Secrets Manager

## Development Tips

### Hot Reloading
Both frontend and backend support hot reloading during development.

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test oracle generation
curl -X POST http://localhost:3001/api/oracle/generate \
  -H "Content-Type: application/json" \
  -d '{"emotionalText":"I feel anxious","latitude":37.7749,"longitude":-122.4194}'
```

### Database Inspection
```bash
# Connect to database
psql postgresql://postgres:password@localhost:5432/sentient_earth_oracle

# View tables
\dt

# View oracle responses
SELECT id, vibe_score, created_at FROM oracle_responses;
```

## Getting Help

1. **Check logs**: Backend logs show detailed error information
2. **Review README.md**: Contains architecture and feature details  
3. **Test with minimal data**: Use simple emotional text first
4. **Verify API keys**: Ensure all external services are accessible

## Success Checklist

- [ ] All dependencies installed
- [ ] Database and Redis running
- [ ] Environment variables configured
- [ ] Database migrated successfully
- [ ] Backend starts without errors (port 3001)
- [ ] Frontend starts without errors (port 3000)
- [ ] Can generate oracle response
- [ ] All response sections display correctly
- [ ] Tests pass

**Ready to connect emotions with Earth's wisdom!** 🌍✨