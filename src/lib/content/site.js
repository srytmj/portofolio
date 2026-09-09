// Central content model. Edit copy here, not in the components.

export const identity = {
  name: 'Bakti Surya Atmaja',
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
  location: 'Bandung, West Java',
  status: 'Node 01: Staging & Lab Assembly',
  // Portrait: set to '/portrait.jpg' (drop the photo in static/) to render it
  // as a halftone dot field. null = show the auto-playing snake placeholder.
  portrait: null
};

export const availability = {
  status: 'Open for opportunities',
  type: 'Full-time / Contract',
  location: 'Remote / Hybrid (Bandung, West Java)',
  roles: ['Full-stack Developer', 'Backend Engineer', 'Cloud & DevOps']
};

export const stats = [
  { value: '4+', label: 'Years in Code' },
  { value: '15+', label: 'Homelab Services' },
  { value: '12+', label: 'Shipped Systems' },
  { value: '99.9%', label: 'Target Uptime' }
];

export const building = {
  project: 'White Archive v2',
  tagline: 'Self-hosted media asset pipeline with automatic transcode and Zero-Trust auth',
  status: 'In active development',
  stack: ['Laravel', 'PostgreSQL', 'Docker', 'Tailscale']
};

export const engineTrivia = {
  title: 'Engine Architecture & Safety Nets',
  overview:
    'This portfolio runs an adaptive rendering pipeline designed to never freeze or crash on low-power devices.',
  items: [
    {
      label: 'Zero WebGL Waste (Tiering)',
      desc: 'Hardware capability (GPU, CPU cores, RAM, network type, and reduced-motion preference) is evaluated before Three.js is downloaded. Weak hardware drops straight to a CSS-only starfield.'
    },
    {
      label: 'FPS Watchdog (< 30 FPS)',
      desc: 'A rolling 1-second frame timer monitors render times. If frame rates drop under 30 FPS, it first strips particle twinkle and downscales DPR, then falls back to static CSS if needed.'
    },
    {
      label: 'WebGL Context Loss Guard',
      desc: 'Mobile browsers frequently kill WebGL contexts under memory pressure. A webglcontextlost listener catches this instantly and swaps to static rendering without a blank canvas or page reload.'
    }
  ]
};

