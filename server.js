
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://0.0.0.0:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('.'));
app.use(express.static('dist'));

// In development, serve the old demo files
app.get('/old-demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'CRAV.html'));
});

app.get('/business', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// OpenAI configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// API endpoint for OpenAI chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, menuItems } = req.body;
    
    // If OpenAI API key is available, use AI
    if (OPENAI_API_KEY) {
      // Create menu list string for the system prompt
      const menuList = menuItems.map(item => 
        `- ${item.name} ($${item.price.toFixed(2)}): ${item.description}`
      ).join('\n');
      
      // Build conversation with system message first
      const conversationMessages = [
        { 
          role: 'system', 
          content: `You are CRAV AI, a meal planning assistant that only recommends meals from this specific menu:

${menuList}

IMPORTANT RULES:
- Only recommend meals that exist in the above menu
- Never create or suggest new meals not on this list
- When users ask for specific dietary needs, find 1-2 matching items from the menu
- Explain why each recommended meal fits their request
- If no perfect match exists, recommend the closest options and explain
- Keep responses concise and helpful
- Remember previous context in our conversation` 
        },
        ...messages
      ];
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: conversationMessages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI API error');
      }

      return res.json({ 
        response: data.choices[0].message.content 
      });
    }
    
    // Fallback responses when no API key is available
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    let response = '';
    
    if (lastMessage.includes('spicy') || lastMessage.includes('hot')) {
      response = "For something spicy, I recommend the Spicy Lentil Soup or the Chili Lime Cauliflower! Both have great heat and flavor.";
    } else if (lastMessage.includes('protein') || lastMessage.includes('muscle')) {
      response = "For high protein options, try the Quinoa Chickpea Bowl or the Tempeh Power Plate - both are packed with plant-based protein!";
    } else if (lastMessage.includes('quick') || lastMessage.includes('fast')) {
      response = "For quick meals, I suggest the Tofu Scramble Bowl or the Avocado Kale Pasta - both are ready in no time!";
    } else if (lastMessage.includes('soup') || lastMessage.includes('warm')) {
      response = "Perfect for something warm! Try our Spicy Lentil Soup or the Alkaline Green Soup - both are comforting and nutritious.";
    } else if (lastMessage.includes('sweet')) {
      response = "For something with natural sweetness, the Sweet Potato Buddha Bowl or Coconut Millet Porridge are delicious options!";
    } else {
      response = "I'd love to help you find the perfect meal! Try telling me about your cravings - are you looking for something spicy, protein-packed, quick, or maybe something specific like soup or pasta?";
    }
    
    res.json({ response });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response. Please try again.' 
    });
  }
});

// Serve built Vue app assets with proper headers
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Serve other static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Vue SPA routes - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes and old demo
  if (req.path.startsWith('/api') || req.path.startsWith('/old-demo')) {
    return;
  }
  
  // Serve the Vue app
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🥑 CRAV server running on port ${PORT}`);
});
