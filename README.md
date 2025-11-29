# 🌍 Sentient Earth Oracle

An AI-powered platform that transforms user emotional states and real-time Earth data into personalized, actionable insights through a sophisticated multi-agent AI architecture.

**Built for:** AWS Global Vibe Hackathon 2025

## ✨ Features

- **Emotion Analysis**: Natural language processing of emotional text with multi-emotion detection
- **Real-Time Earth Data**: Weather, air quality, and natural events integration
- **AI-Powered Synthesis**: Poetic narratives connecting emotions and environment
- **Personalized Actions**: Contextual recommendations based on emotional and environmental state
- **Beautiful UI**: Responsive React interface with smooth animations

## 🏗️ Architecture

### Multi-Agent System
```
User Input → Emotion Analysis Agent ──┐
                                      ├──→ Synthesizer Agent → Action Generation Agent → Oracle Response
Location → Earth Data Agent ─────────┘
```

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript + PostgreSQL + Redis
- **AI**: OpenAI GPT-4 (or Amazon Bedrock Claude)
- **APIs**: OpenWeatherMap, IQAir, USGS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- OpenAI API key
- OpenWeatherMap API key
- IQAir API key (optional)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository>
cd sentient-earth-oracle
npm run install:all
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

3. **Set up database**
```bash
# Start PostgreSQL and Redis services
# Then run:
npm run db:migrate
npm run db:seed
```

4. **Start development servers**
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend  
npm run dev:frontend
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# Property-based tests
npm run test:properties
```

## 📁 Project Structure

```
sentient-earth-oracle/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── database/       # Database setup
│   │   └── __tests__/      # Unit tests
│   └── dist/               # Compiled JavaScript
├── agents/                  # AI agents
│   ├── emotionAnalysisAgent.ts
│   ├── earthDataAgent.ts
│   ├── synthesizerAgent.ts
│   └── actionGenerationAgent.ts
└── api/                    # API documentation
```

## 🔧 Configuration

### Environment Variables

**Required:**
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string  
- `OPENAI_API_KEY`: OpenAI API key
- `OPENWEATHER_API_KEY`: OpenWeatherMap API key
- `JWT_SECRET`: JWT signing secret

**Optional:**
- `IQAIR_API_KEY`: IQAir API key (fallback data used if not provided)
- `AWS_BEDROCK_REGION`: AWS region for Bedrock (alternative to OpenAI)
- `PORT`: Backend server port (default: 3001)

### Database Setup

The application uses PostgreSQL with the following tables:
- `users`: User accounts
- `sessions`: User sessions
- `oracle_responses`: Generated oracle responses

Run migrations to set up the schema:
```bash
npm run db:migrate
```

## 🎯 Usage

1. **Enter your emotions**: Describe how you're feeling in natural language
2. **Allow location access**: The app uses your location to gather environmental data
3. **Receive oracle wisdom**: Get a personalized response connecting your emotions to Earth's state
4. **Follow recommendations**: Act on the personalized suggestions provided

## 🧠 AI Agents

### 1. Emotion Analysis Agent
- Analyzes emotional text using GPT-4
- Detects 8 emotion categories with confidence scores
- Identifies primary/secondary emotions and intensity

### 2. Earth Data Agent  
- Fetches weather data from OpenWeatherMap
- Gets air quality from IQAir
- Monitors natural events (USGS integration planned)
- Interprets environmental conditions

### 3. Synthesizer Agent
- Combines emotional and environmental data
- Generates poetic narratives
- Calculates vibe scores (0-100)
- Creates meaningful insights

### 4. Action Generation Agent
- Provides 3-5 personalized recommendations
- Categories: physical, mindfulness, social, environmental
- Considers safety based on environmental conditions
- Includes time estimates and difficulty levels

## 🔒 Security

- JWT-based authentication
- Input validation with Joi
- SQL injection protection
- Rate limiting (planned)
- CORS configuration
- Helmet security headers

## 🚀 Deployment

### AWS Deployment (Recommended)

1. **Backend**: Deploy to AWS Lambda with API Gateway
2. **Frontend**: Deploy to S3 + CloudFront
3. **Database**: Use RDS PostgreSQL
4. **Cache**: Use ElastiCache Redis
5. **Secrets**: Store API keys in AWS Secrets Manager

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📊 Monitoring

- Application logs via Winston
- Health check endpoint: `/health`
- Error tracking and performance monitoring (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- AWS Global Vibe Hackathon 2025
- OpenAI for GPT-4 API
- OpenWeatherMap for weather data
- IQAir for air quality data
- React and Node.js communities

---

**Ready to connect with Earth's wisdom?** 🌍✨

Start the application and share your emotions to receive personalized insights from the Sentient Earth Oracle!