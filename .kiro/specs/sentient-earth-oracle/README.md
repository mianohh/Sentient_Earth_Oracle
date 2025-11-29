# Sentient Earth Oracle - Project Specification

## 🌍 Project Overview

**Sentient Earth Oracle** is an AI-powered platform that transforms user emotional states and real-time Earth data into personalized, actionable insights. The system creates meaningful connections between human emotions and environmental conditions through a sophisticated multi-agent AI architecture.

**Built for:** AWS Global Vibe Hackathon 2025

## ✨ Core Features

### 1. Emotion Analysis
- Natural language processing of emotional text input
- Multi-emotion detection with confidence scores
- Classification into 8 emotion categories (joy, sadness, anxiety, calm, anger, hope, fear, neutral)
- Intensity ranking and primary/secondary emotion identification

### 2. Real-Time Earth Data Integration
- Current weather conditions by location
- Air Quality Index (AQI) monitoring
- Natural events detection within 100-mile radius
- Smart caching for performance

### 3. AI-Powered Synthesis
- Poetic narrative generation connecting emotions and environment
- Vibe Score calculation (0-100) measuring emotional-environmental alignment
- Meaningful insights and connections
- Contrast exploration when emotions and environment diverge

### 4. Personalized Action Recommendations
- 3-5 contextual, actionable recommendations
- Categorized by type (physical, mindfulness, social, environmental)
- Time estimates and difficulty levels
- Safety-focused actions for hazardous conditions

### 5. User Experience
- Beautiful, intuitive web interface
- Smooth animations and progressive content reveal
- Response history tracking
- Shareable Oracle Responses with privacy protection
- Responsive design (desktop, tablet, mobile)

## 🏗️ Architecture

### Multi-Agent System

```
User Input → Emotion Analysis Engine ──┐
                                       ├──→ Synthesizer Agent → Action Generation Agent → Oracle Response
Location → Earth-Data Analysis Engine ─┘
```

**Four Specialized AI Agents:**

1. **Emotion Analysis Engine**: Analyzes emotional content using GPT-4/Claude
2. **Earth-Data Analysis Engine**: Fetches and interprets environmental data
3. **Synthesizer Agent**: Combines insights into coherent narratives
4. **Action Generation Agent**: Creates personalized recommendations

### Technology Stack

**Frontend:**
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API communication

**Backend:**
- Node.js with Express
- TypeScript for type safety
- PostgreSQL for data persistence
- Redis for caching and sessions

**AI/ML:**
- OpenAI GPT-4 or Amazon Bedrock (Claude)
- Custom prompt engineering for each agent

**External APIs:**
- OpenWeatherMap (weather data)
- IQAir (air quality)
- USGS (natural events)

**AWS Services:**
- Lambda (serverless agents)
- API Gateway (REST endpoints)
- RDS PostgreSQL (database)
- ElastiCache Redis (caching)
- S3 + CloudFront (static assets)
- CloudWatch (monitoring)
- Secrets Manager (API keys)

## 📋 Specification Documents

This project follows a **spec-driven development** approach using Kiro:

### 1. [requirements.md](./requirements.md)
- 15 detailed requirements with user stories
- 75+ acceptance criteria in EARS format
- Complete glossary of terms
- Testable, unambiguous specifications

### 2. [design.md](./design.md)
- Comprehensive system architecture
- Component interfaces and data models
- 31 correctness properties for testing
- Error handling strategy
- Testing strategy (unit + property-based)
- AWS integration details
- Performance and security considerations

### 3. [tasks.md](./tasks.md)
- 34 implementation tasks with sub-tasks
- Incremental, testable progress
- Property-based test tasks linked to design
- Checkpoint tasks for verification
- Clear requirements traceability

### 4. [hackathon-tools-guide.md](./hackathon-tools-guide.md)
- How to use Amazon Q Developer for code generation
- How to use Kiro for spec-driven development
- Combined workflow examples
- Time savings estimates
- Hackathon strategy and timeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis 6+
- OpenAI API key or AWS Bedrock access
- Weather API key (OpenWeatherMap)
- Air Quality API key (IQAir)

