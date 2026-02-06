---
title: OAuth Client SDK
sidebar_label: OAuth Client
description: OAuth 2.0 and OpenID Connect client SDK for secure authentication and authorization
tags:
  - sdk
  - oauth
  - authentication
  - security
---

# OAuth Client SDK

The OAuth Client SDK provides a complete OAuth 2.0 and OpenID Connect implementation for secure authentication, authorization, and user management.

## Installation

```bash
npm install @lanonasis/oauth-client
# or
yarn add @lanonasis/oauth-client
```

## Quick Start

```typescript
import { OAuthClient } from "@lanonasis/oauth-client";

// Initialize the client
const oauth = new OAuthClient({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  redirectUrl: "https://yourapp.com/auth/callback",
  authorizationUrl: "https://auth.lanonasis.com/authorize",
  tokenUrl: "https://auth.lanonasis.com/token",
});

// Get authorization URL
const authUrl = oauth.getAuthorizationUrl({
  scope: ["openid", "profile", "email"],
  state: "random-state-value",
});

// Redirect user to authUrl...

// Exchange code for token
const tokens = await oauth.exchangeCode("authorization-code");
console.log(tokens.accessToken);
console.log(tokens.idToken);
```

## OAuth 2.0 Flows

### Authorization Code Flow

Best for web applications with a backend.

```typescript
// Step 1: Get authorization URL
const authUrl = oauth.getAuthorizationUrl({
  scope: ["openid", "profile", "email"],
  state: generateRandomState(),
  codeChallenge: generatePKCE().challenge, // For PKCE
});

// Step 2: User logs in and grants permission
// Redirect user to authUrl

// Step 3: Handle callback
app.get("/auth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (state !== storedState) {
    return res.status(400).send("State mismatch");
  }

  const tokens = await oauth.exchangeCode(code as string, {
    codeVerifier: storedCodeVerifier, // For PKCE
  });

  // Store tokens securely
  req.session.accessToken = tokens.accessToken;

  res.redirect("/dashboard");
});
```

### Client Credentials Flow

For server-to-server authentication.

```typescript
const tokens = await oauth.getClientCredentials({
  scope: ["api:read", "api:write"],
});

// Use accessToken for API requests
const response = await fetch("https://api.lanonasis.com/v1/data", {
  headers: {
    Authorization: `Bearer ${tokens.accessToken}`,
  },
});
```

### Resource Owner Password Flow

For mobile apps and desktop applications.

```typescript
const tokens = await oauth.getPasswordCredentials({
  username: "user@example.com",
  password: "password",
  scope: ["openid", "profile"],
});
```

## Configuration

### Initialize Options

```typescript
const oauth = new OAuthClient({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  redirectUrl: "https://yourapp.com/callback",
  authorizationUrl: "https://auth.lanonasis.com/authorize",
  tokenUrl: "https://auth.lanonasis.com/token",
  revokeUrl: "https://auth.lanonasis.com/revoke",
  userInfoUrl: "https://auth.lanonasis.com/userinfo",
  jwksUrl: "https://auth.lanonasis.com/.well-known/jwks.json",

  // Optional
  timeout: 30000,
  pkce: true, // Enable PKCE by default
  includeCredentials: true, // For cross-domain requests
});
```

### Environment Variables

```bash
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_REDIRECT_URL=https://yourapp.com/callback
OAUTH_AUTHORIZATION_URL=https://auth.lanonasis.com/authorize
OAUTH_TOKEN_URL=https://auth.lanonasis.com/token
```

## Methods

### getAuthorizationUrl(options)

Get the URL to redirect users for login.

```typescript
const url = oauth.getAuthorizationUrl({
  scope: ["openid", "profile", "email"],
  state: "random-state-123",
  codeChallenge: "pkce-challenge", // Optional, for PKCE
  responseType: "code", // 'code' for auth code, 'token' for implicit
  prompt: "login", // 'login', 'consent', 'none'
  maxAge: 3600, // Max age in seconds
});
```

### exchangeCode(code, options)

Exchange authorization code for tokens.

```typescript
const tokens = await oauth.exchangeCode("auth-code", {
  codeVerifier: "pkce-verifier", // Required if using PKCE
});

console.log({
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  idToken: tokens.idToken,
  expiresIn: tokens.expiresIn,
});
```

### refreshToken(refreshToken)

Refresh an expired access token.

```typescript
const newTokens = await oauth.refreshToken(refreshToken);

// Update stored tokens
session.accessToken = newTokens.accessToken;
session.refreshToken = newTokens.refreshToken;
```

### getUserInfo(accessToken)

Get authenticated user information.

```typescript
const user = await oauth.getUserInfo(accessToken);

console.log({
  sub: user.sub, // User ID
  email: user.email,
  name: user.name,
  picture: user.picture,
});
```

### revokeToken(token)

Revoke a token (logout).

```typescript
await oauth.revokeToken(accessToken);
// Token is now invalid
```

## Examples

### Express.js Integration

