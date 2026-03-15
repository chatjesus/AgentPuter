/**
 * Cloudflare Pages Function - Email Subscribe API
 * 
 * This handles email subscription requests and stores them in Cloudflare KV.
 * To use this, you need to:
 * 1. Create a KV namespace in Cloudflare Dashboard
 * 2. Bind it to this function with the name "SUBSCRIBERS"
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  try {
    const { email } = await request.json();
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Store in KV
    const timestamp = new Date().toISOString();
    const data = {
      email: normalizedEmail,
      subscribedAt: timestamp,
      source: 'landing-page',
      ip: request.headers.get('CF-Connecting-IP') || 'unknown',
      country: request.headers.get('CF-IPCountry') || 'unknown',
    };
    
    // Check if KV is bound
    if (!env.SUBSCRIBERS) {
      console.log('WARNING: KV namespace SUBSCRIBERS not bound!');
      console.log('Available env keys:', Object.keys(env));
    } else {
      // Use email as key for deduplication
      await env.SUBSCRIBERS.put(normalizedEmail, JSON.stringify(data));
      console.log(`Saved to KV: ${normalizedEmail}`);
    }
    
    // Log to console (visible in Cloudflare dashboard)
    console.log(`New subscriber: ${normalizedEmail}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed!' 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Subscribe error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
