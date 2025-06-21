// ===== 1. MongoDB Business Data API =====
// File: pages/api/business/[id].js (Next.js) or routes/business.js (Express)

import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('startup_advisor');
  }
  return db;
}

// ===== Get Business Data Endpoint =====
// GET /api/business/[businessId]
export default async function handler(req, res) {
  const { id: businessId } = req.query;
  
  if (req.method === 'GET') {
    try {
      const database = await connectToDatabase();
      const business = await database
        .collection('businesses')
        .findOne({ businessId });
      
      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }
      
      res.json(business);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch business data' });
    }
  } else if (req.method === 'PUT') {
    // Update business data
    try {
      const database = await connectToDatabase();
      const updateData = {
        ...req.body,
        lastUpdated: new Date().toISOString()
      };
      
      const result = await database
        .collection('businesses')
        .updateOne(
          { businessId },
          { $set: updateData },
          { upsert: true }
        );
      
      res.json({ success: true, result });
    } catch (error) {
      console.error('Database update error:', error);
      res.status(500).json({ error: 'Failed to update business data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// ===== 2. Enhanced OpenAI API with Business Context =====
// File: pages/api/openai-voice.js (Next.js)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, businessData, businessId } = req.body;
  
  try {
    // Create detailed business context for OpenAI
    const businessContext = businessData ? `
BUSINESS CONTEXT:
- Company: ${businessData.companyName}
- Industry: ${businessData.industry}
- Stage: ${businessData.stage}
- Monthly Revenue: $${businessData.monthlyRevenue?.toLocaleString()}
- Monthly Burn Rate: $${businessData.burnRate?.toLocaleString()}
- Team Size: ${businessData.teamSize} people
- Customer Count: ${businessData.customerCount?.toLocaleString()}
- Churn Rate: ${businessData.churnRate}%
- Customer Acquisition Cost (CAC): $${businessData.cac}
- Customer Lifetime Value (LTV): $${businessData.ltv}
- LTV/CAC Ratio: ${businessData.ltv && businessData.cac ? (businessData.ltv / businessData.cac).toFixed(2) : 'N/A'}
- Market Size: $${businessData.marketSize?.toLocaleString()}
- Runway: ${businessData.monthlyRevenue && businessData.burnRate ? 
  Math.floor((businessData.monthlyRevenue * 6) / businessData.burnRate) : 'Unknown'} months
- Last Updated: ${businessData.lastUpdated}

CALCULATED INSIGHTS:
- Revenue Growth Rate: ${calculateGrowthRate(businessData)}
- Burn Multiple: ${businessData.burnRate && businessData.monthlyRevenue ? 
  (businessData.burnRate / businessData.monthlyRevenue).toFixed(2) : 'N/A'}
- Unit Economics Health: ${assessUnitEconomics(businessData)}
` : 'No business data available';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert startup advisor with access to real-time business data. 

${businessContext}

Provide specific, actionable advice based on the actual business metrics above. When giving advice:
1. Reference specific numbers from their business data
2. Compare against industry benchmarks when relevant
3. Prioritize the most critical issues first
4. Be encouraging but realistic
5. Provide concrete next steps
6. Keep responses conversational for voice interaction (avoid bullet points, use natural speech patterns)

If the user asks general questions, contextualize your answer with their specific business situation.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    
    // Log the interaction for analytics
    await logInteraction(businessId, message, response);
    
    res.json({ message: response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
}

// Helper functions
function calculateGrowthRate(businessData) {
  // This would typically compare current revenue to previous periods
  // For now, return a placeholder
  return "Calculate from historical data";
}

function assessUnitEconomics(businessData) {
  if (!businessData.ltv || !businessData.cac) return "Insufficient data";
  const ratio = businessData.ltv / businessData.cac;
  if (ratio >= 3) return "Healthy";
  if (ratio >= 2) return "Acceptable";
  return "Needs improvement";
}

async function logInteraction(businessId, question, response) {
  try {
    const database = await connectToDatabase();
    await database.collection('chat_logs').insertOne({
      businessId,
      question,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
}

// ===== 3. Business Registration/Update API =====
// File: pages/api/business/register.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const database = await connectToDatabase();
    const businessData = {
      businessId: req.body.businessId || `business_${Date.now()}`,
      companyName: req.body.companyName,
      industry: req.body.industry,
      stage: req.body.stage,
      monthlyRevenue: parseFloat(req.body.monthlyRevenue) || 0,
      burnRate: parseFloat(req.body.burnRate) || 0,
      teamSize: parseInt(req.body.teamSize) || 0,
      customerCount: parseInt(req.body.customerCount) || 0,
      churnRate: parseFloat(req.body.churnRate) || 0,
      cac: parseFloat(req.body.cac) || 0,
      ltv: parseFloat(req.body.ltv) || 0,
      marketSize: parseFloat(req.body.marketSize) || 0,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const result = await database
      .collection('businesses')
      .insertOne(businessData);

    res.json({ 
      success: true, 
      businessId: businessData.businessId,
      insertedId: result.insertedId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register business' });
  }
}

// ===== 4. Express.js Version (Alternative) =====
// File: server.js or routes/api.js

const express = require('express');
const { MongoClient } = require('mongodb');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('startup_advisor');
  }
  return db;
}

// Get business data
app.get('/api/business/:id', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const business = await database
      .collection('businesses')
      .findOne({ businessId: req.params.id });
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business data' });
  }
});

// Update business data
app.put('/api/business/:id', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const updateData = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    
    await database
      .collection('businesses')
      .updateOne(
        { businessId: req.params.id },
        { $set: updateData },
        { upsert: true }
      );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update business data' });
  }
});

// Voice chatbot endpoint
app.post('/api/openai-voice', async (req, res) => {
  const { message, businessData, businessId } = req.body;
  
  try {
    const businessContext = createBusinessContext(businessData);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert startup advisor with access to real-time business data. ${businessContext} Provide specific, actionable advice based on the actual business metrics. Keep responses conversational for voice interaction.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

function createBusinessContext(businessData) {
  if (!businessData) return 'No business data available';
  
  return `
BUSINESS CONTEXT:
- Company: ${businessData.companyName}
- Industry: ${businessData.industry}
- Monthly Revenue: $${businessData.monthlyRevenue?.toLocaleString()}
- Burn Rate: $${businessData.burnRate?.toLocaleString()}
- Churn Rate: ${businessData.churnRate}%
- CAC: $${businessData.cac}, LTV: $${businessData.ltv}
`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ===== 5. Environment Variables (.env) =====
/*
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/startup_advisor
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/startup_advisor
*/

// ===== 6. Package.json Dependencies =====
/*
{
  "dependencies": {
    "openai": "^4.0.0",
    "mongodb": "^6.0.0",
    "next": "^14.0.0", // for Next.js
    "express": "^4.18.0", // for Express
    "cors": "^2.8.5" // for Express CORS
  }
}
*/