// Tactical Skills Matrix — Classified by Operational Domain.
// Each technology contains full telemetry metadata for the System Pod Inspector.
export const stack = [
  {
    layer: 'cloud & automation',
    code: '01',
    items: [
      {
        id: 'INF-01',
        name: 'Terraform',
        badge: 'CORE',
        readiness: 95,
        detail: 'Declarative multi-tier provisioning, immutable state management, CI/CD execution.',
        role: 'Infrastructure as Code (IaC) for AWS and self-hosted Proxmox nodes. Zero manual resource drift.',
        deployedAt: 'White Archive infra, Homelab virtualization, Automated VPC topologies',
        command: '$ terraform plan -out=tfplan.binary\n[EXEC] Plan: 6 to add, 0 to change, 0 to destroy. State locked.'
      },
      {
        id: 'CLD-01',
        name: 'AWS EC2 & VPC',
        badge: 'PROD',
        readiness: 92,
        detail: 'Compute instances, custom multi-AZ VPC layout, security group isolation, and ALBs.',
        role: 'Production workloads running behind Application Load Balancers with strict security group peering.',
        deployedAt: 'High-availability web applications, staging environments, distributed API relays',
        command: '$ aws ec2 describe-instances --query "Reservations[*].Instances[*].State.Name"\n[ "running", "running", "running" ]'
      },
      {
        id: 'CLD-02',
        name: 'Amazon S3 & MinIO',
        badge: 'PROD',
        readiness: 94,
        detail: 'Object storage, presigned URLs, S3-compatible self-hosted buckets, and offsite backups.',
        role: 'Blob and media archival with lifecycle policies, bucket versioning, and client-side encryption.',
        deployedAt: 'White Archive media repository, homelab restic backup repositories',
        command: '$ mc admin info myminio\nUptime: 48d | Standard Storage: 1.8 TB | Health: GREEN [100% OK]'
      },
      {
        id: 'CLD-03',
        name: 'Amazon RDS & Aurora',
        badge: 'PROD',
        readiness: 90,
        detail: 'Managed PostgreSQL/MySQL, automated replication snapshots, and multi-AZ failover.',
        role: 'Relational data tier with automated backups, point-in-time recovery, and connection pooling.',
        deployedAt: 'Client production backends, mission-critical relational stores',
        command: '$ aws rds describe-db-instances --db-instance-identifier prod-db\nStatus: available | Engine: postgres-16.4 | Storage: 100GB gp3'
      },
      {
        id: 'INF-02',
        name: 'GitHub Actions',
        badge: 'DAILY',
        readiness: 96,
        detail: 'Automated CI/CD pipelines, container build & multi-arch push, zero-downtime SSH deploy.',
        role: 'Every push triggers static analysis, automated test suites, container builds, and canary deploys.',
        deployedAt: 'All active repositories, homelab GitOps workflows',
        command: '$ gh run watch\n✓ Lint & Unit Tests (22s)\n✓ Build Docker Multi-Arch (41s)\n✓ Deploy Target: Production (12s)'
      }
    ]
  },
  {
    layer: 'systems & virtualization',
    code: '02',
    items: [
      {
        id: 'SYS-01',
        name: 'Proxmox VE',
        badge: 'HOMELAB',
        readiness: 96,
        detail: 'Bare-metal Type-1 hypervisor, LXC unprivileged containers, QEMU KVM VMs, ZFS pool management.',
        role: 'Self-hosted compute cluster running 24/7. Hosts media nodes, staging APIs, and isolated lab networks.',
        deployedAt: 'Primary Homelab Node (16 Cores / 64GB RAM / Dual 2.5GbE NICs)',
        command: '$ pvesh get /cluster/status\nNode: pve-node01 | State: Online | VMs: 8 | LXC: 14 | Memory: 42.1%'
      },
      {
        id: 'SYS-02',
        name: 'Docker & Compose',
        badge: 'CORE',
        readiness: 98,
        detail: 'Multi-stage containerization, service orchestration, internal bridge networks, volume mounts.',
        role: 'Standardized runtime isolation for microservices, background queues, and ephemeral development environments.',
        deployedAt: 'Production VPS, local development, staging servers, edge runners',
        command: '$ docker compose ps\nNAME            IMAGE          STATUS         PORTS\nweb-gateway     nginx:alpine   Up 24 days     0.0.0.0:80->80, 0.0.0.0:443->443\napi-core        app:v2.4.0     Up 24 days     0.0.0.0:8080->8080'
      },
      {
        id: 'SYS-03',
        name: 'Linux (Debian / Alpine)',
        badge: 'DAILY',
        readiness: 95,
        detail: 'Systemd units, ufw / iptables, kernel tuning, logrotate, minimal footprint OCI bases.',
        role: 'Rock-solid OS foundation for all servers, VPS, and containers with automated security patching.',
        deployedAt: 'All bare-metal hosts, virtual machines, and container images',
        command: '$ uname -srm && uptime -p\nLinux 6.8.12-amd64 x86_64\nup 38 weeks, 4 days, 11 hours'
      },
      {
        id: 'SYS-04',
        name: 'Nginx & Reverse Proxy',
        badge: 'PROD',
        readiness: 92,
        detail: 'TLS termination, HTTP/2 & WebSocket proxying, upstream load balancing, security rate limiting.',
        role: 'Unified gateway handling SSL certificates, rate-limiting malicious traffic, and routing to backends.',
        deployedAt: 'Edge ingress for all web applications and homelab services',
        command: '$ nginx -t && systemctl status nginx\nnginx: syntax is ok, test is successful | Active: active (running)'
      }
    ]
  },
  {
    layer: 'networking & routing',
    code: '03',
    items: [
      {
        id: 'NET-01',
        name: 'MikroTik RouterOS',
        badge: 'HOMELAB',
        readiness: 93,
        detail: 'Policy-based routing, firewall filter & NAT mangle, VLAN routing, PCQ bandwidth queues.',
        role: 'Core routing backbone. Segregates internal subnets, manages WAN failover, and enforces ACLs.',
        deployedAt: 'Core Network Gateway (MikroTik RouterBOARD / hEX series)',
        command: '/ip/firewall/filter/print where chain=forward\n0  D ;;; defconf: forward established,related\n1    ;;; drop invalid connections\n2    ;;; allow isolated VLAN10 to internet only'
      },
      {
        id: 'NET-02',
        name: 'WireGuard & Tailscale',
        badge: 'DAILY',
        readiness: 96,
        detail: 'Modern mesh VPN, split tunneling, site-to-site tunnels, zero-trust homelab subnet routing.',
        role: 'Encrypted overlay networking connecting remote dev laptops, mobile devices, and servers securely.',
        deployedAt: 'All personal workstations, mobile endpoints, and homelab gateway nodes',
        command: '$ wg show\ninterface: wg0 [listening port: 51820]\npeer: 9kL7x... [latest handshake: 12 seconds ago] [tx: 14.8 GB, rx: 98.4 GB]'
      },
      {
        id: 'NET-03',
        name: 'Cloudflare & Zero Trust',
        badge: 'PROD',
        readiness: 95,
        detail: 'Cloudflare Tunnels (cloudflared), edge proxy, DNSSEC, geo-routing, WAF security rules.',
        role: 'Zero public port forwarding. Ingress traffic is strictly authenticated via Cloudflare Access.',
        deployedAt: 'Personal domains, homelab management dashboards, public staging',
        command: '$ cloudflared tunnel run homelab-mesh\nConnector ID: a84f901c [Route: tunnel active, 4 connections healthy]'
      },
      {
        id: 'NET-04',
        name: 'VLANs & Subnetting',
        badge: 'CORE',
        readiness: 91,
        detail: '802.1Q tagged/untagged trunking, isolated IoT / Lab / Management subnets, inter-VLAN firewalls.',
        role: 'Network segmentation ensuring compromised devices cannot access the core homelab or data tiers.',
        deployedAt: 'Managed Gigabit Switches & RouterOS Trunk Ports',
        command: '# Subnet Matrix:\nVLAN 10 [TRUSTED_LAN]  : 192.168.10.0/24\nVLAN 20 [HOMELAB_PROD] : 192.168.20.0/24\nVLAN 30 [IOT_ISOLATED] : 192.168.30.0/24 [NO_LAN_ACCESS]'
      }
    ]
  },
  {
    layer: 'application runtime',
    code: '04',
    items: [
      {
        id: 'APP-01',
        name: 'Laravel & PHP',
        badge: 'CORE',
        readiness: 96,
        detail: 'Robust enterprise backends, background queue workers, Eloquent ORM, Sanctum auth.',
        role: 'Primary web application framework. Handles complex relational models, jobs, and secure APIs.',
        deployedAt: 'White Archive backend, client business platforms, custom SaaS portals',
        command: '$ php artisan queue:work redis --tries=3\n[2026-09-09 11:45:01] Processing: App\\Jobs\\ProcessMediaArchive\n[2026-09-09 11:45:03] Processed:  App\\Jobs\\ProcessMediaArchive (2.18s)'
      },
      {
        id: 'APP-02',
        name: 'PostgreSQL',
        badge: 'PROD',
        readiness: 93,
        detail: 'Advanced relational schema design, indexes, CTEs, JSONB storage, WAL replication.',
        role: 'Primary relational database for ACID compliance, heavy queries, and structured data integrity.',
        deployedAt: 'Core database cluster across homelab and cloud instances',
        command: '$ psql -U postgres -d production_db -c "SELECT version();"\nPostgreSQL 16.4 on x86_64-pc-linux-gnu, compiled by gcc'
      },
      {
        id: 'APP-03',
        name: 'SvelteKit & Svelte 5',
        badge: 'DAILY',
        readiness: 95,
        detail: 'Ultra-fast reactive frontends, Runes state primitives, SSR/SSG, zero-bundle overhead.',
        role: 'Modern frontend architecture with compile-time reactivity, GSAP choreography, and fluid UI.',
        deployedAt: 'This portfolio, personal tools, dynamic interactive client dashboards',
        command: '$ npm run build\n✓ built in 14.2s | adapter-auto: output verified, exit code 0'
      },
      {
        id: 'APP-04',
        name: 'Bun & Hono',
        badge: 'DAILY',
        readiness: 91,
        detail: 'Ultra-fast TypeScript runtime, lightweight edge API routes, WebSockets, sub-millisecond cold starts.',
        role: 'High-performance microservices, fast tooling scripts, and realtime event dispatchers.',
        deployedAt: 'Internal telemetry relays, real-time WebSocket backends',
        command: '$ bun run server.ts\n[Ready] Hono API running at http://0.0.0.0:3000 (1.4ms boot time)'
      },
      {
        id: 'APP-05',
        name: 'Redis',
        badge: 'PROD',
        readiness: 90,
        detail: 'In-memory caching, pub/sub event broadcasting, session stores, distributed rate limiting.',
        role: 'Sub-millisecond data retrieval layer and queue broker for background job processing.',
        deployedAt: 'Cache and queue backend for Laravel and microservices',
        command: '$ redis-cli PING && redis-cli INFO stats | grep total_commands\nPONG\ntotal_commands_processed: 1849204'
      }
    ]
  }
];