```typescript
import express from "express";
import session from "express-session";
import { OAuthClient } from "@lanonasis/oauth-client";

const app = express();
const oauth = new OAuthClient({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  redirectUrl: "http://localhost:3000/auth/callback",
});

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

// Start login
app.get("/login", (req, res) => {
  const state = require("crypto").randomBytes(16).toString("hex");
  req.session.oauthState = state;

  const authUrl = oauth.getAuthorizationUrl({
    scope: ["openid", "profile", "email"],
    state,
  });

  res.redirect(authUrl);
});

// OAuth callback
app.get("/auth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (state !== req.session.oauthState) {
    return res.status(400).send("Invalid state");
  }

  const tokens = await oauth.exchangeCode(code as string);
  const user = await oauth.getUserInfo(tokens.accessToken);

  req.session.user = user;
  req.session.accessToken = tokens.accessToken;
  req.session.refreshToken = tokens.refreshToken;

  res.redirect("/dashboard");
});

// Protected route
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.send(`Welcome, ${req.session.user.name}`);
});

// Logout
app.get("/logout", async (req, res) => {
  const token = req.session.accessToken;

  if (token) {
    await oauth.revokeToken(token);
  }

  req.session.destroy(() => {
    res.redirect("/");
  });
});
```

### React Integration

```typescript
import { useEffect, useState } from 'react';
import { OAuthClient } from '@lanonasis/oauth-client';

const OAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const oauth = new OAuthClient({
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
    redirectUrl: window.location.origin + '/auth/callback'
  });

  useEffect(() => {
    // Check if returning from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code) {
      handleCallback(code, state);
    } else {
      checkExistingSession();
    }
  }, []);

  const handleCallback = async (code: string, state: string) => {
    try {
      const tokens = await oauth.exchangeCode(code);
      const user = await oauth.getUserInfo(tokens.accessToken);

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      setUser(user);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('OAuth callback failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSession = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const user = await oauth.getUserInfo(token);
        setUser(user);
      } catch (error) {
        localStorage.removeItem('accessToken');
      }
    }
    setLoading(false);
  };

  const login = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauthState', state);

    const authUrl = oauth.getAuthorizationUrl({
      scope: ['openid', 'profile', 'email'],
      state
    });

    window.location.href = authUrl;
  };

  const logout = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      await oauth.revokeToken(token);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <OAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </OAuthContext.Provider>
  );
};

// Usage in components
function Dashboard() {
  const { user, logout } = useOAuth();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### PKCE Implementation

For better security, use PKCE (Proof Key for Code Exchange):

```typescript
import { randomBytes } from "crypto";
import { createHash } from "crypto";

function generatePKCE() {
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  return { codeVerifier, codeChallenge };
}

// During login
const { codeVerifier, codeChallenge } = generatePKCE();
sessionStorage.setItem("pkceVerifier", codeVerifier);

const authUrl = oauth.getAuthorizationUrl({
  scope: ["openid", "profile"],
  codeChallenge,
});

// During callback
const codeVerifier = sessionStorage.getItem("pkceVerifier");
const tokens = await oauth.exchangeCode(code, { codeVerifier });
```

## Token Management

### Automatic Token Refresh

```typescript
const tokens = await oauth.exchangeCode(code);

// Set up auto-refresh before expiration
const refreshInterval = (tokens.expiresIn - 60) * 1000; // Refresh 1 min before expiry

setInterval(async () => {
  const newTokens = await oauth.refreshToken(tokens.refreshToken);
  tokens.accessToken = newTokens.accessToken;
}, refreshInterval);
```

### Token Validation

```typescript
const isValid = oauth.validateToken(token, {
  validateSignature: true,
  checkExpiry: true,
});

if (!isValid) {
  // Token is expired or invalid
  const newTokens = await oauth.refreshToken(refreshToken);
}
```

## Error Handling

```typescript
try {
  const tokens = await oauth.exchangeCode(code);
} catch (error) {
  if (error.code === "INVALID_CODE") {
    console.error("Authorization code is invalid or expired");
  } else if (error.code === "INVALID_CLIENT") {
    console.error("Client authentication failed");
  } else if (error.code === "INVALID_GRANT") {
    console.error("Code cannot be exchanged for token");
  } else if (error.code === "SERVER_ERROR") {
    console.error("Authorization server error");
  }
}
```

## Best Practices

1. **Use PKCE**: Always enable PKCE for public clients
2. **Validate State**: Always verify state parameter matches
3. **Secure Storage**: Store tokens securely (never in localStorage)
4. **HTTPS Only**: Always use HTTPS for OAuth flows
5. **Short-lived Tokens**: Access tokens should expire within 1 hour
6. **Refresh Tokens**: Use refresh tokens to extend sessions
7. **Revoke Tokens**: Always revoke tokens on logout

## Support

For issues and questions:

- GitHub: [lanonasis/oauth-client](https://github.com/lanonasis/oauth-client)
- Discord: [Join our community](https://discord.gg/lanonasis)
- Email: support@lanonasis.com
