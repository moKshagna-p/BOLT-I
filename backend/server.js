// ===== Express Server for Voice Startup Advisor =====

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch'); // For Node.js < 18
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);
let db;
async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('startup_advisor');
    console.log('Connected to MongoDB');
  }
  return db;
}

// ===== Helper Functions =====
function calculateRunway(businessData) {
  if (!businessData.burnRate || businessData.burnRate <= 0) return "Unknown";
  if (!businessData.monthlyRevenue) return Math.floor(12);
  const netBurn = businessData.burnRate - businessData.monthlyRevenue;
  if (netBurn <= 0) return "Profitable";
  const estimatedCash = businessData.burnRate * 6;
  return Math.floor(estimatedCash / netBurn);
}
function calculateBurnMultiple(businessData) {
  if (!businessData.burnRate || !businessData.monthlyRevenue) return "N/A";
  if (businessData.monthlyRevenue === 0) return "Infinite";
  const multiple = (businessData.burnRate / businessData.monthlyRevenue).toFixed(2);
  return multiple;
}
function assessUnitEconomics(businessData) {
  if (!businessData.ltv || !businessData.cac) return "Insufficient data";
  const ratio = businessData.ltv / businessData.cac;
  if (ratio >= 4) return "Excellent (4:1+)";
  if (ratio >= 3) return "Healthy (3:1)";
  if (ratio >= 2) return "Acceptable (2:1)";
  return "Needs improvement (<2:1)";
}
function assessChurnHealth(churnRate) {
  if (!churnRate) return "No data";
  if (churnRate <= 2) return "Excellent (<2%)";
  if (churnRate <= 5) return "Good (<5%)";
  if (churnRate <= 10) return "Acceptable (<10%)";
  return "High (>10% - needs attention)";
}
function assessRevenueHealth(businessData) {
  if (!businessData.monthlyRevenue) return "Pre-revenue stage";
  if (businessData.monthlyRevenue >= 100000) return "Strong revenue base";
  if (businessData.monthlyRevenue >= 10000) return "Growing revenue";
  return "Early revenue stage";
}
async function logInteraction(businessId, question, response) {
  try {
    const database = await connectToDatabase();
    await database.collection('chat_logs').insertOne({
      businessId,
      question,
      response,
      timestamp: new Date().toISOString(),
      service: 'gemini',
      responseLength: response.length
    });
  } catch (error) {
    console.error('Failed to log interaction:', error);
  }
}

// ===== API Endpoints =====
// GET /api/business/:id
app.get('/api/business/:id', async (req, res) => {
  const businessId = req.params.id;
  try {
    const database = await connectToDatabase();
    const business = await database
      .collection('businesses')
      .findOne({ businessId });
    if (!business) {
      // Return demo data if business not found
      const demoData = {
        businessId,
        companyName: "TechStartup Inc",
        industry: "SaaS",
        stage: "Series A",
        monthlyRevenue: 45000,
        burnRate: 25000,
        teamSize: 12,
        customerCount: 1200,
        churnRate: 5.2,
        cac: 150,
        ltv: 2400,
        marketSize: 50000000,
        lastUpdated: new Date().toISOString()
      };
      return res.json(demoData);
    }
    res.json(business);
  } catch (error) {
    console.error('Database error:', error);
    // Fallback to demo data on database error
    const demoData = {
      businessId,
      companyName: "TechStartup Inc",
      industry: "SaaS",
      stage: "Series A",
      monthlyRevenue: 45000,
      burnRate: 25000,
      teamSize: 12,
      customerCount: 1200,
      churnRate: 5.2,
      cac: 150,
      ltv: 2400,
      marketSize: 50000000,
      lastUpdated: new Date().toISOString()
    };
    res.json(demoData);
  }
});

// PUT /api/business/:id
app.put('/api/business/:id', async (req, res) => {
  const businessId = req.params.id;
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
});

// POST /api/business/register
app.post('/api/business/register', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const businessData = {
      businessId: req.body.businessId || `business_${Date.now()}`,
      companyName: req.body.companyName || 'Unnamed Company',
      industry: req.body.industry || 'Technology',
      stage: req.body.stage || 'Pre-seed',
      monthlyRevenue: parseFloat(req.body.monthlyRevenue) || 0,
      burnRate: parseFloat(req.body.burnRate) || 0,
      teamSize: parseInt(req.body.teamSize) || 1,
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
});