### Development Setup

1. **Clone and Install**
```bash
git clone <repository>
cd sentient-earth-oracle
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your API keys and database credentials
```

3. **Database Setup**
```bash
npm run db:migrate
npm run db:seed
```

4. **Start Development Servers**
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Redis (if not running as service)
redis-server
```

5. **Run Tests**
```bash
# Unit tests
npm test

# Property-based tests
npm run test:properties

# All tests
npm run test:all
```

### Using Kiro for Implementation

1. **Open the tasks file**: `.kiro/specs/sentient-earth-oracle/tasks.md`
2. **Click "Start task"** next to the task you want to implement
3. **Follow Kiro's guidance** to implement the task
4. **Run tests** to verify correctness
5. **Move to next task** after completion

### Using Amazon Q Developer

1. **Code Generation**: Ask Q to generate components, endpoints, or utilities
2. **Debugging**: Share error messages for analysis and fixes
3. **Refactoring**: Request optimization suggestions
4. **Testing**: Generate test scaffolding and fixtures

## 🧪 Testing Strategy

### Unit Tests (Jest)
- Input validation
- Data transformations
- API endpoint logic
- Error handling
- Authentication flows

### Property-Based Tests (fast-check)
- 31 correctness properties from design
- 100+ iterations per property
- Smart generators for test data
- Validates universal behaviors

### Integration Tests
- End-to-end user flows
- Agent coordination
- External API integration
- Database operations

## 📊 Project Status

**Current Phase:** Specification Complete ✅

**Next Steps:**
1. Set up project structure (Task 1)
2. Implement data models (Task 2)
3. Set up database (Task 3)
4. Begin agent implementation (Tasks 6-9)

## 🎯 Hackathon Goals

### Minimum Viable Product (MVP)
- ✅ Complete specification
- ⏳ Working emotion analysis
- ⏳ Earth data integration
- ⏳ Basic synthesis and actions
- ⏳ Simple web interface
- ⏳ Core functionality deployed

### Stretch Goals
- Voice input for emotions
- Advanced visualizations
- Mobile app
- Community features
- Gamification elements

## 📈 Development Timeline

**Day 1:** Foundation (setup, models, database, auth)
**Day 2:** Core Features (all four AI agents, orchestrator)
**Day 3:** Frontend & Integration (React UI, testing, AWS deployment)
**Day 4:** Polish & Demo (bug fixes, optimization, presentation)

## 🏆 Why This Will Win

1. **Novel Concept**: Unique connection between emotions and Earth data
2. **Technical Excellence**: Multi-agent AI system with comprehensive testing
3. **Spec-Driven Quality**: Systematic development with correctness properties
4. **AWS Integration**: Full use of AWS services and best practices
5. **User Experience**: Beautiful, intuitive interface with meaningful insights
6. **Completeness**: From requirements to deployment, fully documented
7. **Innovation**: Demonstrates future of AI-assisted development

## 📚 Additional Resources

- **Requirements Document**: Detailed user stories and acceptance criteria
- **Design Document**: Architecture, components, and correctness properties
- **Task List**: Step-by-step implementation plan
- **Tools Guide**: How to use Amazon Q Developer and Kiro effectively

## 🤝 Contributing

This is a hackathon project, but contributions and suggestions are welcome!

1. Review the requirements and design documents
2. Pick a task from tasks.md
3. Implement following the spec
4. Write tests (unit + property)
5. Submit for review

## 📝 License

[Your License Here]

## 🙏 Acknowledgments

- AWS Global Vibe Hackathon 2025
- Amazon Q Developer team
- Kiro development team
- OpenAI / Anthropic for AI models
- Open source community

---

**Ready to build?** Open `.kiro/specs/sentient-earth-oracle/tasks.md` and start with Task 1!

**Need help?** Check out `hackathon-tools-guide.md` for detailed guidance on using Amazon Q Developer and Kiro together.

**Questions?** Review the requirements and design documents for complete specifications.

Let's create something amazing! 🌍✨🤖
