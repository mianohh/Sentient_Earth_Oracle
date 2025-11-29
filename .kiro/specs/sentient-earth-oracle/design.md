# Design Document

## Overview

The Sentient Earth Oracle is a multi-agent AI system that creates meaningful connections between human emotions and Earth's environmental conditions. The architecture follows a microservices pattern with four specialized AI agents working asynchronously to process user input, analyze emotions, fetch Earth data, synthesize insights, and generate actionable recommendations.

The system is built using:
- **Frontend**: React with TypeScript, Tailwind CSS, Framer Motion for animations
- **Backend**: Node.js with Express, TypeScript
- **AI Agents**: OpenAI GPT-4 or Amazon Bedrock (Claude) for agent intelligence
- **Data Storage**: PostgreSQL for user data and history, Redis for caching
- **External APIs**: OpenWeatherMap for weather, IQAir for air quality
- **Deployment**: AWS (Lambda, API Gateway, RDS, ElastiCache, S3, CloudFront)

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Input Form   │  │ Response     │  │ History      │          │
│  │ Component    │  │ Display      │  │ View         │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Express)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth         │  │ Rate         │  │ Request      │          │
│  │ Middleware   │  │ Limiting     │  │ Validation   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Orchestrator Service   │  │   User Service           │
│  - Agent coordination    │  │  - Authentication        │
│  - Workflow management   │  │  - History management    │
│  - Response aggregation  │  │  - Profile data          │
└────────┬─────────────────┘  └──────────────────────────┘
         │
         ├─────────────┬─────────────┬─────────────┬──────────────┐
         ▼             ▼             ▼             ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
│  Emotion    │ │ Earth-Data  │ │ Synthesizer │ │   Action     │
│  Analysis   │ │  Analysis   │ │   Agent     │ │  Generation  │
│  Engine     │ │  Engine     │ │             │ │   Agent      │
└─────────────┘ └──────┬──────┘ └─────────────┘ └──────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  External APIs  │
              │  - Weather API  │
              │  - AQI API      │
              └─────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│   PostgreSQL    │         │     Redis       │
│  - User data    │         │  - API cache    │
│  - History      │         │  - Sessions     │
└─────────────────┘         └─────────────────┘
```

### Agent Workflow

```
User Input
    │
    ▼
┌─────────────────────────────────────┐
│  1. Emotion Analysis Engine         │
│     - Parse emotional content       │
│     - Classify emotions             │
│     - Generate confidence scores    │
└──────────────┬──────────────────────┘
               │
               ├──────────────────────────────┐
               ▼                              ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  2. Earth-Data Analysis      │  │  (Parallel Processing)       │
│     - Fetch weather data     │  │                              │
│     - Retrieve AQI           │  │                              │
│     - Check natural events   │  │                              │
└──────────────┬───────────────┘  └──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Synthesizer Agent               │
│     - Combine emotion + Earth data  │
│     - Generate narrative            │
│     - Calculate Vibe Score          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Action Generation Agent         │
│     - Create recommendations        │
│     - Categorize actions            │
│     - Add metadata                  │
└──────────────┬──────────────────────┘
               │
               ▼
         Oracle Response
```

## Components and Interfaces

### Frontend Components

#### 1. InputForm Component
```typescript
interface InputFormProps {
  onSubmit: (input: UserInput) => Promise<void>;
  isProcessing: boolean;
}

