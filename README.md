knowledge-passion
This interactive web application enables individuals to explore and delve deeper into their areas of interest.
How It Works
To get started, a user inputs any subject they are passionate about, such as "Astrophysics," "Mechanical Keyboards," or "Procedural Generation." Leveraging Google’s Gemini API, the app constructs a visual mind map or "constellation" detailing interconnected concepts, sub-disciplines, techniques, and relevant projects. Users can click on individual nodes to discover new information, uncover unexpected connections, and preserve their exploration path. Additionally, the app features a passion score capable of analyzing the total depth and breadth of their fascination.
Explore your passion with AI-generated knowledge maps.

## Tech Stack
- Next.js, Tailwind, Gemini API

## Setup
1. Clone repo
2. `npm install`
3. Create `.env.local` with `GEMINI_API_KEY`
4. `npm run dev`

## Live Demo
[link after deployment] 

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/672840f7-f115-472c-be47-bd1a7d2b84e6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