// POST /api/gemini-voice
app.post('/api/gemini-voice', async (req, res) => {
  const { message, businessData, businessId } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const businessContext = businessData ? `\nBUSINESS CONTEXT FOR ${businessData.companyName}:\n- Company: ${businessData.companyName}\n- Industry: ${businessData.industry}\n- Stage: ${businessData.stage}\n- Monthly Revenue: $${businessData.monthlyRevenue?.toLocaleString()}\n- Monthly Burn Rate: $${businessData.burnRate?.toLocaleString()}\n- Team Size: ${businessData.teamSize} people\n- Customer Count: ${businessData.customerCount?.toLocaleString()}\n- Churn Rate: ${businessData.churnRate}%\n- Customer Acquisition Cost (CAC): $${businessData.cac}\n- Customer Lifetime Value (LTV): $${businessData.ltv}\n- LTV/CAC Ratio: ${businessData.ltv && businessData.cac ? (businessData.ltv / businessData.cac).toFixed(2) : 'N/A'}\n- Market Size: $${businessData.marketSize?.toLocaleString()}\n- Estimated Runway: ${calculateRunway(businessData)} months\n- Last Updated: ${businessData.lastUpdated}\n\nKEY METRICS ANALYSIS:\n- Revenue Growth: ${assessRevenueHealth(businessData)}\n- Burn Multiple: ${calculateBurnMultiple(businessData)}\n- Unit Economics: ${assessUnitEconomics(businessData)}\n- Churn Health: ${assessChurnHealth(businessData.churnRate)}\n` : 'No specific business data available - provide general startup advice.';
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 300,
      },
    });
    const systemPrompt = `You are an expert startup advisor with deep knowledge of business metrics and growth strategies. You have access to real-time business data and provide personalized advice.\n\n${businessContext}\n\nRESPONSE GUIDELINES:\n1. Reference specific numbers from their business data when available\n2. Compare against industry benchmarks (3:1 LTV:CAC ratio, <5% monthly churn for SaaS, etc.)\n3. Prioritize the most critical issues first\n4. Be encouraging but realistic\n5. Provide 2-3 concrete, actionable next steps\n6. Keep responses conversational and suitable for voice interaction\n7. Limit response to 120-150 words for optimal voice playback\n8. Use a friendly, professional tone\n9. Avoid bullet points - use natural speech patterns\n10. When giving numbers, say them in a natural way (e.g., "forty-five thousand" not "$45,000")\n\nIf the user asks general questions, contextualize your answer with their specific business situation when possible.`;
    const prompt = `${systemPrompt}\n\nUser question: ${message}\n\nPlease provide specific, actionable advice:`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text
      .replace(/\*/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    await logInteraction(businessId, message, cleanedText);
    res.json({ message: cleanedText });
  } catch (error) {
    console.error('Gemini API error:', error);
    const fallbackResponse = "I'm having trouble accessing my AI capabilities right now. However, based on general startup best practices, I'd recommend focusing on your key metrics like customer acquisition cost, churn rate, and monthly recurring revenue. Would you like to try asking your question again?";
    res.json({ message: fallbackResponse });
  }
});