// Each project opens a detail modal. `images` show as a gallery, so swap the
// placeholder SVGs in static/projects/ for real screenshots (any ratio, they
// get object-fit: cover). `detail` is an array of paragraphs.
export const projects = [
  {
    slug: 'white-archive',
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
    slug: 'homelab',
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
    slug: 'ha-web-server-aws',
    title: 'HA Web Server AWS',
    kind: 'Infrastructure',
    year: '2026',
    summary:
      'High-availability web architecture on AWS Free Tier: multi-AZ EC2, database replication on instance to RDS, S3 storage, and ALB.',
    detail: [
      'Two EC2 web servers distributed across two Availability Zones behind an Application Load Balancer with round-robin traffic routing and automated health checking.',
      'Primary MySQL database hosted on an EC2 instance with real-time binary log replication to Amazon RDS MySQL replica for zero data loss and read fallback.',
      'Stateless media uploads configured to stream directly to an Amazon S3 bucket with least-privilege IAM policies and multi-tier security groups.'
    ],
    stack: ['AWS EC2', 'Amazon RDS', 'Amazon S3', 'ALB', 'PHP', 'MySQL', 'Apache'],
    images: ['/projects/placeholder-1.svg'],
    links: [
      { label: 'Repo', href: 'https://github.com/srytmj/ha-webserver' },
      { label: 'Case Study', href: '/projects/ha-web-server-aws' }
    ]
  },
  {
    slug: 'realtime-group-checklist',
    title: 'Realtime Group Checklist',
    kind: 'Web app',
    year: '2026',
    summary:
      'A collaborative checklist application with realtime WebSocket synchronization, JWT authentication, and Cloudflare Tunnel deployment.',
    detail: [
      'Engineered with Bun runtime and Hono framework for ultra-low latency request handling and WebSocket room coordination.',
      'Lightweight reactive frontend built using Alpine.js without heavy framework overhead, delivering instant client updates.',
      'Deployed on an AWS EC2 instance connected through a secure Cloudflare Tunnel without opening public ingress ports.'
    ],
    stack: ['Bun', 'Hono', 'Alpine.js', 'WebSocket', 'AWS EC2', 'Cloudflare Tunnel'],
    images: ['/projects/placeholder-2.svg'],
    links: [
      { label: 'Case Study', href: '/projects/realtime-group-checklist' },
      { label: 'GitHub', href: 'https://github.com/srytmj' }
    ]
  },
  {
    slug: 'laravel-pos-accounting',
    title: 'Laravel POS Accounting',
    kind: 'Web app',
    year: '2024',
    summary:
      'Point of Sale system integrated with automated double-entry general ledger, journal recording, and financial reporting.',
    detail: [
      'Full point-of-sale workflow handling daily cashier sales, stock monitoring, and customer transaction receipts.',
      'Automated double-entry accounting engine creating general journal entries, ledger accounts, and balance sheet reports on transaction commit.'
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
    images: ['/projects/placeholder-1.svg'],
    links: [{ label: 'Repo', href: 'https://github.com/srytmj/laravel-pos-accounting' }]
  },
  {
    slug: 'atm-cli-banking-system',
    title: 'ATM CLI Banking System',
    kind: 'System',
    year: '2026',
    summary:
      'CLI-based automated banking system in Java demonstrating core OOP design principles and transaction safety.',
    detail: [
      'Built in Java utilizing encapsulation, inheritance, and polymorphism patterns for strict account isolation and transaction handling.',
      'Supports balance inquiry, cash withdrawal, account deposit, and inter-account fund transfers with credential authentication.'
    ],
    stack: ['Java', 'OOP', 'CLI Architecture'],
    images: ['/projects/placeholder-2.svg'],
    links: [{ label: 'Repo', href: 'https://github.com/srytmj/oop-banking-cli' }]
  }
];

export const contact = {
  body: 'Open to full-stack and infrastructure work. Email is the fastest way to reach me.',
  email: 'contact@suryatmaja.dev',
  links: [
    { label: 'Blog', href: '/blog' },
    { label: 'GitHub', href: 'https://github.com/srytmj' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suryatmaja/' },
    { label: 'Instagram', href: 'https://www.instagram.com/symjaaa/' },
    { label: 'Email', href: 'mailto:contact@suryatmaja.dev' }
  ]
};

export const resume = {
  url: '/cv-suryatmaja.pdf',
  title: 'Bakti Surya Atmaja — Curriculum Vitae',
  filename: 'Bakti_Surya_Atmaja_CV.pdf',
  lastUpdated: '2026'
};

