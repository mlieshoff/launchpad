# Launchpad

A small JSON-configured landing page with news, searchable link tiles, local SVG icons, compiled Tailwind CSS, and a dependency-free Node HTTP server. It follows the operating system’s light/dark preference and supports keyboard navigation and reduced motion. Links open in new tabs.

## Run locally

Requires Node 22+ and npm. Node 24 is used in Docker.

```sh
npm ci
npm run build
npm test
npm start
```

Open http://localhost:3000. Rebuild CSS after changing HTML, JavaScript classes, or `src/styles.css`. No CDN or external fonts are needed.

## Docker with local TLS 1.3

Requires Docker Compose and OpenSSL. Generate a self-signed certificate, then start the stack yourself:

```sh
sh scripts/certificate.sh
docker compose up --build -d
```

Open **https://localhost:8443**. HTTP at http://localhost:8080 redirects to HTTPS. Chrome and Firefox show a warning because the certificate is self-signed; accept it for this local prototype or trust `certs/localhost.crt` in your local browser/OS certificate store. Never distribute or commit `certs/localhost.key`. Existing certificates are not overwritten. Certificates expire after 365 days.

Traefik only accepts TLS 1.3. The Node port is internal to Docker, and host ports bind to loopback for local use. No Docker socket, dashboard, ACME account, or public DNS is required. To expose the prototype elsewhere, explicitly change the port bindings, router hostnames, and certificate SANs to match the intended hostname; the supplied certificate covers only localhost and 127.0.0.1.

```sh
docker compose config --quiet
curl --cacert certs/localhost.crt https://localhost:8443/healthz
openssl s_client -connect localhost:8443 -servername localhost -tls1_3
# Must fail: older TLS is intentionally refused.
openssl s_client -connect localhost:8443 -servername localhost -tls1_2
docker compose down
```

## Configure content

Edit `public/config.json`. `news` and `tiles` are arrays, including empty arrays. Add or remove entries freely. Every entry needs `title` and an absolute HTTP(S) `url`; `text` is optional. News also supports `label` and `date` (display text). Tiles optionally use `image`, a local path such as `/images/my-icon.svg`; place the image in `public/images/`. A tile without an image displays its title’s first character.

The top-level `brand`, `eyebrow`, `heading`, `intro`, and `footer` strings customize the page copy. Content is rendered as plain text, never HTML. Invalid configuration produces a visible error instead of unsafe or partially rendered links. The bundled icons are simple local prototype illustrations.

Refresh after editing content. Docker mounts JSON and images read-only, so no image rebuild is needed for content changes. If an editor replaces the JSON file atomically and changes do not appear in Docker, run `docker compose up -d --force-recreate landing` to refresh the file mount. Application/style changes need `docker compose up --build -d`.

## Verification and workflow

`npm test` covers configuration contracts and actual HTTP responses, including unsafe links, traversal, missing files, methods, and security headers. There is no Java code or Maven project: Node/Tailwind was explicitly requested. Browser and container verification results are reported at handover; this README does not imply they passed.

Work is on a local feature branch under the approved exception to the GitHub lifecycle. GitHub story/task issues and PR remain deferred; no release or deployment is performed by the agent.
