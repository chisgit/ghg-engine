 ## CORE PRINCIPLES
 - NEVER remove existing functionality
 - Maintain data model integrity
 - Preserve all EXISTING FUNCTIONALITY
 - Keep performance optimizations
 - Update VECTOR_CONTEXT.json when modifying functionality to maintain accurate feature tracking
 - Ensure that you have a clear understanding of how your code is going to affect other components in the system
 - ALWAYS PROVIDE TERMINAL COMMANDS IN POWERSHELL FOR WINDOWS 
 - I LIKE ONE WORD ANSWERS WHERE POSSIBLE.
 - OPTIMIZE TOKENS, I WILL ASK FOR ADDITIONAL INFO.
 - KEEP THE CHANGES SMALL SO WE CAN TEST EACH PIECE.
 - DO NOT REMOVE PREVIOUS CONSOLE OUT PRINTS THEY ARE THERE FOR A REASON!
 - NEVER REMOVE EXISTING FUNCTIONALITY - THINGS ARE IN PLACE FOR A GOOD REASON
 - LETS USE AGILE AND TEST DRIVEN APPROACHES TO MAKE SMALL CHANGES AND ITERATE
 - ASK BEFORE MAKING THE NEXT SET OF CHANGES.
 - I am coding using Node.js 
 - Node.js version compatibility: Use LTS version 18.x or 20.x for best compatibility with dependencies
 - For Angular 15.2.x, choose ONE approach - either all standalone components OR traditional NgModule pattern
 - Mixing standalone components with NgModule pattern requires proper bootstrapping configuration
 - Update SYSTEM_INSTRUCTIONS.md with the latest updates where it makes sense
# File Upload UI - System Instructions

## VERSION REQUIREMENTS
- Node.js: LTS version 20.x (AWS Lambda compatible)
- Angular: 15.2.x with standalone components

## OKTA CONFIGURATION
- Domain: dev-43296795.okta.com
- Client ID: 0oao52hsldb6anYgg5d7

## CORE PRINCIPLES
- Use standalone components consistently throughout
- Maintain clear separation of concerns
- Follow security best practices
- Keep performance optimizations
- Use small, testable changes
- Preserve console logging for debugging
- Follow test-driven development practices

## DEVELOPMENT GUIDELINES
- Use PowerShell for Windows commands
- Use "npm run" pattern instead of "&&" or ";"
- Navigate to C:\Users\User\FileUpload\puro-ghg2
- Keep changes small and testable
- Maintain existing console logs
- Follow Agile and TDD approaches

## CODE STYLE
- Use meaningful variable and function names
- Include documentation for functions and classes
- Keep functions focused and single-purpose
- Use TypeScript types consistently
- Follow Angular style guide

## ARCHITECTURE

### 1. User Access and Authentication
Users: [File Uploader, GHG Admin]
Entry Point: GHG UI (Web Browser)
Authentication:
  - GHG UI --> Backend Authentication Endpoint
  - Backend --> Redirect to Okta Login Page
  - GHG Admin --> MFA via Okta
  - Okta --> Issues Okta Token to Backend
  - Backend --> Creates session for user
  - Backend --> Redirects user back to UI with session token
Output: Session token for authenticated users

### 2. Web Content Delivery
Content Source: S3 Bucket (GHG Web Content)
CDN & Edge Processing: CloudFront
Edge Compute: Lambda@Edge
Security: WAF
Flow:
  [User] --> [GHG UI] --> [CloudFront] --> [Lambda@Edge] --> [S3 Bucket] --> [Lambda@Edge] --> [CloudFront] --> [GHG UI]

### 3. API Access and Authorization
API Endpoints: CRUD API Endpoints
Entry Point: CloudFront
API Gateway: Manages API requests
Authorization: Lambda Authorizer (Validates Okta Token)
Flow:
  [GHG UI] --> [CRUD API Request with Okta Token] --> [CloudFront] --> [API Gateway] --> [Lambda Authorizer] --> [CRUD API Endpoints]

### 4. Detailed System Architecture

#### Components:
- **Okta:**
  - OIDC Endpoints for authentication
  - Authentication UI at `dev-43296795.okta.com` (local development)
  - User entities: Employees, Partners, Recipients

- **Browser (JavaScript Client):** 
  - Angular-based SPA with hash-based routing
  - Communicates with CloudFront and Okta

- **AWS CloudFront Account:**
  - Public endpoint `@purolator.com`
  - Shared domain across applications
  - Generic routing configuration

- **AWS Application Account:**
  - VPC with Private Subnet
  - Lambda Functions for backend logic
  - API Gateway with public endpoint `@aws-purolator.com`
  - Lambda Authorizer for JWT validation
  - S3 for application web assets (private buckets)

#### Authentication Flow:
1. User accesses application via browser
2. Browser sends authentication request to backend endpoint
3. Backend redirects user to Okta Authentication UI
4. User authenticates through Okta
5. Okta redirects back to backend callback endpoint
6. Backend processes Okta tokens and creates a session
7. Backend redirects user back to UI with session cookie/token
8. API requests include session information for authorization
9. Lambda Authorizer verifies session before granting backend access

#### Routing Configuration:
- `-/app/*` → CloudFront
- `/{app}/*` → S3 (web assets)
- `/{app}/api*` → API Gateway
- CloudFront domain is shared across applications
- Application has two routing types:
  1. S3 bucket for static web assets
  2. API Gateway for compute environment

#### Security Requirements:
- S3 buckets must be private (no public hosting/access)
- Protected resources served via API Gateway or Signed URLs
- All static resources served from private S3 buckets via CloudFront
- JWT token included in `x-amzn-oidc-data` header for API authentication

#### URL Patterns:
- Landing: `http://localhost:4200/{app}/index.html` (for local development)
- Login: `http://localhost:4200/{app}/login`
- Logout: `http://localhost:4200/{app}/logout`
- API: `http://localhost:4200/{app}/api/{resource}`

## COMPONENTS LIST
- Users: File Uploader, GHG Admin
- GHG UI: Web User Interface
- Okta Identity Cloud: Authentication Provider
- CRUD API Endpoints: Backend Services
- CloudFront: CDN, Entry Point
- API Gateway: API Management
- Lambda Authorizer: Authorization Function
- Lambda@Edge: Edge Computing
- S3 Bucket: Web Content Storage
- WAF: Web Application Firewall

## DEVELOPMENT WORKFLOW
1. Start with authentication implementation
2. Build basic UI components
3. Implement file upload functionality
4. Add AWS integration
5. Implement security measures
6. Add additional features

## REQUIREMENTS
### Authentication
- Secure Okta integration
- MFA for admin users
- Token management
- Session handling

### UI Requirements
- Angular Material components
- Responsive design
- File upload functionality
  - Drag and drop
  - File browser
  - Progress indication
  - File type validation (.csv, .txt)

### Future Expansion
- AWS S3 integration
- Additional management pages
- Enhanced file processing
- Extended platform features