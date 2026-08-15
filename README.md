# LocalLift AI

An AI-powered marketing and management suite designed for local businesses. This application provides tools to generate SEO content, respond to customer reviews, create ad copy, and manage subscriptions seamlessly.

## 🚀 Features

- **SEO Maker:** Generate optimized content and meta tags to improve local search rankings.
- **Review Responder:** Craft professional, AI-assisted responses to customer reviews.
- **Ad Copywriter:** Create high-converting ad copy for various platforms.
- **Billing & Subscriptions:** Integrated payment gateway using Stripe for secure subscription management (Starter & Pro plans).
- **Modern Dashboard:** Clean, responsive UI built with Tailwind CSS and Lucide icons.

## 💻 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Payments:** [Stripe](https://stripe.com/)

## 🛠️ Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

### Environment Variables

Rename `.env.example` to `.env.local` and fill in your specific keys. You will need a Stripe account to enable the billing features:

```env
# Your application URL (e.g., http://localhost:3000 for local development)
APP_URL="http://localhost:3000"

# Stripe API Keys (Get these from your Stripe Developer Dashboard)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID="price_..."
```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌍 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. 

Remember to add your Environment Variables (`STRIPE_SECRET_KEY`, etc.) into your deployment platform's settings before launching!