// POST /api/elevenlabs-tts
app.post('/api/elevenlabs-tts', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  if (text.length > 2500) {
    return res.status(400).json({ error: 'Text too long for speech synthesis' });
  }
  try {
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }
    console.log('Generating speech for text length:', text.length);
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Eleven Labs API error:', response.status, errorText);
      if (response.status === 401) {
        throw new Error('Invalid ElevenLabs API key');
      } else if (response.status === 429) {
        throw new Error('ElevenLabs rate limit exceeded');
      } else {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }
    }
    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());
    res.setHeader('Cache-Control', 'no-cache');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===== Authentication Endpoints =====

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const database = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await database.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const result = await database.collection('users').insertOne(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const database = await connectToDatabase();
    
    // Find user
    const user = await database.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await database.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date().toISOString() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const database = await connectToDatabase();
    const user = await database.collection('users').findOne(
      { _id: new MongoClient.ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// POST /api/user/role - Store user role selection
app.post('/api/user/role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['startup', 'investor'].includes(role)) {
      return res.status(400).json({ error: 'Valid role is required (startup or investor)' });
    }

    const database = await connectToDatabase();
    
    // Update user with role
    const result = await database.collection('users').updateOne(
      { _id: new MongoClient.ObjectId(req.user.userId) },
      { 
        $set: { 
          role: role,
          roleUpdatedAt: new Date().toISOString()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Role updated successfully',
      role: role
    });

  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// POST /api/user/startup-details - Store startup details
app.post('/api/user/startup-details', authenticateToken, async (req, res) => {
  try {
    const {
      companyName,
      industry,
      stage,
      description,
      teamSize,
      monthlyRevenue,
      fundingNeeded,
      website,
      location,
      monthlyData
    } = req.body;

    if (!companyName || !industry || !stage || !description) {
      return res.status(400).json({ error: 'Required fields: companyName, industry, stage, description' });
    }

    const database = await connectToDatabase();
    
    // Create or update startup profile
    const startupData = {
      userId: req.user.userId,
      companyName,
      industry,
      stage,
      description,
      teamSize: teamSize || null,
      monthlyRevenue: monthlyRevenue || null,
      fundingNeeded: fundingNeeded || null,
      website: website || null,
      location: location || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await database.collection('startup_profiles').updateOne(
      { userId: req.user.userId },
      { $set: startupData },
      { upsert: true }
    );

    // Store monthly data if provided
    if (monthlyData && Array.isArray(monthlyData) && monthlyData.length > 0) {
      console.log('Storing monthly data for userId:', req.user.userId);
      console.log('Monthly data:', monthlyData);
      
      const monthlyResult = await database.collection('startup_monthly_data').updateOne(
        { userId: req.user.userId },
        { 
          $set: {
            userId: req.user.userId,
            monthlyData: monthlyData,
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );
      console.log('Monthly data storage result:', monthlyResult);
      
      // Also try with ObjectId format as backup
      try {
        const objectIdUserId = new MongoClient.ObjectId(req.user.userId);
        await database.collection('startup_monthly_data').updateOne(
          { userId: objectIdUserId },
          { 
            $set: {
              userId: objectIdUserId,
              monthlyData: monthlyData,
              updatedAt: new Date().toISOString()
            }
          },
          { upsert: true }
        );
        console.log('Also stored with ObjectId format');
      } catch (objectIdError) {
        console.log('ObjectId conversion failed (expected for string userIds):', objectIdError.message);
      }
    } else {
      console.log('No monthly data provided or invalid format');
    }

    res.json({
      success: true,
      message: 'Startup details saved successfully',
      profileId: result.upsertedId || 'updated'
    });

  } catch (error) {
    console.error('Startup details save error:', error);
    res.status(500).json({ error: 'Failed to save startup details' });
  }
});

// GET /api/user/startup-monthly-data - Get startup monthly data
app.get('/api/user/startup-monthly-data', authenticateToken, async (req, res) => {
  try {
    const database = await connectToDatabase();
    
    console.log('Fetching monthly data for userId:', req.user.userId);
    
    // Try to find with string userId first
    let monthlyData = await database.collection('startup_monthly_data').findOne(
      { userId: req.user.userId }
    );

    // If not found, try with ObjectId format
    if (!monthlyData) {
      try {
        const objectIdUserId = new MongoClient.ObjectId(req.user.userId);
        monthlyData = await database.collection('startup_monthly_data').findOne(
          { userId: objectIdUserId }
        );
        console.log('Found monthly data with ObjectId format');
      } catch (objectIdError) {
        console.log('ObjectId conversion failed (expected for string userIds):', objectIdError.message);
      }
    } else {
      console.log('Found monthly data with string format');
    }

    console.log('Found monthly data:', monthlyData);

    if (!monthlyData) {
      console.log('No monthly data found for user');
      return res.json({
        success: true,
        monthlyData: []
      });
    }

    res.json({
      success: true,
      monthlyData: monthlyData.monthlyData || []
    });

  } catch (error) {
    console.error('Get monthly data error:', error);
    res.status(500).json({ error: 'Failed to get monthly data' });
  }
});

// POST /api/user/startup-monthly-data - Update startup monthly data
app.post('/api/user/startup-monthly-data', authenticateToken, async (req, res) => {
  try {
    const { monthlyData } = req.body;

    if (!monthlyData || !Array.isArray(monthlyData)) {
      return res.status(400).json({ error: 'Monthly data array is required' });
    }

    const database = await connectToDatabase();
    
    const result = await database.collection('startup_monthly_data').updateOne(
      { userId: req.user.userId },
      { 
        $set: {
          userId: req.user.userId,
          monthlyData: monthlyData,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Monthly data saved successfully',
      dataId: result.upsertedId || 'updated'
    });

  } catch (error) {
    console.error('Monthly data save error:', error);
    res.status(500).json({ error: 'Failed to save monthly data' });
  }
});

// POST /api/user/investor-details - Store investor details
app.post('/api/user/investor-details', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      company,
      role,
      portfolioSize,
      investmentFocus,
      preferredStages,
      description,
      website,
      location,
      linkedin
    } = req.body;

    if (!fullName || !investmentFocus || !description) {
      return res.status(400).json({ error: 'Required fields: fullName, investmentFocus, description' });
    }

    const database = await connectToDatabase();
    
    // Create or update investor profile
    const investorData = {
      userId: req.user.userId,
      fullName,
      company: company || null,
      role: role || null,
      portfolioSize: portfolioSize || null,
      investmentFocus,
      preferredStages: preferredStages || null,
      description,
      website: website || null,
      location: location || null,
      linkedin: linkedin || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await database.collection('investor_profiles').updateOne(
      { userId: req.user.userId },
      { $set: investorData },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Investor details saved successfully',
      profileId: result.upsertedId || 'updated'
    });

  } catch (error) {
    console.error('Investor details save error:', error);
    res.status(500).json({ error: 'Failed to save investor details' });
  }
});

// GET /api/user/profile - Get user profile data
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const database = await connectToDatabase();
    
    // Get user with role
    const user = await database.collection('users').findOne(
      { _id: new MongoClient.ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profileData = null;

    // Get role-specific profile data
    if (user.role === 'startup') {
      profileData = await database.collection('startup_profiles').findOne(
        { userId: req.user.userId }
      );
    } else if (user.role === 'investor') {
      profileData = await database.collection('investor_profiles').findOne(
        { userId: req.user.userId }
      );
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      profile: profileData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// GET /api/debug/collections - Debug endpoint to check all collections
app.get('/api/debug/collections', async (req, res) => {
  try {
    const database = await connectToDatabase();
    
    // Get all collections
    const collections = await database.listCollections().toArray();
    
    const result = {};
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await database.collection(collectionName).countDocuments();
      const sampleData = await database.collection(collectionName).find().limit(2).toArray();
      
      result[collectionName] = {
        count: count,
        sampleData: sampleData
      };
    }
    
    res.json({
      success: true,
      database: 'startup_advisor',
      collections: result
    });

  } catch (error) {
    console.error('Debug collections error:', error);
    res.status(500).json({ error: 'Failed to get collections info' });
  }
});

// GET /api/debug/monthly-data/:userId - Debug endpoint to check monthly data for specific user
app.get('/api/debug/monthly-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const database = await connectToDatabase();
    
    const monthlyData = await database.collection('startup_monthly_data').findOne(
      { userId: userId }
    );
    
    const startupProfile = await database.collection('startup_profiles').findOne(
      { userId: userId }
    );
    
    res.json({
      success: true,
      userId: userId,
      monthlyData: monthlyData,
      startupProfile: startupProfile
    });

  } catch (error) {
    console.error('Debug monthly data error:', error);
    res.status(500).json({ error: 'Failed to get monthly data info' });
  }
});

// POST /api/test/insert-monthly-data - Test endpoint to manually insert monthly data
app.post('/api/test/insert-monthly-data', async (req, res) => {
  try {
    const { userId, monthlyData } = req.body;
    
    if (!userId || !monthlyData || !Array.isArray(monthlyData)) {
      return res.status(400).json({ error: 'userId and monthlyData array are required' });
    }

    const database = await connectToDatabase();
    
    const result = await database.collection('startup_monthly_data').updateOne(
      { userId: userId },
      { 
        $set: {
          userId: userId,
          monthlyData: monthlyData,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );

    console.log('Test insert result:', result);

    res.json({
      success: true,
      message: 'Test monthly data inserted successfully',
      result: result
    });

  } catch (error) {
    console.error('Test insert error:', error);
    res.status(500).json({ error: 'Failed to insert test monthly data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 