interface UserInput {
  emotionalText: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
}
```

**Responsibilities:**
- Capture user emotional text input
- Validate input (non-empty, character limit)
- Request location permission
- Display processing state
- Handle form submission

#### 2. ResponseDisplay Component
```typescript
interface ResponseDisplayProps {
  response: OracleResponse;
  onShare: () => void;
  onSave: () => void;
}
```

**Responsibilities:**
- Display emotion analysis with visual indicators
- Show Earth data with icons and formatting
- Render synthesized narrative
- Present action recommendations
- Animate Vibe Score gauge
- Provide share and save functionality

#### 3. HistoryView Component
```typescript
interface HistoryViewProps {
  userId: string;
  onSelectResponse: (responseId: string) => void;
}
```

**Responsibilities:**
- Fetch and display user's response history
- Show summary cards with key information
- Handle response selection
- Support deletion with confirmation

#### 4. VibeScoreGauge Component
```typescript
interface VibeScoreGaugeProps {
  score: number; // 0-100
  animated: boolean;
}
```

**Responsibilities:**
- Visualize Vibe Score as radial gauge
- Animate score reveal
- Display color gradient based on score

### Backend Services

#### 1. API Gateway Service

**Endpoints:**
```typescript
POST   /api/oracle/analyze
GET    /api/oracle/history/:userId
GET    /api/oracle/response/:responseId
DELETE /api/oracle/response/:responseId
POST   /api/oracle/share/:responseId
GET    /api/share/:shareToken
POST   /api/auth/register
POST   /api/auth/login
GET    /api/user/profile
```

**Middleware:**
- Authentication (JWT)
- Rate limiting (100 requests/hour per user)
- Request validation
- Error handling
- CORS configuration

#### 2. Orchestrator Service

```typescript
interface OrchestratorService {
  processUserInput(input: UserInput, userId: string): Promise<OracleResponse>;
  getProcessingStatus(requestId: string): Promise<ProcessingStatus>;
}
```

**Responsibilities:**
- Coordinate agent execution
- Manage async workflows
- Aggregate agent responses
- Handle timeouts and retries
- Emit progress events

#### 3. Emotion Analysis Engine

```typescript
interface EmotionAnalysisEngine {
  analyzeEmotion(text: string): Promise<EmotionAnalysis>;
}

interface EmotionAnalysis {
  primaryEmotion: Emotion;
  secondaryEmotions: Emotion[];
  intensity: number; // 0-1
  confidence: number; // 0-1
  keywords: string[];
}

type Emotion = 'joy' | 'sadness' | 'anxiety' | 'calm' | 'anger' | 'hope' | 'fear' | 'neutral';
```

**Implementation:**
- Use GPT-4 or Claude with emotion analysis prompt
- Extract emotion classifications with confidence scores
- Identify emotional keywords
- Return structured emotion data

#### 4. Earth-Data Analysis Engine

```typescript
interface EarthDataAnalysisEngine {
  fetchEarthData(location: Location): Promise<EarthData>;
}

interface EarthData {
  weather: WeatherData;
  airQuality: AirQualityData;
  naturalEvents: NaturalEvent[];
  timestamp: Date;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

interface AirQualityData {
  aqi: number;
  category: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
  };
}
```

**Implementation:**
- Call OpenWeatherMap API for weather
- Call IQAir API for air quality
- Check USGS or similar for natural events
- Implement caching (15-minute TTL)
- Handle API failures gracefully

#### 5. Synthesizer Agent

```typescript
interface SynthesizerAgent {
  synthesize(emotion: EmotionAnalysis, earthData: EarthData): Promise<Synthesis>;
}

interface Synthesis {
  narrative: string;
  vibeScore: number; // 0-100
  insights: string[];
  connections: string[];
}
```

**Implementation:**
- Use GPT-4 or Claude with synthesis prompt
- Combine emotional and environmental context
- Generate poetic narrative
- Calculate Vibe Score based on alignment
- Identify key connections

#### 6. Action Generation Agent

```typescript
interface ActionGenerationAgent {
  generateActions(synthesis: Synthesis, context: ActionContext): Promise<Action[]>;
}

interface Action {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'mindfulness' | 'social' | 'environmental';
  timeEstimate: number; // minutes
  difficulty: 'easy' | 'moderate' | 'challenging';
  safetyNote?: string;
}

interface ActionContext {
  emotion: EmotionAnalysis;
  earthData: EarthData;
  synthesis: Synthesis;
}
```

**Implementation:**
- Use GPT-4 or Claude with action generation prompt
- Generate 3-5 specific actions
- Categorize and add metadata
- Prioritize safety when conditions are hazardous
- Ensure actions are contextually relevant

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  defaultLocation?: Location;
  shareByDefault: boolean;
  emailNotifications: boolean;
}
```

### OracleResponse Model
```typescript
interface OracleResponse {
  id: string;
  userId: string;
  timestamp: Date;
  input: UserInput;
  emotionAnalysis: EmotionAnalysis;
  earthData: EarthData;
  synthesis: Synthesis;
  actions: Action[];
  processingTime: number; // milliseconds
  shareToken?: string;
}
```

