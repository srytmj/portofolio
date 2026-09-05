// Central content model. Edit copy here, not in the components.

export const identity = {
  name: 'Suryatmaja', // footer, one word
  display: ['Surya', 'Atmaja'], // hero headline — two stacked lines
  // Hero role, under the name. Two lines so it says the whole picture — not
  // just an app dev, but the cloud + self-hosted infra it runs on.
  role: ['Full-stack developer', 'Cloud & homelab infrastructure'],
  // The constellation lines, set small on the right of the hero like a margin
  // note. One entry per line so the wrap is deliberate, not ragged.
  trivia: [
    'Every point of light is nothing on its own.',
    "It's the lines between them that make a shape worth naming."
  ],
  title: 'Surya Atmaja - Full stack Developer', // browser tab
  tagline: 'Full-stack developer. I build web apps and run the infrastructure they scale on.'
};

// Section headings. The nav labels stay literal (About / Skills / Portfolio /
// Contact); these first-person lines are what shows at the top of each section.
export const headings = {
  about: 'Get to know me',
  skills: 'Tech stack',
  portfolio: 'Things I have built',
  contact: "Let's talk"
};

export const about = {
  intro:
    "Greetings, I'm Maja — a full-stack developer who also runs the infrastructure the apps sit on.",
  body: [
    'Most of what I build runs on my own homelab. I reach for AWS when a project needs it (managed databases, email, object storage at scale), not by default.',
    'I like systems that stay small and boring to run, and automating anything that would otherwise be done by hand.'
  ],
  working: [
    "If it's manual twice, it gets scripted.",
    'Small PRs, boring deploys.',
    'Fewer moving parts beats clever.'
  ],
  now: 'Tinkering with the homelab and reading about distributed systems.',
  location: 'WIB · UTC+7',
  status: 'Node 01: Staging & Lab Assembly',
  // Portrait: set to '/portrait.jpg' (drop the photo in static/) to render it
  // as a halftone dot field. null = show the auto-playing snake placeholder.
  portrait: null
};

// Skills as a vertical stack — interface at the top, infrastructure at the
// bottom. Hover a tool to see what it's actually for. `detail` = one plain line.
export const stack = [
  {
    layer: 'interface',
    items: [
      { name: 'React', detail: 'component UIs where the interaction is the hard part' },
      { name: 'Alpine.js', detail: 'small bits of interactivity without shipping a framework' }
    ]
  },
  {
    layer: 'application',
    items: [
      { name: 'Laravel', detail: 'most backends start here: auth, queues, the boring 80%' },
      { name: 'Bun', detail: 'fast runtime for services and one-off scripts' },
      { name: 'Hono', detail: 'a thin API layer when a full framework is too much' }
    ]
  },
  {
    layer: 'cloud',
    items: [
      { name: 'EC2', detail: 'the instances things run on' },
      { name: 'RDS', detail: 'managed Postgres, backups and failover handled' },
      { name: 'S3', detail: 'object storage, and static hosting' },
      { name: 'SES', detail: 'transactional email that actually lands' },
      { name: 'CloudWatch', detail: 'dashboards and alarms for latency and errors' },
      { name: 'IAM', detail: 'least-privilege access, scoped per service' }
    ]
  },
  {
    layer: 'infrastructure',
    items: [
      { name: 'Terraform', detail: 'every environment defined in code, applied from CI' },
      { name: 'GitHub Actions', detail: 'tests, build and deploy run on merge' }
    ]
  }
];

// Each project opens a detail modal. `images` show as a gallery, so swap the
// placeholder SVGs in static/projects/ for real screenshots (any ratio, they
// get object-fit: cover). `detail` is an array of paragraphs.
export const projects = [
  {
    title: 'White Archive',
    kind: 'Platform',
    year: '2025',
    summary:
      'A media archive platform: upload, transcode, catalogue, and control who can access each file.',
    detail: [
      'Creators upload large media files. The system transcodes them in the background, catalogues them, and applies per-file access rules.',
      'Backend is Laravel with PostgreSQL. It runs on my homelab behind a reverse proxy, with S3-compatible object storage and off-site encrypted backups. Deploys run from GitHub Actions.',
      'The parts I spent the most time on: resumable uploads, and keeping the transcode queue from falling behind.'
    ],
    stack: ['Laravel', 'PostgreSQL', 'Docker', 'MinIO', 'Terraform', 'GitHub Actions'],
    images: ['/projects/white-archive-1.svg', '/projects/white-archive-2.svg'],
    links: [
      { label: 'Live', href: '#' },
      { label: 'Case study', href: '#' }
    ]
  },
  {
    title: 'Homelab',
    kind: 'Infrastructure',
    year: 'Since 2024',
    summary:
      'A mini-PC cluster node running containerised services behind a Zero-Trust Tailscale mesh, with automatic TLS, monitoring, and off-site encrypted backups.',
    detail: [
      'Physical Node: Intel 4-Core mini-PC with 16GB RAM running Debian Linux and Proxmox hypervisor. Network connectivity via 2.5 GbE LAN and a Tailscale Zero Trust mesh network (*.ts.net) with MagicDNS.',
      'Workloads: Over 15 containerised services managed via Docker Compose and GitOps. Ingress is routed through a reverse proxy with automated Let’s Encrypt TLS certificates.',
      'Storage & Backups: System on NVMe with automated nightly encrypted snapshots pushed to an offsite S3-compatible vault via restic.',
      'Telemetry & Observability: Prometheus and Netdata scrape node metrics; Grafana renders cluster health boards with Uptime Kuma monitoring service endpoints.'
    ],
    stack: ['Proxmox VE', 'Tailscale ZTNA', 'Docker', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana'],
    images: ['/projects/homelab-1.svg', '/projects/homelab-2.svg'],
    links: [{ label: 'Notes', href: 'https://blog.suryatmaja.dev' }]
  },
  {
    title: 'Placeholder Project',
    kind: 'Web app',
    year: '2024',
    summary:
      'Short description of another project. Replace this with a real write-up: the problem, what you built, how it turned out.',
    detail: [
      'Longer notes go here. Two or three short paragraphs is enough: what the problem was, what you built, and the result.',
      'Add screenshots to static/projects/ and list them in the `images` array for this entry.'
    ],
    stack: ['Hono', 'Bun', 'React'],
    images: ['/projects/placeholder-1.svg'],
    links: [{ label: 'Repo', href: '#' }]
  },
  {
    title: 'Placeholder Project',
    kind: 'Tooling',
    year: '2023',
    summary:
      'Another placeholder. Keep entries in src/lib/content/site.js so the grid and modals stay data-driven.',
    detail: [
      'Placeholder text. Every field (detail, images, links, stack) is optional. The modal adapts to what you give it.'
    ],
    stack: ['Alpine.js', 'Laravel'],
    images: ['/projects/placeholder-2.svg'],
    links: []
  }
];

export const contact = {
  body: 'Open to full-stack and infrastructure work. Email is the fastest way to reach me.',
  email: 'contact@suryatmaja.dev',
  links: [
    { label: 'Blog', href: 'https://blog.suryatmaja.dev' },
    { label: 'GitHub', href: 'https://github.com/srytmj' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suryatmaja/' },
    { label: 'Email', href: 'mailto:contact@suryatmaja.dev' }
  ]
};
