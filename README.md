# Roberto's Personal Website - AWS Builder Challenge #2

A modern, conversational personal website built with Next.js and AWS serverless architecture. Features a chat-style interface for exploring content about software engineering, football, and personal projects, with a fully functional email contact system.

## 🚀 Live Demo

**Website**: [https://allende.nz](https://allende.nz)

## 📋 Project Overview

This project was developed for the **AWS Builder Challenge #2** using **Micromanaged Driven Development (MMDD)** principles. It showcases a unique chat-style personal website where visitors can explore content through natural conversations and send real emails through an integrated contact system.

### Key Features

- **🗨️ Conversational Interface**: Chat-style navigation through different topics
- **📧 Real Email System**: Send messages directly to Roberto through natural conversation
- **📱 Mobile-First Design**: Responsive design optimized for all devices
- **🎨 Multiple Themes**: Claude-inspired, dark, and light themes
- **⚡ Real-Time Content**: Dynamic integration with external blogs and feeds
- **🔒 Human Verification**: Anti-spam protection with conversational verification
- **🌐 Serverless Architecture**: Built entirely on AWS serverless services

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom themes
- **UI Components**: assistant-ui for chat interface
- **Deployment**: AWS Amplify with static export

### Backend Stack
- **API Gateway**: RESTful endpoints for email submission
- **Lambda Functions**: Serverless email processing
- **SNS**: Email notification delivery system
- **IAM**: Secure role-based access control

### Content Management
- **Static Generation**: Build-time content compilation
- **External Integration**: Dynamic blog content from RSS feeds
- **Intelligent Matching**: Approximate text matching for dynamic responses

## 🛠️ Technical Implementation

### Chat System
```typescript
// Multi-thread conversation system with topic-based navigation
const multiTopicChatAdapter: ChatModelAdapter = {
  async *run({ messages }) {
    // Intelligent content matching and streaming responses
    const contentMatcher = await getContentMatcher();
    const matchResult = await contentMatcher.loadMatchedContent(userMessage);
    
    // Stream response with character-by-character animation
    for (const word of response.split(' ')) {
      yield { content: [{ type: "text", text: currentContent }] };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
};
```

### Email System
```typescript
// Conversational email flow with human verification
export async function handleEmailMessage(message: string) {
  switch (state.step) {
    case 'collecting_name':
      return { response: "What's your email address?" };
    case 'collecting_email':
      return { response: "What would you like to tell Roberto?" };
    case 'collecting_message':
      return { response: `${question.question}` };
    case 'verifying_human':
      if (isCorrect) {
        return { 
          response: "Sending your message to Roberto...",
          action: 'SEND_EMAIL'
        };
      }
  }
}
```

### AWS Integration
```typescript
// Production-ready API client with retry logic
export class EmailApiClient {
  async submitEmail(submission: EmailSubmissionRequest): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
        signal: controller.signal
      });
      
      if (!response.ok) throw new EmailApiError(response.status, await response.text());
    } catch (error) {
      // Comprehensive error handling with user-friendly messages
      throw this.handleError(error);
    }
  }
}
```

## 📁 Project Structure

```
allende.ai/
├── s3/frontend/                 # Next.js frontend application
│   ├── components/              # React components
│   │   ├── chat/               # Chat interface components
│   │   ├── ui/                 # UI components
│   │   └── theme/              # Theme system
│   ├── src/                    # Source code
│   │   ├── content/            # Static content files
│   │   ├── services/           # Business logic services
│   │   ├── types/              # TypeScript definitions
│   │   └── config/             # Configuration files
│   └── public/                 # Static assets
├── lambda/                     # AWS Lambda functions
├── sns/                        # SNS configuration
├── api-gateway/               # API Gateway setup
├── iam/                       # IAM policies and roles
└── dev_log/                   # Development documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/robertoallende/allende.ai.git
   cd allende.ai
   ```

2. **Install dependencies**
   ```bash
   cd s3/frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_API_ENDPOINT=https://your-api-gateway-url/prod/submit
   NEXT_PUBLIC_API_TIMEOUT=30000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### Production Deployment

The project is configured for AWS Amplify deployment:

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd s3/frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: s3/frontend/out
    files:
      - '**/*'
```

## 📧 Email System Features

### Conversational Flow
1. **Natural Initiation**: "Send an email to Roberto"
2. **Information Collection**: Name, email, message through chat
3. **Human Verification**: Random questions to prevent spam
4. **Real Delivery**: Actual email sent via AWS SNS
5. **Confirmation**: Success feedback with response timeline

### Security Features
- **Human Verification**: Rotating questions about Roberto and general knowledge
- **Input Validation**: Email format, message length, required fields
- **Rate Limiting**: API Gateway throttling (10 requests/minute)
- **Error Handling**: Comprehensive error recovery with retry options

### User Experience
- **Inline Loading**: "Sending your message..." without UI blocking
- **Error Recovery**: Clear messages with retry options
- **Professional Tone**: Clean, emoji-free communication
- **Natural Flow**: Maintains conversational context throughout

## 🎨 Theme System

### Available Themes
- **Claude Theme** (Default): Authentic Claude-inspired design (#30302E background)
- **Dark Theme**: High contrast dark mode
- **Light Theme**: Clean light interface

### Theme Configuration
```typescript
export const themes = {
  claude: {
    name: 'Claude',
    colors: {
      background: '#30302E',
      surface: '#2A2A28',
      border: '#5B5A56',
      text: '#FFFFFF'
    }
  }
};
```

## 📱 Mobile Optimization

- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Touch Interactions**: Optimized for mobile gestures and interactions
- **Viewport Handling**: Safe area support for iOS devices
- **Performance**: Optimized bundle size and loading times

## 🔧 Development Methodology

This project follows **Micromanaged Driven Development (MMDD)** principles:

- **Granular Units**: Each feature implemented as a discrete unit
- **Comprehensive Documentation**: Every unit documented with implementation details
- **Iterative Development**: Continuous improvement and refinement
- **Quality Focus**: TypeScript, testing, and code quality throughout

### Development Units Completed
- **Frontend Development**: 12 units (Setup → Chat UI → Themes → Responsive)
- **Content System**: 5 units (File-based → External → Intelligent matching)
- **UX Enhancements**: 3 units (Input control → Centered input → Email flow)
- **Email Backend**: 5 units (SNS → IAM → Lambda → API Gateway → Integration)

## 🏆 AWS Builder Challenge Compliance

### Requirements Met
- ✅ **HTTPS**: Deployed on AWS with SSL certificate
- ✅ **Working Contact Form**: Conversational email system with real delivery
- ✅ **Open Source**: MIT License, public GitHub repository
- ✅ **Q Developer Usage**: Extensive use throughout development process

### AWS Services Used
- **Amplify**: Frontend hosting and deployment
- **API Gateway**: RESTful API endpoints
- **Lambda**: Serverless email processing
- **SNS**: Email notification delivery
- **IAM**: Security and access control
- **CloudFront**: Content delivery (via Amplify)

## 📊 Performance Metrics

- **Build Size**: ~190KB optimized bundle
- **Load Time**: <2s first contentful paint
- **Mobile Score**: 95+ Lighthouse performance
- **Accessibility**: WCAG 2.1 AA compliant
- **SEO**: Optimized meta tags and structure

## 🤝 Contributing

This project welcomes contributions! Please see the development log in `dev_log/` for implementation details and coding standards.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Follow MMDD principles for implementation
4. Document changes in dev_log/
5. Submit pull request with comprehensive description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ About Roberto

Roberto is an enthusiastic software engineer passionate about AWS, cloud architecture, and modern web development. When not coding, you'll find him writing about football (especially Real Madrid) or exploring new technologies.

### Connect
- **Website**: [allende.nz](https://allende.nz)
- **Email**: Use the conversational contact system on the website
- **Blog**: Integrated content from AWS Builder articles and football insights

---

**Built with ❤️ using AWS, Next.js, and Amazon Q Developer CLI**

*This project demonstrates modern serverless architecture, conversational UX design, and comprehensive full-stack development using AWS services and best practices.*