### Session Model
```typescript
interface Session {
  id: string;
  userId: string;
  requestId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: {
    emotionAnalysis: boolean;
    earthData: boolean;
    synthesis: boolean;
    actionGeneration: boolean;
  };
  createdAt: Date;
  completedAt?: Date;
}
```

### Location Model
```typescript
interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timezone?: string;
}
```

## Corre
ctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Input acceptance and storage
*For any* non-empty, non-whitespace text input, the system should accept and successfully store the input for processing.
**Validates: Requirements 1.1**

### Property 2: Whitespace input rejection
*For any* string composed entirely of whitespace characters, the system should reject the input and prevent submission.
**Validates: Requirements 1.2**

### Property 3: Input truncation at character limit
*For any* text input exceeding 1000 characters, the system should truncate it to exactly 1000 characters.
**Validates: Requirements 1.4**

### Property 4: Emotion analysis output structure
*For any* valid user input, the emotion analysis output should contain primary emotion, secondary emotions array, intensity score, and confidence score fields.
**Validates: Requirements 2.1**

### Property 5: Emotion classification validity
*For any* emotion analysis result, all emotion classifications should be from the defined set: joy, sadness, anxiety, calm, anger, hope, fear, or neutral.
**Validates: Requirements 2.2**

### Property 6: Emotion ranking and limiting
*For any* emotion analysis with multiple emotions detected, the output should contain at most three emotions ranked by intensity in descending order.
**Validates: Requirements 2.3**

### Property 7: Weather data retrieval
*For any* valid location coordinates, the Earth-Data Analysis Engine should return weather data containing temperature, condition, humidity, and wind speed.
**Validates: Requirements 3.1**

### Property 8: Air quality data inclusion
*For any* valid location with weather data, the response should also include air quality index (AQI) data.
**Validates: Requirements 3.2**

### Property 9: Synthesis output completeness
*For any* valid emotion analysis and Earth data pair, the Synthesizer Agent should produce output containing narrative, Vibe Score, insights, and connections.
**Validates: Requirements 4.1**

### Property 10: Vibe Score range validity
*For any* synthesis result, the Vibe Score should be a number between 0 and 100 inclusive.
**Validates: Requirements 4.3**

### Property 11: Action count constraint
*For any* completed synthesis, the Action Generation Agent should produce between 3 and 5 actions inclusive.
**Validates: Requirements 5.1**

### Property 12: Action category validity
*For any* generated action, the category should be one of: physical, mindfulness, social, or environmental.
**Validates: Requirements 5.3**

### Property 13: Action metadata completeness
*For any* generated action, it should include title, description, category, time estimate, and difficulty level fields.
**Validates: Requirements 5.5**

### Property 14: Response history persistence
*For any* authenticated user who generates an Oracle Response, that response should be retrievable from their history.
**Validates: Requirements 7.1**

### Property 15: History chronological ordering
*For any* user with multiple Oracle Responses, retrieving their history should return responses in reverse chronological order (newest first).
**Validates: Requirements 7.2**

### Property 16: History summary structure
*For any* response in user history, the summary should include date, primary emotion, and Vibe Score fields.
**Validates: Requirements 7.3**

### Property 17: Response deletion removes data
*For any* Oracle Response, after deletion is requested and confirmed, subsequent retrieval attempts should fail indicating the response no longer exists.
**Validates: Requirements 7.5**

### Property 18: Invalid request error codes
*For any* malformed API request, the API Gateway should return a 4xx error code with a descriptive error message.
**Validates: Requirements 8.1**

### Property 19: Oracle Response aggregation
*For any* successful processing, the final Oracle Response should contain emotion analysis, Earth data, synthesis, and actions from all agents.
**Validates: Requirements 8.3**

### Property 20: Standardized error responses
*For any* API error, the response should follow a standard structure with status code, error message, and error type fields.
**Validates: Requirements 8.4**

### Property 21: Processing status updates
*For any* Oracle Response being processed, the system should emit status updates as each agent completes its task.
**Validates: Requirements 9.2**

### Property 22: Complete response notification
*For any* Oracle Response where all agents complete successfully, the system should return a complete response object with all required fields populated.
**Validates: Requirements 9.4**

