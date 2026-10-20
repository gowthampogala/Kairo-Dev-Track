import { NetworkLevel, NetworkTopic } from '../types';

export const NETWORK_LEVELS: NetworkLevel[] = [
  {
    id: 'level-1',
    levelNumber: 1,
    title: 'Level 1 — Basics',
    subtitle: 'Core Vocabulary',
    description: 'The vocabulary every developer should know cold.',
    topicIds: [
      'net-t1', 'net-t2', 'net-t3', 'net-t4', 'net-t5',
      'net-t6', 'net-t7', 'net-t8', 'net-t9'
    ]
  },
  {
    id: 'level-2',
    levelNumber: 2,
    title: 'Level 2 — Core Networking',
    subtitle: 'Transport & Infrastructure',
    description: 'How data actually travels between machines.',
    topicIds: [
      'net-t10', 'net-t11', 'net-t12', 'net-t13', 'net-t14',
      'net-t15', 'net-t16', 'net-t17', 'net-t18', 'net-t19',
      'net-t20', 'net-t21', 'net-t22'
    ]
  },
  {
    id: 'level-3',
    levelNumber: 3,
    title: 'Level 3 — Web Networking',
    subtitle: 'Application Protocols',
    description: 'The networking layer that powers web applications.',
    topicIds: [
      'net-t23', 'net-t24', 'net-t25', 'net-t26', 'net-t27',
      'net-t28', 'net-t29', 'net-t30', 'net-t31'
    ]
  },
  {
    id: 'level-4',
    levelNumber: 4,
    title: 'Level 4 — Full-Stack Networking',
    subtitle: 'Frontend–Backend Communication',
    description: 'How frontend applications and backend services communicate.',
    topicIds: [
      'net-t32', 'net-t33', 'net-t34', 'net-t35', 'net-t36',
      'net-t37', 'net-t38', 'net-t39', 'net-t40'
    ]
  },
  {
    id: 'level-5',
    levelNumber: 5,
    title: 'Level 5 — Backend / Production',
    subtitle: 'Production & Architecture',
    description: 'Concepts useful for system design, backend development, and deployment discussions.',
    topicIds: [
      'net-t41', 'net-t42', 'net-t43', 'net-t44', 'net-t45',
      'net-t46', 'net-t47', 'net-t48', 'net-t49', 'net-t50'
    ]
  }
];

