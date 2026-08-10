# Render SPA routing

The explorer uses BrowserRouter and therefore requires the static host to serve `index.html` for application paths that do not map to physical files.

The repository Blueprint declares this rewrite:

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

If a Render static site is created manually instead of from the Blueprint, add the same rewrite in the service's Redirects/Rewrites settings before treating direct route refreshes as production-validated.