### Property 23: Schema validation enforcement
*For any* data passed between services, invalid data that doesn't match the schema should be rejected with a validation error.
**Validates: Requirements 10.2**

### Property 24: Serialization round-trip
*For any* valid OracleResponse object, serializing to JSON and then deserializing should produce an equivalent object with all fields preserved.
**Validates: Requirements 10.4**

### Property 25: Validation error specificity
*For any* data validation failure, the error message should identify which specific field(s) failed validation.
**Validates: Requirements 10.5**

### Property 26: Error log completeness
*For any* error that occurs, the log entry should contain timestamp, service name, error message, and stack trace fields.
**Validates: Requirements 12.1**

### Property 27: Event logging coverage
*For any* request processed, the system should log at minimum: request received, processing started, and processing completed events.
**Validates: Requirements 12.2**

### Property 28: Error message sanitization
*For any* error displayed to users, the message should not contain internal implementation details, stack traces, or database information.
**Validates: Requirements 12.4**

### Property 29: Structured log format consistency
*For any* log entry across all services, it should follow the same JSON structure with consistent field names.
**Validates: Requirements 12.5**

### Property 30: Unique share link generation
*For any* two different Oracle Responses that are shared, they should generate distinct, unique shareable links.
**Validates: Requirements 15.2**

### Property 31: Privacy in shared responses
*For any* shared Oracle Response, the public view should not include precise location coordinates, only city-level information.
**Validates: Requirements 15.5**

## Error Handling

### Error Categories

1. **Validation Errors (400)**
   - Invalid input format
   - Missing required fields
   - Character limit violations
   - Invalid location coordinates

2. **Authentication Errors (401/403)**
   - Invalid or expired JWT tokens
   - Insufficient permissions
   - Account not found

3. **Rate Limiting Errors (429)**
   - Too many requests from user
   - API quota exceeded

4. **External API Errors (502/503)**
   - Weather API unavailable
   - AQI API timeout
   - Third-party service failures

5. **Processing Errors (500)**
   - Agent execution failures
   - Database connection errors
   - Unexpected exceptions

### Error Handling Strategy

**Frontend:**
- Display user-friendly error messages
- Provide retry options for transient failures
- Show fallback content when possible
- Log errors to monitoring service

**Backend:**
- Implement circuit breakers for external APIs
- Use exponential backoff for retries
- Return partial responses when possible
- Log all errors with context
- Send alerts for critical failures

**Agent Failures:**
- Emotion Analysis fails → Use neutral emotion as fallback
- Earth Data fails → Use cached data or skip Earth context
- Synthesizer fails → Return separate emotion and Earth insights
- Action Generation fails → Provide generic wellness actions

### Timeout Handling

- Individual agent timeout: 10 seconds
- Total request timeout: 30 seconds
- External API timeout: 5 seconds
- Database query timeout: 3 seconds

When timeouts occur, return partial results with clear indication of what's missing.

## Testing Strategy

### Unit Testing

The system will use **Jest** for unit testing with the following focus areas:

**Core Logic Tests:**
- Input validation functions
- Data transformation utilities
- Schema validation logic
- Error handling functions
- Authentication middleware
- Rate limiting logic

**Service Tests:**
- User service CRUD operations
- Session management
- Cache operations
- Database queries

**API Endpoint Tests:**
- Request validation
- Response formatting
- Error responses
- Authentication checks

**Example Unit Tests:**
- Test that empty input is rejected
- Test that input over 1000 chars is truncated
- Test that invalid emotion types are rejected
- Test that Vibe Score is clamped to 0-100 range
- Test that share tokens are unique
- Test that deleted responses cannot be retrieved

### Property-Based Testing

The system will use **fast-check** (for TypeScript/JavaScript) for property-based testing. Each property-based test will run a minimum of 100 iterations to ensure thorough coverage.

**Property Test Requirements:**
- Each test must be tagged with a comment referencing the design document property
- Tag format: `// Feature: sentient-earth-oracle, Property {number}: {property_text}`
- Each correctness property must be implemented by a single property-based test
- Tests should use smart generators that constrain inputs to valid ranges

**Property Test Coverage:**

1. **Input Validation Properties:**
   - Property 1: Input acceptance and storage
   - Property 2: Whitespace input rejection
   - Property 3: Input truncation at character limit