export const NETWORK_TOPICS: NetworkTopic[] = [
  // ================= LEVEL 1: BASICS =================
  {
    id: 'net-t1',
    number: 1,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'What is a Network?',
    description: 'Two or more interconnected computing devices exchanging data through physical cables or wireless links using shared communication protocols.',
    priority: 'standard',
    keyPoints: [
      'Nodes (endpoints like servers, laptops, phones) and links (cables, radio waves)',
      'Shared resources, distributed workloads, and client-server interactions'
    ]
  },
  {
    id: 'net-t2',
    number: 2,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'LAN, WAN, Internet, Intranet',
    description: 'Network classifications by geographical scope and access control: Local Area Network, Wide Area Network, global public Internet, and private corporate Intranets.',
    priority: 'standard',
    keyPoints: [
      'LAN: Home or office network with low latency and high bandwidth',
      'WAN: Telecommunication network connecting distant LANs across cities or continents',
      'Internet: The global decentralized network of networks using TCP/IP',
      'Intranet: Private, restricted network accessible only by authorized internal personnel'
    ]
  },
  {
    id: 'net-t3',
    number: 3,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'Client–Server Architecture',
    description: 'Fundamental model of web computing where clients (browsers, mobile apps) request resources and centralized servers process requests and serve responses.',
    priority: 'must-know',
    keyPoints: [
      'Stateless request-response lifecycle',
      'Separation of concerns: UI rendering on client vs business logic and storage on server',
      'Scalability: 1 server serving thousands of concurrent clients'
    ]
  },
  {
    id: 'net-t4',
    number: 4,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'IP Address',
    description: 'Unique numerical label assigned to every device connected to a computer network that uses the Internet Protocol for communication.',
    priority: 'must-know',
    keyPoints: [
      'Acts like a mailing address for routing data packets across the internet',
      'Host identification and network location addressing'
    ]
  },
  {
    id: 'net-t5',
    number: 5,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'IPv4 vs IPv6',
    description: 'Comparing 32-bit dotted-decimal addresses (4.3 billion limit, exhausted) with 128-bit hexadecimal addresses (3.4 × 10^38 addresses with built-in security).',
    priority: 'standard',
    keyPoints: [
      'IPv4: 32 bits, e.g. 192.168.1.1 — requires NAT for address reuse',
      'IPv6: 128 bits, e.g. 2001:0db8:85a3::8a2e:0370:7334 — eliminates need for NAT'
    ]
  },
  {
    id: 'net-t6',
    number: 6,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'Public vs Private IP',
    description: 'Public IPs are globally routable across the public Internet. Private IPs (RFC 1918: 10.x.x.x, 172.16.x.x, 192.168.x.x) are isolated inside local networks.',
    priority: 'standard',
    keyPoints: [
      'Public IP: Assigned by ISP, visible to internet, must be globally unique',
      'Private IP: Assigned by local router DHCP, non-routable on public internet',
      'NAT translates private IPs to public IP when accessing the web'
    ]
  },
  {
    id: 'net-t7',
    number: 7,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'MAC Address',
    description: 'Media Access Control address: 48-bit unique physical hardware identifier permanently burned into the network interface card (NIC) operating at Data Link Layer 2.',
    priority: 'standard',
    keyPoints: [
      'Formatted as six pairs of hexadecimal digits (e.g. 00:1A:2B:3C:4D:5E)',
      'Used for local hop-to-hop frame delivery on the same physical subnet via ARP'
    ]
  },
  {
    id: 'net-t8',
    number: 8,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'Port Numbers',
    description: '16-bit numerical identifiers (0–65535) directing incoming network traffic to the specific software process or service running on the host machine.',
    priority: 'must-know',
    keyPoints: [
      'Well-known ports (0–1023): 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS)',
      'Registered ports (1024–49151): 3000 (React/Node), 8080 (Spring/Tomcat), 5432 (Postgres)',
      'Socket = IP Address + Port Number'
    ]
  },
  {
    id: 'net-t9',
    number: 9,
    levelNumber: 1,
    levelId: 'level-1',
    levelTitle: 'Level 1 — Basics',
    title: 'Protocols',
    description: 'Formal standards and sets of rules defining how data is formatted, transmitted, verified, and received between computing endpoints.',
    priority: 'standard',
    keyPoints: [
      'Syntax (format of data), semantics (meaning of control bits), and timing (speed & sequencing)',
      'Layered stack architecture where higher-level protocols wrap inside lower-level ones'
    ]
  },

  // ================= LEVEL 2: CORE NETWORKING =================
  {
    id: 'net-t10',
    number: 10,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'TCP',
    description: 'Transmission Control Protocol: connection-oriented, reliable transport protocol providing ordered delivery, error checking, flow control, and retransmission.',
    priority: 'must-know',
    keyPoints: [
      'Guaranteed delivery: packets that are dropped are automatically retransmitted',
      'In-order sequence numbers ensure packets are reassembled correctly',
      'Congestion control and flow control protect receiver buffers'
    ]
  },
  {
    id: 'net-t11',
    number: 11,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'UDP',
    description: 'User Datagram Protocol: connectionless, lightweight transport protocol with no handshake, no guarantee of delivery, and minimal overhead for real-time traffic.',
    priority: 'must-know',
    keyPoints: [
      'Low latency: "fire and forget" with no connection establishment delay',
      'Ideal for video streaming, VoIP, multiplayer gaming, and DNS lookups',
      'Basis for modern HTTP/3 and QUIC protocols'
    ]
  },
  {
    id: 'net-t12',
    number: 12,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'TCP 3-Way Handshake',
    description: 'The SYN → SYN-ACK → ACK negotiation process that establishes a reliable bidirectional TCP connection before application data can flow.',
    priority: 'must-know',
    keyPoints: [
      '1. Client sends SYN (Synchronize sequence number)',
      '2. Server responds with SYN-ACK (Synchronize + Acknowledge)',
      '3. Client returns ACK (Acknowledge) and begins transmitting payload'
    ]
  },
  {
    id: 'net-t13',
    number: 13,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'OSI Model',
    description: '7-Layer conceptual architectural model: Physical, Data Link, Network, Transport, Session, Presentation, and Application layers.',
    priority: 'good-to-know',
    keyPoints: [
      'Conceptual reference model for understanding encapsulation and separation of concerns',
      'Layer 3 (Network: IP), Layer 4 (Transport: TCP/UDP), Layer 7 (Application: HTTP)'
    ]
  },
  {
    id: 'net-t14',
    number: 14,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'TCP/IP Model',
    description: 'The pragmatic 4-layer architecture powering the actual Internet: Network Access (Link), Internet (IP), Transport (TCP/UDP), and Application (HTTP/DNS).',
    priority: 'standard',
    keyPoints: [
      'Direct real-world mapping vs the theoretical 7-layer OSI model',
      'Encapsulation: Application payload → Segment (TCP) → Packet (IP) → Frame (Ethernet)'
    ]
  },
  {
    id: 'net-t15',
    number: 15,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'Router',
    description: 'Layer 3 networking device that inspects destination IP addresses and forwards packets between different distinct networks using routing tables.',
    priority: 'good-to-know',
    keyPoints: [
      'Connects your local LAN to the ISP WAN and the broader Internet',
      'Finds optimal paths for packets using dynamic routing protocols (BGP, OSPF)'
    ]
  },
  {
    id: 'net-t16',
    number: 16,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'Switch',
    description: 'Layer 2 networking device that connects devices within the same local network (LAN) and uses MAC addresses to forward frames specifically to the destination port.',
    priority: 'good-to-know',
    keyPoints: [
      'Builds a MAC address table to direct frames only to intended receiver',
      'Eliminates collisions compared to legacy network hubs'
    ]
  },
  {
    id: 'net-t17',
    number: 17,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'Firewall',
    description: 'Security system monitoring and controlling incoming and outgoing network traffic based on predetermined security rules, ports, and state inspection.',
    priority: 'good-to-know',
    keyPoints: [
      'Packet filtering firewalls vs Stateful inspection firewalls',
      'Blocks unauthorized inbound connection attempts while allowing established outbound traffic'
    ]
  },
  {
    id: 'net-t18',
    number: 18,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'NAT',
    description: 'Network Address Translation: allows an entire private local network of hundreds of devices to share a single public IP address when accessing the Internet.',
    priority: 'good-to-know',
    keyPoints: [
      'Conserves public IPv4 address pool exhaustion',
      'Port Address Translation (PAT) maps private IP + port combinations to public ports'
    ]
  },
  {
    id: 'net-t19',
    number: 19,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'DHCP',
    description: 'Dynamic Host Configuration Protocol: automated network management protocol assigning IP addresses, subnet masks, default gateways, and DNS servers to joining devices.',
    priority: 'good-to-know',
    keyPoints: [
      'DORA Process: Discover → Offer → Request → Acknowledge',
      'Eliminates manual static IP configuration on client devices'
    ]
  },
  {
    id: 'net-t20',
    number: 20,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'DNS',
    description: 'Domain Name System: the phonebook of the Internet translating human-readable domain names (e.g. google.com) into machine-routable IP addresses (142.250.190.46).',
    priority: 'must-know',
    keyPoints: [
      'Hierarchical resolution: Root Server → TLD Server (.com) → Authoritative Name Server',
      'Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification)',
      'TTL (Time-To-Live) and recursive resolver caching'
    ]
  },
  {
    id: 'net-t21',
    number: 21,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'Subnet & Subnet Mask',
    description: 'Logical subdivision of an IP network. The subnet mask separates the IP address into the network portion and host portion (e.g. 255.255.255.0 or /24).',
    priority: 'good-to-know',
    keyPoints: [
      'CIDR notation: /24 means first 24 bits define network, leaving 8 bits (254 usable hosts)',
      'Determines whether destination IP is local (direct ARP) or remote (forward to gateway)'
    ]
  },
  {
    id: 'net-t22',
    number: 22,
    levelNumber: 2,
    levelId: 'level-2',
    levelTitle: 'Level 2 — Core Networking',
    title: 'Default Gateway',
    description: 'The router IP address on a local network that acts as the access point or forwarding exit for any traffic destined for IP addresses outside the local subnet.',
    priority: 'standard',
    keyPoints: [
      'Usually assigned as the first or last IP in subnet (e.g. 192.168.1.1)',
      'Local machine sends packets to default gateway MAC address when destination IP is external'
    ]
  },

  // ================= LEVEL 3: WEB NETWORKING =================
  {
    id: 'net-t23',
    number: 23,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'HTTP',
    description: 'Hypertext Transfer Protocol: foundational stateless application-layer protocol for distributed hypermedia systems operating over TCP/IP.',
    priority: 'must-know',
    keyPoints: [
      'Stateless request-response lifecycle',
      'Evolution: HTTP/1.1 (pipelining, keep-alive) → HTTP/2 (multiplexing) → HTTP/3 (QUIC/UDP)'
    ]
  },
  {
    id: 'net-t24',
    number: 24,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'HTTP Request & Response',
    description: 'The structure of web messages: Requests contain Method, Path, Headers, and Body; Responses contain Status Code, Reason, Headers, and Body payload.',
    priority: 'must-know',
    keyPoints: [
      'Request line: GET /api/users HTTP/1.1',
      'Status line: HTTP/1.1 200 OK',
      'Header-body separation via blank CRLF line'
    ]
  },
  {
    id: 'net-t25',
    number: 25,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'HTTP Methods — GET, POST, PUT, PATCH, DELETE',
    description: 'Standard verb operations indicating the desired action to be performed on a target resource with defined semantics regarding idempotence and safety.',
    priority: 'must-know',
    keyPoints: [
      'GET: Safe & idempotent, retrieves data with no side-effects',
      'POST: Non-idempotent, creates a new subordinate resource',
      'PUT: Idempotent full replacement; PATCH: Partial modification; DELETE: Resource removal'
    ]
  },
  {
    id: 'net-t26',
    number: 26,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'HTTP Status Codes',
    description: '3-digit standard status codes categorizing server response results into 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), and 5xx (Server Error).',
    priority: 'must-know',
    keyPoints: [
      '200 OK, 201 Created, 204 No Content',
      '301 Moved Permanently, 304 Not Modified',
      '400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests',
      '500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout'
    ]
  },
  {
    id: 'net-t27',
    number: 27,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'HTTP Headers',
    description: 'Key-value metadata pairs sent with requests and responses controlling caching, authentication, content negotiation, cookies, and security policies.',
    priority: 'standard',
    keyPoints: [
      'Content-Type, Accept, Authorization, Cookie, Set-Cookie',
      'Cache-Control, ETag, User-Agent, Origin, Referer',
      'Security headers: Strict-Transport-Security (HSTS), Content-Security-Policy (CSP)'
    ]
  },
  {
    id: 'net-t28',
    number: 28,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'HTTP vs HTTPS',
    description: 'HTTPS is HTTP wrapped in an encrypted TLS tunnel (over port 443 instead of 80), providing confidentiality, integrity, and server authentication.',
    priority: 'must-know',
    keyPoints: [
      'HTTP transmits plaintext: vulnerable to eavesdropping and man-in-the-middle tampering',
      'HTTPS encrypts all headers, URLs paths, query parameters, and body payloads'
    ]
  },
  {
    id: 'net-t29',
    number: 29,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'TLS/SSL Basics',
    description: 'Transport Layer Security: cryptographic protocol using asymmetric encryption (public/private key) to exchange a shared symmetric session key for fast bulk encryption.',
    priority: 'standard',
    keyPoints: [
      'Certificate Authority (CA) verifies the server identity and issues digital certificates',
      'TLS Handshake: Cipher suite negotiation → Certificate verification → Session key generation'
    ]
  },
  {
    id: 'net-t30',
    number: 30,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'URL Structure',
    description: 'Uniform Resource Locator anatomy: Scheme (https) + Host/Domain (api.example.com) + Port (:443) + Path (/v1/users) + Query String (?page=2) + Fragment (#section).',
    priority: 'standard',
    keyPoints: [
      'Protocol scheme determines transport layer handling',
      'Query parameters pass key-value search or filter criteria',
      'Fragment identifier is evaluated client-side only and never transmitted to server'
    ]
  },
  {
    id: 'net-t31',
    number: 31,
    levelNumber: 3,
    levelId: 'level-3',
    levelTitle: 'Level 3 — Web Networking',
    title: 'What Happens When You Enter a URL?',
    description: 'The end-to-end journey of a web request: DNS lookup → TCP handshake → TLS negotiation → HTTP request sent → Server processes → HTTP response returned → Browser renders DOM.',
    priority: 'must-know',
    keyPoints: [
      '1. Browser checks cache (browser, OS, router, resolver) then performs recursive DNS lookup',
      '2. TCP 3-way handshake established on port 443',
      '3. TLS handshake negotiates encryption keys',
      '4. HTTP GET request dispatched; server processes and streams HTML back',
      '5. Browser parses HTML, fetches subresources (CSS, JS, images), and executes JavaScript'
    ]
  },

  // ================= LEVEL 4: FULL-STACK NETWORKING =================
  {
    id: 'net-t32',
    number: 32,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'REST API',
    description: 'Representational State Transfer: architectural style utilizing standard HTTP methods, stateless communication, and resource-based URI endpoints.',
    priority: 'must-know',
    keyPoints: [
      'Nouns for endpoints (e.g. /api/orders) and HTTP verbs for operations',
      'Statelessness: every request must contain all context needed to execute',
      'Standardized JSON representations and uniform interface constraints'
    ]
  },
  {
    id: 'net-t33',
    number: 33,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'JSON',
    description: 'JavaScript Object Notation: lightweight, human-readable text-based data interchange format universally used for frontend–backend API payloads.',
    priority: 'standard',
    keyPoints: [
      'Data types: strings, numbers, booleans, null, arrays, objects',
      'Content-Type header: application/json; charset=utf-8',
      'Serialization via JSON.stringify() and parsing via JSON.parse()'
    ]
  },
  {
    id: 'net-t34',
    number: 34,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'Same-Origin Policy',
    description: 'Critical browser security mechanism restricting how a document or script loaded from one origin can interact with resources from a different origin.',
    priority: 'must-know',
    keyPoints: [
      'An Origin is defined by three tuples: Protocol (scheme) + Host (domain) + Port',
      'Prevents malicious websites from reading sensitive session data from your bank in another tab'
    ]
  },
  {
    id: 'net-t35',
    number: 35,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'CORS',
    description: 'Cross-Origin Resource Sharing: HTTP-header based protocol allowing a server to explicitly indicate which external origins are permitted to access its resources.',
    priority: 'must-know',
    keyPoints: [
      'Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
      'Preflight request: automatic OPTIONS HTTP request sent by browser for non-simple requests',
      'CORS is strictly a browser-enforced security check, not a server security boundary'
    ]
  },
  {
    id: 'net-t36',
    number: 36,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'Cookies',
    description: 'Small pieces of data sent by a server via Set-Cookie and automatically stored and transmitted by the browser with subsequent requests to the same origin.',
    priority: 'must-know',
    keyPoints: [
      'HttpOnly flag prevents client-side JavaScript access (mitigates XSS token theft)',
      'Secure flag ensures cookies are transmitted only over HTTPS',
      'SameSite flag (Strict, Lax, None) protects against Cross-Site Request Forgery (CSRF)'
    ]
  },
  {
    id: 'net-t37',
    number: 37,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'Sessions',
    description: 'Server-side state storage pattern where user data is kept in server memory or Redis, and only a lightweight opaque session ID is sent to the client as a cookie.',
    priority: 'must-know',
    keyPoints: [
      'Server maintains state table mapping session ID to user profile/permissions',
      'Immediate revocation capability (deleting session record logs out user instantly)',
      'Requires sticky sessions or distributed session store (Redis) across multi-server clusters'
    ]
  },
  {
    id: 'net-t38',
    number: 38,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'JWT',
    description: 'JSON Web Token: compact, URL-safe stateless self-contained token containing cryptographically signed JSON claims (Header.Payload.Signature).',
    priority: 'must-know',
    keyPoints: [
      'Stateless authentication: server verifies cryptographic signature without database lookup',
      'Structure: Base64UrlHeader . Base64UrlPayload . HMACSHA256Signature',
      'Trade-offs: cannot be revoked before expiration without maintaining a blocklist'
    ]
  },
  {
    id: 'net-t39',
    number: 39,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'Authentication vs Authorization',
    description: 'Authentication (AuthN) verifies WHO a user is (e.g. login credentials). Authorization (AuthZ) verifies WHAT permissions that verified user has (e.g. RBAC).',
    priority: 'standard',
    keyPoints: [
      '401 Unauthorized means Unauthenticated (identity missing or invalid)',
      '403 Forbidden means Unauthorized (identity known, but lacks permission for resource)',
      'Role-Based Access Control (RBAC) and claim-based access controls'
    ]
  },
  {
    id: 'net-t40',
    number: 40,
    levelNumber: 4,
    levelId: 'level-4',
    levelTitle: 'Level 4 — Full-Stack Networking',
    title: 'WebSocket',
    description: 'Full-duplex, persistent bidirectional communication protocol operating over a single TCP connection initiated via an HTTP Upgrade handshake.',
    priority: 'must-know',
    keyPoints: [
      'Protocol scheme: ws:// and wss:// (encrypted)',
      'Eliminates HTTP polling overhead for real-time chat, notifications, and live dashboards',
      'Client and server can transmit data frames concurrently at any time'
    ]
  },

  // ================= LEVEL 5: BACKEND / PRODUCTION =================
  {
    id: 'net-t41',
    number: 41,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Proxy',
    description: 'Forward proxy server acting as an intermediary for clients sending requests to external web servers, providing anonymity, caching, or corporate filtering.',
    priority: 'good-to-know',
    keyPoints: [
      'Stands in front of clients: hides client IP addresses from destination servers',
      'Used for enterprise content filtering, egress traffic control, and outbound caching'
    ]
  },
  {
    id: 'net-t42',
    number: 42,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Reverse Proxy',
    description: 'Server (e.g. Nginx, Envoy, Caddy) sitting in front of web applications, intercepting client requests and forwarding them to internal backend services.',
    priority: 'good-to-know',
    keyPoints: [
      'Stands in front of servers: hides backend architecture, IP addresses, and topology',
      'Handles SSL/TLS termination, compression (Gzip/Brotli), caching, and routing'
    ]
  },
  {
    id: 'net-t43',
    number: 43,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Load Balancer',
    description: 'Distributes incoming network traffic across multiple backend servers to maximize throughput, minimize response time, and avoid overloading any single resource.',
    priority: 'good-to-know',
    keyPoints: [
      'Layer 4 (Transport: TCP/UDP port routing) vs Layer 7 (Application: HTTP path/header routing)',
      'Algorithms: Round Robin, Least Connections, IP Hash, Weighted Response Time',
      'Continuous health checks automatically remove failing instances from rotation'
    ]
  },
  {
    id: 'net-t44',
    number: 44,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'CDN',
    description: 'Content Delivery Network: geographically distributed network of proxy edge servers caching static and streaming content close to end users for minimal latency.',
    priority: 'good-to-know',
    keyPoints: [
      'Caches HTML, CSS, JavaScript, images, and videos at Points of Presence (PoPs)',
      'Reduces origin server load and provides DDoS protection (Cloudflare, AWS CloudFront)'
    ]
  },
  {
    id: 'net-t45',
    number: 45,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Caching',
    description: 'Technique of storing copies of data in temporary storage locations (browser cache, CDN edge, reverse proxy, Redis) to speed up future requests.',
    priority: 'standard',
    keyPoints: [
      'HTTP Cache-Control directives: max-age, no-cache, no-store, immutable',
      'Validation headers: ETag and Last-Modified with 304 Not Modified responses',
      'Cache invalidation strategies and stale-while-revalidate patterns'
    ]
  },
  {
    id: 'net-t46',
    number: 46,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'DNS in Production',
    description: 'Managing enterprise domain infrastructure: Anycast routing, GeoDNS for regional traffic routing, weighted records for canary releases, and failover health checks.',
    priority: 'standard',
    keyPoints: [
      'Anycast DNS: multiple global servers advertise the same IP to route users to nearest node',
      'Split-horizon DNS: different IP returned for internal corporate vs external public users',
      'TTL management during scheduled migrations and maintenance'
    ]
  },
  {
    id: 'net-t47',
    number: 47,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'TLS Termination',
    description: 'Decrypting encrypted HTTPS traffic at the reverse proxy or load balancer edge, allowing unencrypted HTTP traffic between internal backend microservices in a secure VPC.',
    priority: 'standard',
    keyPoints: [
      'Offloads expensive cryptographic compute operations from backend app servers',
      'Centralizes SSL certificate management and auto-renewal (Let\'s Encrypt / AWS ACM)'
    ]
  },
  {
    id: 'net-t48',
    number: 48,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Basic Docker Networking',
    description: 'Container network drivers (Bridge, Host, Overlay, None), container port mapping (-p 8080:80), and inter-container communication using internal Docker DNS service discovery.',
    priority: 'standard',
    keyPoints: [
      'Bridge network: default private internal network for containers on single host',
      'Port publishing maps host machine port to isolated container internal port',
      'Docker Compose service names act as automatic DNS hostnames (e.g. http://database:5432)'
    ]
  },
  {
    id: 'net-t49',
    number: 49,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Basic Cloud Networking',
    description: 'Cloud provider networking fundamentals: Virtual Private Clouds (VPCs), public and private subnets, Internet Gateways, NAT Gateways, and Security Groups in AWS/GCP.',
    priority: 'standard',
    keyPoints: [
      'VPC isolates your cloud infrastructure into a private logical virtual network',
      'Public subnets host web tier / load balancers; private subnets isolate backend APIs and databases',
      'Security Groups act as virtual stateful instance firewalls controlling port access'
    ]
  },
  {
    id: 'net-t50',
    number: 50,
    levelNumber: 5,
    levelId: 'level-5',
    levelTitle: 'Level 5 — Backend / Production',
    title: 'Network Troubleshooting Basics',
    description: 'Essential command-line diagnostic tools for debugging web networking issues: ping, traceroute, curl, dig/nslookup, netstat/ss, and browser DevTools Network tab.',
    priority: 'standard',
    keyPoints: [
      'ping (ICMP reachability & latency) and traceroute (hop-by-hop packet path)',
      'curl -v (inspecting raw HTTP headers, TLS handshake details, and status codes)',
      'dig / nslookup (querying DNS records directly to test resolution)',
      'netstat -tuln / ss -tuln (checking which process is listening on which local port)'
    ]
  }
];

