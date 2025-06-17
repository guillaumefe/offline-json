# offline-json

Project: JSONLint Offline PWA

Description:
  Fully offline Progressive Web App (PWA) to validate and format JSON locally.

File Structure:
  - index.html    : user interface and service worker registration
  - manifest.json : PWA metadata for installation
  - sw.js         : service worker for offline caching
  - icon-192.png, icon-512.png : installation icons

README — How to Run:
  1. Place all files in the same folder.
  2. Start a local HTTP server (service workers require an HTTP or HTTPS context, not file://).
     • Using Python (version ≥3.x):
         > cd /path/to/folder
         > python -m http.server 8000
     • Using Node.js (with the "serve" package):
         > npm install -g serve
         > serve --single --listen 8000
     • Otherwise: any static file server serving the folder at http://localhost:8000
  3. Open your browser and navigate to:
         http://localhost:8000/index.html
  4. Install the PWA: click the install icon in the address bar (Chrome/Edge) or via the browser menu.
  5. Test offline mode:
     • Open DevTools (F12) → Network → enable “Offline,” then reload the page.
