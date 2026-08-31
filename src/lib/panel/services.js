import * as pub from '$env/static/public';

// One env var per service — never hard-code the URL. Values are filled in
// from .env (see .env.example); they are Tailscale subdomains that only
// resolve inside the owner's tailnet.
const svc = (name, envKey) => ({ name, envKey, url: pub[envKey] || null });

export const groups = [
  {
    label: 'Projects',
    items: [
      svc('malas', 'PUBLIC_MALAS_URL'),
      svc('whitearchive', 'PUBLIC_WHITEARCHIVE_URL'),
      svc('sso.whitearchive', 'PUBLIC_SSO_WHITEARCHIVE_URL'),
      svc('blog', 'PUBLIC_BLOG_URL'),
      svc('pore-js', 'PUBLIC_PORE_JS_URL')
    ]
  },
  {
    label: 'Media',
    items: [
      svc('Jellyfin', 'PUBLIC_JELLYFIN_URL'),
      svc('Immich', 'PUBLIC_IMMICH_URL'),
      svc('Nextcloud', 'PUBLIC_NEXTCLOUD_URL'),
      svc('Kavita', 'PUBLIC_KAVITA_URL')
    ]
  },
  {
    label: 'Tools',
    items: [
      svc('n8n', 'PUBLIC_N8N_URL'),
      svc('Alexandrie', 'PUBLIC_ALEXANDRIE_URL'),
      svc('Vaultwarden', 'PUBLIC_VAULTWARDEN_URL'),
      svc('Firefly III', 'PUBLIC_FIREFLY_III_URL'),
      svc('Shiori', 'PUBLIC_SHIORI_URL'),
      svc('YOURLS', 'PUBLIC_YOURLS_URL'),
      svc('Reclip', 'PUBLIC_RECLIP_URL')
    ]
  },
  {
    label: 'Infra / Monitoring',
    items: [
      svc('Uptime Kuma', 'PUBLIC_UPTIME_KUMA_URL'),
      svc('Netdata', 'PUBLIC_NETDATA_URL'),
      svc('Homelable', 'PUBLIC_HOMELABLE_URL'),
      svc('Portainer', 'PUBLIC_PORTAINER_URL')
    ]
  }
];
