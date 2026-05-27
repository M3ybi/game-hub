# Game Hub

Separate Render web service that links to the deployed Tower Defense and
Taptiles apps.

## Render Environment

Set these variables on the `game-hub-web` service:

```properties
TOWER_DEFENSE_URL=https://tower-defense-web.onrender.com/
TAPTILES_URL=https://<your-taptiles-render-service>.onrender.com/taptiles
```

`TAPTILES_URL` can stay unset until Taptiles is deployed. The hub will show the
Taptiles button as unavailable until the variable is configured.

## Deploy

Create a new GitHub repo from this folder, then in Render choose **New** ->
**Blueprint** or **Web Service** and connect that repo.

For a manual web service:

- Runtime: Node
- Build command: `npm install --omit=dev`
- Start command: `npm start`
- Health check path: `/health`

## Auth Note

This hub is a launcher. Because Tower Defense and Taptiles will run on separate
Render subdomains, browser cookies are not automatically shared between them.
Shared login across both games requires either a custom parent domain with a
central auth service or per-game JWT verification against the same auth issuer.
