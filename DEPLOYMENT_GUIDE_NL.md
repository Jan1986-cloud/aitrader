# Deployment Guide voor Crypto Trader SaaS

Deze gids helpt u bij het deployen van de Crypto Trader SaaS-applicatie naar Cloudflare Pages en Workers.

## Vereisten

Voordat u begint, zorg ervoor dat u de volgende accounts en tools heeft:

1. **Cloudflare Account**: Aanmelden op https://dash.cloudflare.com/sign-up
2. **Google Cloud Platform Account**: Voor OAuth integratie op https://console.cloud.google.com/
3. **Gemini API Toegang**: Voor AI-functionaliteit op https://ai.google.dev/
4. **Node.js en npm**: Geïnstalleerd op uw lokale machine
5. **Git**: Voor versiebeheer (optioneel maar aanbevolen)

## Stap 1: Project Configureren

1. Clone het project naar uw lokale machine:
   ```
   git clone <repository-url>
   cd crypto-trader-saas
   ```

2. Installeer de dependencies:
   ```
   npm install
   ```

3. Configureer uw Cloudflare Wrangler:
   ```
   npx wrangler login
   ```

## Stap 2: Omgevingsvariabelen Instellen

1. Maak een `.dev.vars` bestand aan in de hoofdmap voor lokale ontwikkeling:
   ```
   JWT_SECRET=uw_jwt_geheim_hier
   ENCRYPTION_KEY=uw_32_bytes_encryptie_sleutel_hier
   GEMINI_API_KEY=uw_gemini_api_sleutel_hier
   ```

2. Stel dezelfde variabelen in voor productie:
   ```
   npx wrangler secret put JWT_SECRET
   npx wrangler secret put ENCRYPTION_KEY
   npx wrangler secret put GEMINI_API_KEY
   ```

## Stap 3: Database Instellen

1. Maak een D1 database aan in uw Cloudflare account:
   ```
   npx wrangler d1 create crypto_trader_db
   ```

2. Noteer de database ID en werk het `wrangler.toml` bestand bij met deze ID.

3. Initialiseer de database met het schema:
   ```
   npm run db:init
   ```

## Stap 4: Google OAuth Configureren

1. Ga naar Google Cloud Console en maak een nieuw project.
2. Navigeer naar "APIs & Services" > "Credentials".
3. Maak een "OAuth 2.0 Client ID" aan.
4. Voeg de volgende redirect URIs toe:
   - `http://localhost:3000/api/auth/callback/google` (voor ontwikkeling)
   - `https://uw-project-naam.pages.dev/api/auth/callback/google` (voor productie)
5. Noteer de Client ID en Client Secret.
6. Voeg deze toe aan uw omgevingsvariabelen:
   ```
   GOOGLE_CLIENT_ID=uw_client_id_hier
   GOOGLE_CLIENT_SECRET=uw_client_secret_hier
   ```

## Stap 5: Lokaal Testen

1. Start de ontwikkelingsserver:
   ```
   npm run dev
   ```

2. Test de Worker API lokaal:
   ```
   npx wrangler dev
   ```

3. Controleer of alles correct werkt in uw browser op `http://localhost:3000`.

## Stap 6: Deployen naar Cloudflare

1. Bouw de Next.js applicatie:
   ```
   npm run build
   ```

2. Deploy de frontend naar Cloudflare Pages:
   ```
   npm run deploy
   ```

3. Deploy de Worker API naar Cloudflare Workers:
   ```
   npm run deploy:worker
   ```

4. Configureer de productiedatabase:
   ```
   npx wrangler d1 migrations apply DB --production
   ```

## Stap 7: Domein Configureren (Optioneel)

1. Ga naar uw Cloudflare dashboard.
2. Navigeer naar Pages > uw project.
3. Ga naar "Custom domains" en volg de instructies om uw domein te configureren.

## Stap 8: Monitoring en Onderhoud

1. Controleer de logs en prestaties in uw Cloudflare dashboard.
2. Stel waarschuwingen in voor fouten of ongebruikelijke activiteit.
3. Voer regelmatig updates uit om de beveiliging en functionaliteit te behouden.

## Problemen Oplossen

- **Deployment Fouten**: Controleer de Cloudflare logs voor specifieke foutmeldingen.
- **Database Problemen**: Gebruik `wrangler d1 execute` om queries uit te voeren en de database te inspecteren.
- **API Fouten**: Controleer de Worker logs in het Cloudflare dashboard.

## Volgende Stappen

Na een succesvolle deployment kunt u:

1. Gebruikers uitnodigen om de applicatie te testen.
2. Feedback verzamelen en verbeteringen aanbrengen.
3. Nieuwe functies ontwikkelen en implementeren.
4. Schalen naar meer gebruikers door uw abonnementsmodel te activeren.

Voor vragen of ondersteuning, neem contact op met de ontwikkelaar.