2. **Emotion Analysis Properties:**
   - Property 4: Emotion analysis output structure
   - Property 5: Emotion classification validity
   - Property 6: Emotion ranking and limiting

3. **Earth Data Properties:**
   - Property 7: Weather data retrieval
   - Property 8: Air quality data inclusion

4. **Synthesis Properties:**
   - Property 9: Synthesis output completeness
   - Property 10: Vibe Score range validity

5. **Action Generation Properties:**
   - Property 11: Action count constraint
   - Property 12: Action category validity
   - Property 13: Action metadata completeness

6. **History and Persistence Properties:**
   - Property 14: Response history persistence
   - Property 15: History chronological ordering
   - Property 16: History summary structure
   - Property 17: Response deletion removes data

7. **API and Integration Properties:**
   - Property 18: Invalid request error codes
   - Property 19: Oracle Response aggregation
   - Property 20: Standardized error responses
   - Property 21: Processing status updates
   - Property 22: Complete response notification

8. **Data Validation Properties:**
   - Property 23: Schema validation enforcement
   - Property 24: Serialization round-trip
   - Property 25: Validation error specificity

9. **Logging Properties:**
   - Property 26: Error log completeness
   - Property 27: Event logging coverage
   - Property 28: Error message sanitization
   - Property 29: Structured log format consistency

10. **Sharing Properties:**
    - Property 30: Unique share link generation
    - Property 31: Privacy in shared responses

### Integration Testing

**End-to-End Flows:**
- Complete user journey: input → processing → response display
- Authentication flow: register → login → access protected resources
- History flow: generate responses → view history → delete response
- Share flow: create response → generate share link → access shared view

**Agent Integration:**
- Test orchestrator coordinating all four agents
- Test agent failure scenarios and fallbacks
- Test timeout handling
- Test parallel processing

**External API Integration:**
- Test weather API integration with real and mocked responses
- Test AQI API integration
- Test API failure handling
- Test caching behavior

### Test Data Generators

**For Property-Based Tests:**

```typescript
// Emotion text generator
const emotionTextGen = fc.string({ minLength: 1, maxLength: 2000 });

// Location generator
const locationGen = fc.record({
  latitude: fc.double({ min: -90, max: 90 }),
  longitude: fc.double({ min: -180, max: 180 })
});

// Emotion type generator
const emotionTypeGen = fc.constantFrom(
  'joy', 'sadness', 'anxiety', 'calm', 'anger', 'hope', 'fear', 'neutral'
);

// Action category generator
const actionCategoryGen = fc.constantFrom(
  'physical', 'mindfulness', 'social', 'environmental'
);

// Vibe score generator
const vibeScoreGen = fc.integer({ min: 0, max: 100 });
```

## AWS and Development Tools Integration

### Amazon Q Developer Usage

**Code Generation:**
- Use Q Developer to generate boilerplate for API endpoints
- Generate TypeScript interfaces and types from requirements
- Create database schema and migration files
- Generate test scaffolding and fixtures

**Debugging:**
- Use Q Developer to analyze error logs and suggest fixes
- Get explanations for complex error messages
- Receive suggestions for performance optimizations
- Debug async workflow issues

**Code Review:**
- Use Q Developer to review code for security vulnerabilities
- Check for best practices in error handling
- Validate TypeScript type safety
- Suggest refactoring opportunities

### Kiro Spec-Driven Development

**Requirements Phase:**
- Use Kiro to iterate on requirements with stakeholder feedback
- Ensure all acceptance criteria are testable
- Validate EARS compliance

**Design Phase:**
- Use Kiro to develop comprehensive design document
- Generate correctness properties from acceptance criteria
- Plan testing strategy

**Implementation Phase:**
- Use Kiro's task execution to implement features incrementally
- Track progress through task checklist
- Ensure each task builds on previous work
- Run tests after each task completion

**Iteration:**
- Use Kiro to refactor based on test results
- Update design document as requirements evolve
- Maintain traceability between requirements, design, and code

### AWS Services Architecture

**Compute:**
- AWS Lambda for serverless agent execution
- API Gateway for REST endpoints
- ECS/Fargate for orchestrator service (if needed for long-running processes)

