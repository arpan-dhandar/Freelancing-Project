/**
 * SCARR — Seed Script
 * Usage: node seed.js
 * Requires: MONGODB_URI in backend/.env
 *
 * Seeds: 55 Users (buyers + sellers) + 60 Gigs with rich, premium data
 * Uses Chance.js for realistic Gen-Z style data generation
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Chance from "chance";

dotenv.config();

const chance = new Chance();

// ── Inline schemas (mirrors existing models exactly) ─────────────────────────
const UserSchema = new mongoose.Schema(
  {
    username:  { type: String, required: true, unique: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    img:       String,
    country:   String,
    phone:     String,
    desc:      String,
    isSeller:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GigSchema = new mongoose.Schema(
  {
    userId:         { type: String, required: true },
    title:          { type: String, required: true },
    desc:           { type: String, required: true },
    totalStars:     { type: Number, default: 0 },
    starNumber:     { type: Number, default: 0 },
    cat:            { type: String, required: true },
    price:          { type: Number, required: true },
    cover:          { type: String },
    images:         [String],
    shortTitle:     String,
    shortDesc:      String,
    deliveryTime:   { type: Number, required: true },
    revisionNumber: Number,
    features:       [String],
    sales:          { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ReviewSchema = new mongoose.Schema(
  {
    gigId:  { type: String, required: true },
    userId: { type: String, required: true },
    star:   { type: Number, required: true },
    desc:   { type: String, required: true },
  },
  { timestamps: true }
);

const User   = mongoose.models.User   || mongoose.model("User",   UserSchema);
const Gig    = mongoose.models.Gig    || mongoose.model("Gig",    GigSchema);
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

// ── Static pools ─────────────────────────────────────────────────────────────

const CATEGORIES = ["design", "web-dev", "writing", "video", "photo", "consulting"];

const COVERS = {
  design:     ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
                "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80",
                "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80"],
  "web-dev":  ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
                "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80",
                "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80"],
  writing:    ["https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
                "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&q=80",
                "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80"],
  video:      ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
                "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
                "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=800&q=80"],
  photo:      ["https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=80",
                "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
                "https://images.unsplash.com/photo-1452780212461-a8f84aa56cb4?w=800&q=80"],
  consulting: ["https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"],
};

const COUNTRIES = [
  "United States","United Kingdom","Germany","Japan","Netherlands","France",
  "Canada","Australia","Sweden","Brazil","India","Spain","Singapore","South Korea",
];

// Gen-Z style handle prefixes and suffixes
const HANDLE_PREFIXES = [
  "kai","nova","lex","rio","zara","theo","luna","milo","aria","finn",
  "sky","eden","remy","juno","axel","cleo","dex","ivy","neo","sage",
  "bex","cruz","lux","poet","vex","onyx","zion","lyra","cole","echo",
];
const HANDLE_SUFFIXES = [
  "_design","_builds","_creates","_studio","_works","_dev","_fx","_codes",
  "_labs","_hq","_io","_co","_pro","_xyz","_art","_tech","_motion","_craft",
  "designs","builds","writes","creates","codes","shoots","edits","makes",
];

// Premium gig title templates per category
const GIG_TEMPLATES = {
  design: [
    { title: "Premium Brand Identity & Logo Design",        short: "Complete brand identity with logo, palette & guidelines" },
    { title: "Minimal UI/UX Design for Web & Mobile",       short: "Clean, conversion-focused interfaces in Figma" },
    { title: "Custom Illustration & Visual Art Direction",   short: "Bespoke illustrations that tell your brand story" },
    { title: "Packaging & Product Design System",           short: "Shelf-ready packaging with brand-consistent system" },
    { title: "Editorial & Magazine Layout Design",          short: "Typographic layouts for print and digital publications" },
    { title: "Social Media Brand Kit & Templates",          short: "Cohesive templates for Instagram, LinkedIn & beyond" },
    { title: "Pitch Deck & Investor Presentation Design",   short: "Data-driven slides that raise rounds" },
    { title: "Icon Set & Design System Creation",           short: "Scalable icon libraries for product teams" },
    { title: "Motion Graphics & Animated Brand Assets",     short: "Looping animations for web and social" },
    { title: "3D Product Visualisation & Rendering",        short: "Photorealistic 3D renders for e-commerce & ads" },
  ],
  "web-dev": [
    { title: "Full-Stack React & Node.js Web Application",  short: "Production-grade apps with auth, API & database" },
    { title: "Next.js SEO-Optimised Website Development",   short: "Fast, indexable sites with server-side rendering" },
    { title: "E-Commerce Store Build (Shopify / Custom)",   short: "Revenue-ready stores with custom checkout flows" },
    { title: "REST & GraphQL API Architecture",             short: "Scalable backend APIs with docs & testing" },
    { title: "Web Performance Audit & Core Web Vitals Fix", short: "Get to 95+ Lighthouse across all metrics" },
    { title: "Chrome Extension Development",                short: "Manifest v3 extensions shipped to the Chrome Store" },
    { title: "Database Design & Migration (PostgreSQL)",    short: "Optimised schemas, indexing & zero-downtime migrations" },
    { title: "DevOps Setup — CI/CD, Docker & AWS Deploy",  short: "Production-ready pipelines with auto-deployment" },
    { title: "React Native iOS & Android App",              short: "Cross-platform mobile with native performance" },
    { title: "AI / LLM Integration into Your Product",     short: "GPT-4, Claude & embedding pipelines for your app" },
  ],
  writing: [
    { title: "High-Converting Landing Page Copywriting",    short: "Headlines and hooks that turn visitors into buyers" },
    { title: "Long-Form SEO Blog Content Strategy",         short: "Research-backed articles that rank and convert" },
    { title: "Brand Voice Guide & Messaging Framework",     short: "Tone of voice, taglines & key messages" },
    { title: "Email Marketing Sequences & Drip Campaigns",  short: "Open-worthy sequences with measurable lift" },
    { title: "Ghostwriting — Books, Essays & LinkedIn",     short: "Your ideas, professionally written under your name" },
    { title: "UX Writing & In-Product Microcopy",           short: "Error messages, onboarding, tooltips & empty states" },
    { title: "Press Release & Media Pitch Writing",         short: "Newsworthy angles that journalists actually open" },
    { title: "Technical Documentation & API Guides",        short: "Clear docs that developers love" },
    { title: "Startup Pitch Narrative & Storytelling",      short: "Investor-ready narratives for decks and websites" },
    { title: "Social Media Content Calendar & Scripts",     short: "30-day content plans with hooks and captions" },
  ],
  video: [
    { title: "Cinematic Brand Video & Commercial Production",short: "Broadcast-quality brand films" },
    { title: "YouTube Channel Setup & Video Editing",        short: "Hook-first editing that retains viewers" },
    { title: "Explainer Video & Motion Graphics",            short: "Complex ideas made beautifully simple" },
    { title: "Podcast Editing & Video Podcast Production",   short: "Studio-quality audio with dynamic visuals" },
    { title: "Short-Form Content — Reels, TikTok, Shorts",  short: "Vertical video optimised for algorithm growth" },
    { title: "Documentary-Style Company Story Film",         short: "Authentic storytelling for About pages & pitches" },
    { title: "Product Demo & Feature Walkthrough Video",     short: "Screen + camera recording with professional edit" },
    { title: "Event Coverage & Highlight Reel",              short: "Same-day edits and polished multi-cam cuts" },
  ],
  photo: [
    { title: "E-Commerce & Amazon Product Photography",      short: "White-background and lifestyle shots that sell" },
    { title: "Brand & Editorial Portrait Photography",       short: "Headshots and team photos with creative direction" },
    { title: "Food & Beverage Photography for Menus & Ads",  short: "Mouthwatering visuals for restaurants and brands" },
    { title: "Architecture & Real Estate Photography",       short: "Interior and exterior shoots with twilight option" },
    { title: "Fashion Lookbook & Campaign Photography",      short: "Creative direction and full-day production" },
    { title: "Photo Retouching & High-End Post Processing",  short: "Skin retouching, compositing and colour grading" },
  ],
  consulting: [
    { title: "Go-To-Market Strategy for SaaS Startups",     short: "ICP, positioning and launch playbook" },
    { title: "SEO Audit, Strategy & 90-Day Growth Plan",    short: "Technical + content roadmap with quick wins" },
    { title: "Fundraising Strategy & Investor Intro",        short: "Deck review, narrative coaching and warm intros" },
    { title: "Product Strategy & Roadmap Workshop",          short: "3-hour session → prioritised 6-month roadmap" },
    { title: "Paid Ads Audit & Performance Marketing Setup", short: "Google, Meta & LinkedIn campaigns that scale" },
    { title: "Brand Strategy & Market Positioning",          short: "Competitor analysis, differentiation and messaging" },
    { title: "Financial Modelling & Startup Metrics Setup",  short: "P&L, unit economics and investor-ready dashboards" },
  ],
};

const FEATURES_POOL = {
  design:     ["Source files (AI, EPS, SVG, Figma)","Commercial license included","Brand guidelines PDF","Unlimited colour variations","Print-ready exports","3 rounds of revisions","48h first draft turnaround"],
  "web-dev":  ["Full source code on GitHub","Responsive across all devices","Unit & integration tests","CI/CD pipeline setup","60-day bug-fix guarantee","Documentation & README","Performance optimised (95+ Lighthouse)"],
  writing:    ["SEO keyword research included","Royalty-free stock images sourced","Plagiarism report","2 rounds of revisions","Meta title & description","Internal linking strategy","Competitor gap analysis"],
  video:      ["4K footage delivery","Colour graded with LUTs","Licensed background music","Subtitles / SRT file","Social-optimised versions","Raw files on request","48h turnaround available"],
  photo:      ["High-resolution TIFF + JPEG delivery","Full retouching included","Commercial license","Same-day turnaround available","Mood board creation","Creative direction call"],
  consulting: ["Recorded strategy session","Detailed action plan PDF","30-day async follow-up","Competitor benchmarking","Priority Slack access","Custom templates & frameworks"],
};

const REVIEW_COMMENTS = [
  "Genuinely one of the best freelancers I've ever worked with. Delivered ahead of schedule and the quality blew us away.",
  "Communication was 10/10. They flagged potential issues before they became problems. Will absolutely hire again.",
  "The final deliverable was exactly what we needed. Zero revisions required — got it perfect first time.",
  "Exceeded expectations at every stage. The attention to detail is unmatched.",
  "Super responsive, professional, and the work speaks for itself. Highly recommend.",
  "We've hired 20+ freelancers on this platform and this person is genuinely top tier.",
  "Took our scrappy brief and turned it into something we're proud to show clients. Worth every penny.",
  "Fast turnaround without sacrificing quality. Rare combination. Booked them for our next project already.",
  "Incredible strategic thinking combined with flawless execution. They think like a founder.",
  "Our conversion rate went up 34% after the copy was rewritten. Results speak for themselves.",
  "The design system they built saved us months of internal work. Already used on 3 products.",
  "Brilliant communicator, creative thinker, and just really lovely to work with. A+",
  "Delivered more than what was scoped, on time, and under budget. Rare and very appreciated.",
  "Our investors specifically mentioned the pitch deck design in their due diligence notes. That says it all.",
  "The video content they created got 2M views organically. No paid spend. Just great storytelling.",
];

// ── Generators ────────────────────────────────────────────────────────────────

function genUsername() {
  const prefix = chance.pickone(HANDLE_PREFIXES);
  const suffix = chance.pickone(HANDLE_SUFFIXES);
  const num    = chance.bool({ likelihood: 30 }) ? chance.integer({ min: 1, max: 99 }) : "";
  return `${prefix}${suffix}${num}`;
}

function genSellerDesc(cat) {
  const yoe  = chance.integer({ min: 3, max: 12 });
  const openers = [
    `${yoe}-year veteran in ${cat} who's worked with Y Combinator startups, Fortune 500s, and everything in between.`,
    `Former agency creative director, now going independent. ${yoe} years of experience, zero corporate overhead.`,
    `Self-taught and obsessed. ${yoe} years building things on the internet that people actually use.`,
    `I left a senior role at a top design studio to work directly with founders. ${yoe} years of premium work.`,
    `Product of the internet. ${yoe} years freelancing for clients across 30+ countries.`,
  ];
  return chance.pickone(openers) + " DMs open. Let's build something worth talking about.";
}

function genGigDesc(template, cat) {
  const paragraphs = [
    `Your ${cat === "web-dev" ? "product" : "brand"} is your most important asset — and most teams treat it like an afterthought. I don't.`,
    `I've spent years refining the exact process that gets results fast without cutting corners. Every engagement starts with a deep discovery phase so the output is strategic, not just aesthetic.`,
    `${template.short}. I've delivered this exact service for clients ranging from seed-stage startups to publicly traded companies — and the process works every time.`,
    `Here's what working with me looks like: clear brief → fast first draft → tight revision loop → polished final delivery. No endless back-and-forth. No surprises.`,
    `Ready to get started? Drop me a message with your brief and I'll come back with a honest assessment of scope and timeline within 24 hours.`,
  ];
  return paragraphs.join("\n\n");
}

function pickFeatures(cat) {
  const pool = FEATURES_POOL[cat] || FEATURES_POOL.design;
  return chance.pickset(pool, chance.integer({ min: 4, max: Math.min(6, pool.length) }));
}

function randomPrice(cat) {
  const ranges = {
    design:     [149, 999],
    "web-dev":  [299, 1999],
    writing:    [99,  599],
    video:      [199, 999],
    photo:      [199, 799],
    consulting: [149, 999],
  };
  const [min, max] = ranges[cat] || [99, 499];
  // Round to nice numbers
  const raw = chance.integer({ min, max });
  return Math.round(raw / 50) * 50 || min;
}

// ── Main seed function ────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected.\n");

  // Wipe existing seed data
  await User.deleteMany({});
  await Gig.deleteMany({});
  await Review.deleteMany({});
  console.log("🗑️  Cleared existing data.\n");

  const hashedPassword = await bcrypt.hash("scarr1234", 10);

  // ── Create Users ─────────────────────────────────────────────────────────
  const usedUsernames = new Set();
  const usedEmails    = new Set();

  // 5 fixed showcase sellers (high quality, known handles)
  const showcaseSellers = [
    { username: "anouk_design",  email: "anouk@scarr.io",   country: "Netherlands",  img: "https://i.pravatar.cc/150?img=1",  isSeller: true,  desc: "Senior brand designer, 8 years. Former creative director at Wieden+Kennedy Amsterdam. Obsessed with typography and negative space." },
    { username: "kai_builds",    email: "kai@scarr.io",     country: "Japan",        img: "https://i.pravatar.cc/150?img=5",  isSeller: true,  desc: "Full-stack engineer (React, Node, PostgreSQL). I turn Figma files into production apps. Ex-Mercari." },
    { username: "lena_writes",   email: "lena@scarr.io",    country: "Germany",      img: "https://i.pravatar.cc/150?img=9",  isSeller: true,  desc: "B2B SaaS copywriter and brand strategist. My words have helped raise $40M in funding and 2x conversion rates." },
    { username: "omar_motion",   email: "omar@scarr.io",    country: "UAE",          img: "https://i.pravatar.cc/150?img=12", isSeller: true,  desc: "Cinematic brand filmmaker and motion designer. Clients include Adidas, Noon, and 40+ startups." },
    { username: "priya_mobile",  email: "priya@scarr.io",   country: "India",        img: "https://i.pravatar.cc/150?img=16", isSeller: true,  desc: "React Native specialist. 60+ apps shipped on App Store and Play Store. Ex-Flipkart mobile team." },
  ];

  for (const u of showcaseSellers) {
    usedUsernames.add(u.username);
    usedEmails.add(u.email);
  }

  // Generate 30 more sellers + 20 buyers dynamically
  const generatedSellers = [];
  while (generatedSellers.length < 30) {
    const username = genUsername();
    const email    = `${username.replace(/[^a-z0-9]/gi, "")}@example.com`;
    if (usedUsernames.has(username) || usedEmails.has(email)) continue;
    usedUsernames.add(username);
    usedEmails.add(email);
    const cat = chance.pickone(CATEGORIES);
    generatedSellers.push({
      username,
      email,
      country:  chance.pickone(COUNTRIES),
      img:      `https://i.pravatar.cc/150?img=${chance.integer({ min: 20, max: 70 })}`,
      isSeller: true,
      desc:     genSellerDesc(cat),
    });
  }

  const buyers = [];
  while (buyers.length < 20) {
    const username = genUsername() + "_buyer";
    const email    = `${username.replace(/[^a-z0-9]/gi, "")}@example.com`;
    if (usedUsernames.has(username) || usedEmails.has(email)) continue;
    usedUsernames.add(username);
    usedEmails.add(email);
    buyers.push({
      username,
      email,
      country:  chance.pickone(COUNTRIES),
      img:      `https://i.pravatar.cc/150?img=${chance.integer({ min: 71, max: 99 })}`,
      isSeller: false,
      desc:     "",
    });
  }

  const allUserData = [...showcaseSellers, ...generatedSellers, ...buyers];

  const insertedUsers = await User.insertMany(
    allUserData.map((u) => ({ ...u, password: hashedPassword }))
  );

  const sellers = insertedUsers.filter((u) => u.isSeller);
  const buyerUsers = insertedUsers.filter((u) => !u.isSeller);

  console.log(`👤 Created ${insertedUsers.length} users (${sellers.length} sellers, ${buyerUsers.length} buyers)`);

  // ── Create Gigs ───────────────────────────────────────────────────────────
  const gigsToInsert = [];

  // Showcase gigs for fixed sellers
  const showcaseGigs = [
    {
      sellerIndex: 0, cat: "design",
      title: "Premium Brand Identity & Logo Design",
      shortTitle: "Full Brand Identity Package",
      shortDesc: "Complete brand identity: logo, colour palette, typography & brand guidelines PDF.",
      price: 499, deliveryTime: 7, revisionNumber: 3, sales: 127,
      cover: COVERS.design[0],
      totalStars: 630, starNumber: 127,
      features: ["Logo in all formats (AI, EPS, SVG, PNG)","Brand guidelines PDF","Colour palette & typography system","3 revision rounds","Commercial license","48h first concepts"],
    },
    {
      sellerIndex: 1, cat: "web-dev",
      title: "Full-Stack React & Node.js Web Application",
      shortTitle: "Production-Grade Web App",
      shortDesc: "Full-stack app with auth, REST API, MongoDB, and deployment.",
      price: 999, deliveryTime: 14, revisionNumber: 2, sales: 89,
      cover: COVERS["web-dev"][0],
      totalStars: 445, starNumber: 89,
      features: ["Full source code on GitHub","JWT auth system","RESTful API with Swagger docs","MongoDB / PostgreSQL","CI/CD with GitHub Actions","60-day bug-fix guarantee","Fully responsive"],
    },
    {
      sellerIndex: 2, cat: "writing",
      title: "High-Converting Landing Page Copywriting",
      shortTitle: "Landing Page Copy That Converts",
      shortDesc: "Headlines, hooks, and body copy engineered for conversion.",
      price: 299, deliveryTime: 5, revisionNumber: 3, sales: 214,
      cover: COVERS.writing[0],
      totalStars: 1070, starNumber: 214,
      features: ["Headline & sub-headline variations","Above-the-fold hero copy","Feature-benefit copy blocks","FAQ section","CTA optimisation","SEO-ready meta copy","2 tone-of-voice options"],
    },
    {
      sellerIndex: 3, cat: "video",
      title: "Cinematic Brand Video & Commercial Production",
      shortTitle: "Brand Film (60–90 sec)",
      shortDesc: "Broadcast-quality brand film from concept to final cut.",
      price: 799, deliveryTime: 10, revisionNumber: 2, sales: 58,
      cover: COVERS.video[0],
      totalStars: 290, starNumber: 58,
      features: ["4K footage delivery","Professional colour grade","Licensed background music","3 social-optimised cuts","Subtitles / SRT","Raw footage on request","Storyboard & shot list"],
    },
    {
      sellerIndex: 4, cat: "web-dev",
      title: "React Native iOS & Android App",
      shortTitle: "Cross-Platform Mobile App",
      shortDesc: "Production React Native app, App Store & Play Store ready.",
      price: 1499, deliveryTime: 21, revisionNumber: 2, sales: 41,
      cover: COVERS["web-dev"][2],
      totalStars: 205, starNumber: 41,
      features: ["iOS & Android builds","Push notifications","Offline mode","App Store submission","60-day support","Clean architecture (MVVM)","Expo or bare workflow"],
    },
  ];

  for (const sg of showcaseGigs) {
    const seller = sellers[sg.sellerIndex];
    gigsToInsert.push({
      userId:         seller._id.toString(),
      title:          sg.title,
      shortTitle:     sg.shortTitle,
      shortDesc:      sg.shortDesc,
      desc:           genGigDesc({ short: sg.shortDesc }, sg.cat),
      cat:            sg.cat,
      price:          sg.price,
      cover:          sg.cover,
      images:         [sg.cover],
      deliveryTime:   sg.deliveryTime,
      revisionNumber: sg.revisionNumber,
      features:       sg.features,
      totalStars:     sg.totalStars,
      starNumber:     sg.starNumber,
      sales:          sg.sales,
    });
  }

  // Generate 55 more gigs spread across remaining sellers and categories
  const remainingSellers = sellers.slice(5);
  for (let i = 0; i < 55; i++) {
    const seller   = chance.pickone(remainingSellers);
    const cat      = chance.pickone(CATEGORIES);
    const templates = GIG_TEMPLATES[cat];
    const template  = chance.pickone(templates);
    const sales     = chance.integer({ min: 5, max: 180 });
    const avgStar   = chance.floating({ min: 4.1, max: 5.0, fixed: 1 });
    const covers    = COVERS[cat];

    gigsToInsert.push({
      userId:         seller._id.toString(),
      title:          template.title,
      shortTitle:     template.title.split("&")[0].trim(),
      shortDesc:      template.short,
      desc:           genGigDesc(template, cat),
      cat,
      price:          randomPrice(cat),
      cover:          chance.pickone(covers),
      images:         [chance.pickone(covers)],
      deliveryTime:   chance.pickone([3, 5, 7, 10, 14, 21]),
      revisionNumber: chance.pickone([1, 2, 3, 5]),
      features:       pickFeatures(cat),
      totalStars:     Math.round(avgStar * sales),
      starNumber:     sales,
      sales,
    });
  }

  const insertedGigs = await Gig.insertMany(gigsToInsert);
  console.log(`💼 Created ${insertedGigs.length} gigs`);

  // ── Create Reviews ────────────────────────────────────────────────────────
  const reviewsToInsert = [];
  for (const gig of insertedGigs) {
    const reviewCount = chance.integer({ min: 3, max: 12 });
    const shuffledBuyers = chance.shuffle([...buyerUsers]);
    for (let r = 0; r < Math.min(reviewCount, shuffledBuyers.length); r++) {
      reviewsToInsert.push({
        gigId:  gig._id.toString(),
        userId: shuffledBuyers[r]._id.toString(),
        star:   chance.weighted([5, 4, 3], [60, 30, 10]),
        desc:   chance.pickone(REVIEW_COMMENTS),
      });
    }
  }

  await Review.insertMany(reviewsToInsert);
  console.log(`⭐ Created ${reviewsToInsert.length} reviews`);

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log("\n✅ SCARR seeded successfully!\n");
  console.log("🔑 Test credentials (all accounts):");
  console.log("   Password: scarr1234");
  console.log("   Seller handles: anouk_design, kai_builds, lena_writes, omar_motion, priya_mobile");
  console.log("\n🚀 Run the backend and frontend to see your data live.\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
