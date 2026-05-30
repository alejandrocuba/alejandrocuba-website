# auth.md - Alejandro Cuba Ruiz Website

This website supports AI agent registration via the `auth.md` protocol. Agents can register to obtain scoped, revocable credentials for interacting with the site's APIs and content.

## Discovery

Agents can discover the registration endpoints and metadata by reading the following metadata documents:
- **Protected Resource Metadata (PRM)**: `https://alejandrocuba.com/.well-known/oauth-protected-resource`
- **Authorization Server Metadata**: `https://alejandrocuba.com/.well-known/oauth-authorization-server`

## Agent Audience

All AI agents, crawlers, and automated software.

## Registration and Credentials

The website supports anonymous registration. Agents can register autonomously to obtain scoped credentials.

### Registration Endpoint

- **Register URI**: `https://alejandrocuba.com/agent/register`
- **Identity Types Supported**: `anonymous`
- **Credential Types Supported**: `bearer`

#### Request Format

To register, perform a `POST` request to the registration URI:

```http
POST /agent/register HTTP/1.1
Host: alejandrocuba.com
Content-Type: application/json

{
  "identity_type": "anonymous"
}
```

#### Response Format

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "mock_agent_token_123456",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Claiming Credentials

If needed, the credentials can be associated with a user using the Claim URI:

- **Claim URI**: `https://alejandrocuba.com/agent/claim`

### Revoking Credentials

Credentials can be revoked using the Revocation URI:

- **Revocation URI**: `https://alejandrocuba.com/agent/revoke`