export const TOTAL_NETWORK_TOPICS = NETWORK_TOPICS.length; // 50

export interface StudyPriorityGroup {
  category: 'must-know' | 'good-to-know' | 'do-not-go-deep';
  title: string;
  badge: string;
  description: string;
  items: string[];
}

export const NETWORK_STUDY_PRIORITIES: StudyPriorityGroup[] = [
  {
    category: 'must-know',
    title: 'Must Know',
    badge: 'Essential for Interviews & Daily Web Dev',
    description: 'The critical path for understanding web communication, building APIs, and debugging full-stack issues.',
    items: [
      'IP', 'Port', 'DNS', 'TCP/UDP', 'HTTP', 'HTTPS', 'REST', 'Status Codes', 'CORS', 'Cookies/Sessions', 'JWT', 'WebSocket'
    ]
  },
  {
    category: 'good-to-know',
    title: 'Good to Know',
    badge: 'System Design & Infrastructure',
    description: 'Important for architecture discussions, backend deployment, and scaling applications in production.',
    items: [
      'OSI', 'Router', 'Switch', 'NAT', 'DHCP', 'Subnet', 'Firewall', 'Proxy', 'Load Balancer', 'CDN'
    ]
  },
  {
    category: 'do-not-go-deep',
    title: 'Do Not Go Too Deep Initially',
    badge: 'Avoid Rabbit Holes',
    description: 'Specialized network administrator topics that are not required for web developer roles or interview readiness.',
    items: [
      'Advanced subnetting', 'Routing protocols (BGP, OSPF)', 'Packet-level analysis (Wireshark capture dissection)', 'Network hardware administration'
    ]
  }
];
