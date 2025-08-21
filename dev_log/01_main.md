# Project Plan and Dev Log

This project creates and documents the development of a personal website for the AWS Builder Challenge #2 using Micromanaged Driven Development (MMDD) principles.

## Structure

Each unit represents a major phase in the development, and optional subunits capture specific design or implementation tasks. Files follow the naming convention:

```
<sequence>_<unitname>[_subunit].md
```

For example: `02_content.md` or `05_api-chat_prompt.md`.

## About the Project

### What This Is

A chat-style personal "About Me" website with the following sections: About, Blog, Projects, Poetry, and Contact. Each section is presented as a static chat transcript, with optional live Q\&A powered by Amazon Bedrock (Titan Text-Lite). The project is built to comply with the AWS Builder Challenge rules: HTTPS, working contact form, open-source code, and substantial use of Q Developer.

### Architecture

* **Frontend:** Next.js + Tailwind + `assistant-ui` for the chat interface
* **Static Content:** JSON/Markdown transcripts in S3, served via CloudFront with ACM certificate
* **APIs:** API Gateway + Lambda

  * `/api/chat`: Titan Text-Lite with context snippets
  * `/api/contact`: SES send + optional S3 store
  * `/api/human`: Human verification (bot checks, CAPTCHA)
* **Safety:** Pre-checks in Lambda (regex, max length, rate limits), strict system prompt, conditional Guardrails
* **Deployment:** Amplify Hosting or GitHub Actions → S3 + CloudFront invalidation

### Technical Stack

* **Languages:** TypeScript, React/Next.js
* **Styling:** TailwindCSS
* **Components:** assistant-ui
* **Cloud:** AWS S3, CloudFront, API Gateway, Lambda, SES, Bedrock Titan Lite
* **AI Tools:** Amazon Q Developer CLI, Bedrock Guardrails (conditional)
* **Version Control:** GitHub (MIT License)

## Project Status

### Overall Completion

Planned, not yet started. Target delivery aligns with challenge deadline (Aug 26, 2025).

### Completed Features

*(To be updated as units progress)*

## Units Implemented

### Completed Units

* **00**: MMDD Principles (imported from base repo)
* **002_frontend_001**: Frontend Setup - Next.js, TypeScript, Tailwind CSS, essential dependencies ✅
* **002_frontend_002**: Assistant-UI Chat Integration - Functional chat interface with responsive design ✅
* **002_frontend_003**: Static Conversations - Rich content system with interactive chat flows ✅

### Units In Progress

* **01\_main**: Project Plan and Dev Log — status: Updated with Unit 2.3 completion

## Planned Units

* **02\_frontend**: Frontend development with React, Tailwind, and chat UI
  * **002\_frontend\_001**: Setup React, Tailwind and basic tools in s3/frontend directory
  * **002\_frontend\_002**: Add chat UI using assistant-ui package (reference tmp/ docs and repo)
  * **002\_frontend\_003**: Create cached conversations for Home (blog posts), Projects, About, Contact with placeholder content
  * **002\_frontend\_004**: Replace placeholders with real content rendered from .md files at build stage
* **03\_repository**: Bootstrap repo, license, README, CI skeleton
* **04\_api-chat**: Lambda for Titan Text-Lite prompt building and response
* **05\_api-contact**: Lambda for SES email sending and validation
* **06\_human-gate**: Bot/human check implementation
* **07\_infra**: IaC for S3, CloudFront, ACM, APIGW, Lambdas, SES
* **08\_ci-cd**: Amplify Hosting or GitHub Actions pipeline
* **09\_article**: AWS Builder Center submission article with screenshots, Q Developer usage
* **10\_polish**: CSS animations, theme toggle, performance pass