**Storage:**
- RDS PostgreSQL for user data and response history
- ElastiCache Redis for session management and API caching
- S3 for static assets and shared response previews

**AI/ML:**
- Amazon Bedrock (Claude) for agent intelligence
- Alternative: OpenAI API integration

**Monitoring:**
- CloudWatch for logs and metrics
- CloudWatch Alarms for critical failures
- X-Ray for distributed tracing

**Security:**
- Cognito for user authentication (optional)
- Secrets Manager for API keys
- IAM roles for service permissions

**Deployment:**
- CloudFormation or CDK for infrastructure as code
- CodePipeline for CI/CD
- CloudFront for CDN

## Performance Considerations

### Caching Strategy

**API Response Caching:**
- Weather data: 15-minute TTL
- AQI data: 15-minute TTL
- Natural events: 1-hour TTL

**User Data Caching:**
- User profiles: 5-minute TTL
- Session data: 30-minute TTL

### Optimization Techniques

**Parallel Processing:**
- Run Emotion Analysis and Earth Data Analysis in parallel
- Reduces total processing time by ~40%

**Database Optimization:**
- Index on userId for history queries
- Index on shareToken for shared response lookups
- Use connection pooling

**Frontend Optimization:**
- Code splitting for faster initial load
- Lazy load history view
- Optimize images and assets
- Use React.memo for expensive components

**API Optimization:**
- Batch database queries where possible
- Use streaming responses for real-time updates
- Implement request deduplication

## Security Considerations

### Authentication & Authorization

- JWT tokens with 24-hour expiration
- Refresh tokens for extended sessions
- Password hashing with bcrypt (10 rounds)
- Rate limiting per user and per IP

### Data Privacy

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Sanitize user input to prevent XSS
- Validate and parameterize database queries to prevent SQL injection
- Don't log sensitive information (passwords, tokens)

### API Security

- Validate all input against schemas
- Implement CORS with whitelist
- Use API keys for external service access
- Store secrets in AWS Secrets Manager
- Implement request signing for agent communication

### Shared Response Privacy

- Generate cryptographically secure share tokens
- Exclude precise location data from shared views
- Allow users to revoke shared links
- Set expiration on shared links (optional)

## Deployment Strategy

### Development Environment

- Local development with Docker Compose
- Mock external APIs for testing
- Local PostgreSQL and Redis instances
- Hot reload for rapid iteration

### Staging Environment

- AWS infrastructure matching production
- Real external API integration
- Automated testing on each deployment
- Performance testing and monitoring

### Production Environment

- Multi-AZ deployment for high availability
- Auto-scaling for Lambda functions
- Database read replicas for scaling
- CDN for global distribution
- Automated backups and disaster recovery

### CI/CD Pipeline

1. **Code Push** → Trigger pipeline
2. **Lint & Type Check** → Validate code quality
3. **Unit Tests** → Run Jest tests
4. **Property Tests** → Run fast-check tests
5. **Integration Tests** → Test end-to-end flows
6. **Build** → Compile TypeScript, bundle frontend
7. **Deploy to Staging** → Update staging environment
8. **Smoke Tests** → Verify staging deployment
9. **Manual Approval** → Review before production
10. **Deploy to Production** → Update production environment
11. **Health Checks** → Verify production deployment

## Future Enhancements

### Phase 2 Features

- Voice input for emotional expression
- Multi-language support
- Mobile native apps (iOS/Android)
- Integration with wearables for biometric data
- Community features (share insights, connect with others)

### Advanced AI Features

- Personalized action recommendations based on history
- Predictive insights (anticipate emotional needs)
- Long-term emotional trend analysis
- Custom AI agents for specific use cases

### Gamification

- Streak tracking for daily check-ins
- Achievement badges for completing actions
- Vibe Score history visualization
- Challenges and goals

## Conclusion

The Sentient Earth Oracle represents a novel approach to connecting human emotional states with environmental awareness. By leveraging multi-agent AI systems, real-time Earth data, and thoughtful UX design, the platform creates meaningful, actionable insights that help users feel more connected to themselves and their environment.

The spec-driven development approach using Kiro, combined with Amazon Q Developer for rapid code generation and debugging, enables efficient development of this complex system within hackathon timeframes while maintaining high code quality and comprehensive test coverage.
