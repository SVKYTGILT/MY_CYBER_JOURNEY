// ============================================================
// TEST DATA — Phase-Level Exams (Test Examiner)
// Each roadmap phase has a 10-question exam that spans ALL of
// its milestones. A phase exam unlocks once every milestone in
// the phase is marked complete.
// ============================================================

const PASS_THRESHOLD = 60; // percent needed to pass an exam

export const testData = [
  {
    phaseId: 1,
    title: 'Phase 1: Foundations & Networking',
    shortName: 'Foundations & Networking',
    description:
      'TCP/IP, DNS, DHCP, subnetting, Linux, Windows/Active Directory and the CIA Triad.',
    duration: '~10 min',
    questions: [
      {
        question: 'How many layers does the TCP/IP model have?',
        options: ['7', '4', '5', '3'],
        answer: 1,
        explanation:
          'The TCP/IP model has 4 layers: Network Access, Internet, Transport, and Application.'
      },
      {
        question:
          'A website loads, but you realize the browser first had to convert "example.com" into an IP address. Which protocol made this possible?',
        options: ['DHCP', 'FTP', 'DNS', 'SNMP'],
        answer: 2,
        explanation:
          'DNS (Domain Name System) resolves human-friendly domain names into machine-readable IP addresses.'
      },
      {
        question:
          'A new laptop joins the office Wi-Fi and automatically receives an IP address without any manual configuration. Which protocol assigned it?',
        options: ['DNS', 'DHCP', 'ARP', 'ICMP'],
        answer: 1,
        explanation:
          'DHCP (Dynamic Host Configuration Protocol) automatically hands out IP addresses, subnet masks, and gateways to clients.'
      },
      {
        question:
          'How many usable host addresses does a /24 subnet (255.255.255.0) provide?',
        options: ['256', '255', '254', '128'],
        answer: 2,
        explanation:
          'A /24 has 256 total addresses minus network and broadcast addresses = 254 usable hosts.'
      },
      {
        question:
          'On a Linux system, the permission string rwxr-x--- appears on a sensitive file. Which group of users can read and execute it?',
        options: ['Everyone', 'Only the owner', 'The owner and group members', 'Only root'],
        answer: 2,
        explanation:
          'Permissions are split owner|group|others: rwx (owner), r-x (group), --- (others). So owner and group can read/execute, others get nothing.'
      },
      {
        question:
          'Which Linux command lets an authorized user run commands with root (superuser) privileges?',
        options: ['su root only', 'sudo', 'chmod 777', 'whoami'],
        answer: 1,
        explanation:
          'sudo (superuser do) runs a single command with elevated privileges based on the rules in /etc/sudoers.'
      },
      {
        question:
          'What is the primary purpose of Microsoft Active Directory (AD)?',
        options: [
          'Hosting web applications',
          'Centralized identity, authentication, and access management',
          'Encrypting hard drives',
          'Managing network firewalls'
        ],
        answer: 1,
        explanation:
          'AD is the directory service that manages users, computers, groups, and policies across a Windows domain.'
      },
      {
        question:
          'Which two protocols does Active Directory rely on for authentication?',
        options: ['RADIUS and TACACS+', 'SSH and SSL', 'LDAP and Kerberos', 'SMTP and POP3'],
        answer: 2,
        explanation:
          'AD uses LDAP to query directory objects and Kerberos for ticket-based authentication within the domain.'
      },
      {
        question:
          'A ransomware attacker modifies patient records so the data is no longer accurate or trustworthy. Which CIA Triad pillar was violated?',
        options: ['Confidentiality', 'Integrity', 'Availability', 'Authenticity'],
        answer: 1,
        explanation:
          'Integrity ensures data is accurate and unaltered — unauthorized modification is a direct integrity breach.'
      },
      {
        question:
          'A massive DDoS flood takes an online banking portal offline for hours. Which CIA Triad pillar is under attack?',
        options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
        answer: 2,
        explanation:
          'DDoS attacks overwhelm services with traffic, denying legitimate users access — an attack on Availability.'
      }
    ]
  },

  {
    phaseId: 2,
    title: 'Phase 2: Core Security & Defensive Tools',
    shortName: 'Core Security & Defensive Tools',
    description:
      'Firewalls, IDS/IPS, VPNs, network monitoring, SIEM, endpoint security/EDR and cryptography.',
    duration: '~10 min',
    questions: [
      {
        question:
          'What is the core job of a network firewall?',
        options: [
          'Encrypting all outbound traffic',
          'Filtering traffic based on predefined security rules',
          'Detecting malware on endpoints',
          'Backing up network configs'
        ],
        answer: 1,
        explanation:
          'Firewalls inspect packets and allow/block them according to configured rules (ACLs, policies).'
      },
      {
        question:
          'A security tool detects a suspicious pattern and sends an alert, but does NOT block the traffic. Which type of tool is this?',
        options: ['IDS (Intrusion Detection System)', 'IPS (Intrusion Prevention System)', 'WAF', 'Proxy'],
        answer: 0,
        explanation:
          'An IDS passively monitors and alerts. An IPS sits inline and actively blocks malicious traffic.'
      },
      {
        question:
          'An employee connects to the company network from a café using an encrypted tunnel. What technology are they using?',
        options: ['VPN', 'DMZ', 'VLAN', 'SIEM'],
        answer: 0,
        explanation:
          'A VPN creates a secure, encrypted tunnel over a public network for safe remote access.'
      },
      {
        question:
          'Where would you typically place a public web server so it is reachable from the internet but isolated from the internal LAN?',
        options: ['Inside the internal LAN', 'In the DMZ', 'Behind a proxy only', 'On the domain controller'],
        answer: 1,
        explanation:
          'The DMZ (demilitarized zone) hosts public-facing services and limits blast radius if compromised.'
      },
      {
        question:
          'Your SOC needs one platform that aggregates logs from firewalls, servers, and endpoints and correlates them to detect attacks. What do you need?',
        options: ['A VPN concentrator', 'A SIEM', 'An EDR agent', 'A load balancer'],
        answer: 1,
        explanation:
          'SIEM (Security Information and Event Management) centralizes logs and correlates events for detection and compliance.'
      },
      {
        question:
          'Which components make up the ELK stack?',
        options: [
          'Elasticsearch, Logstash, Kibana',
          'Endpoint, Linux, Kubernetes',
          'Encryption, Logging, Key-mgmt',
          'Event, Log, KPI'
        ],
        answer: 0,
        explanation:
          'ELK = Elasticsearch (storage/search), Logstash (ingestion/parsing), Kibana (visualization).'
      },
      {
        question:
          'How does an EDR solution differ from traditional antivirus?',
        options: [
          'EDR only matches virus signatures',
          'EDR adds continuous behavioral monitoring, threat hunting, and response',
          'Traditional AV is more advanced',
          'EDR replaces the firewall'
        ],
        answer: 1,
        explanation:
          'EDR continuously records endpoint behavior, detects unknown/fileless threats, and supports rapid response.'
      },
      {
        question:
          'A legitimate tax software gets flagged as malware by your security tool. What is this called?',
        options: ['A false negative', 'A false positive', 'A true positive', 'A heuristic miss'],
        answer: 1,
        explanation:
          'A false positive is benign activity incorrectly flagged as malicious — it causes alert fatigue.'
      },
      {
        question:
          'You need to verify that a downloaded file was not tampered with in transit. Which cryptographic primitive helps you do this?',
        options: ['A hash function', 'A symmetric cipher', 'A VPN tunnel', 'A digital certificate only'],
        answer: 0,
        explanation:
          'Hashing produces a fixed fingerprint of the data; if the file changes, the hash changes — verifying integrity.'
      },
      {
        question:
          'In asymmetric (public-key) cryptography, what is the PUBLIC key used for?',
        options: [
          'Decrypting messages sent by the owner',
          'Encrypting messages being sent TO the owner',
          'Generating password hashes',
          'Signing all certificates automatically'
        ],
        answer: 1,
        explanation:
          'Anyone can encrypt a message with the recipient public key; only the matching private key can decrypt it.'
      }
    ]
  },

  {
    phaseId: 3,
    title: 'Phase 3: Offensive Security & Penetration Testing',
    shortName: 'Offensive Security & Pentesting',
    description:
      'Recon/OSINT, Nmap, Shodan, web app attacks (OWASP), Burp Suite, Metasploit and privilege escalation.',
    duration: '~10 min',
    questions: [
      {
        question:
          'A penetration tester gathers information about a target using only public sources — no direct interaction with the target systems. What is this called?',
        options: ['Active scanning', 'OSINT / passive reconnaissance', 'Exploitation', 'Social engineering'],
        answer: 1,
        explanation:
          'OSINT collects intelligence from public sources (WHOIS, DNS, social media) without touching the target — leaving no trace.'
      },
      {
        question:
          'Which Nmap flag performs a stealthy half-open TCP SYN scan?',
        options: ['-sT', '-sS', '-O', '-sV'],
        answer: 1,
        explanation:
          '-sS sends SYN packets without completing the TCP handshake, making it stealthier than a full connect scan.'
      },
      {
        question:
          'You want to find internet-connected devices such as exposed cameras, routers, and databases belonging to your target. Which service is best for this?',
        options: ['Maltego', 'Shodan', 'Wireshark', 'Metasploit'],
        answer: 1,
        explanation:
          'Shodan is a search engine for internet-facing devices and services — perfect for external recon.'
      },
      {
        question:
          'An attacker enters an SQL fragment like OR 1=1 into a login field and gains access to all records. Which vulnerability is being exploited?',
        options: ['XSS', 'SQL Injection', 'CSRF', 'Buffer overflow'],
        answer: 1,
        explanation:
          'SQL Injection manipulates backend database queries through unvalidated input.'
      },
      {
        question:
          'A malicious script embedded in a comment section executes in every visitor browser. Which attack is this?',
        options: ['SQLi', 'Stored XSS', 'CSRF', 'DNS poisoning'],
        answer: 1,
        explanation:
          'Stored (persistent) XSS saves malicious scripts on the server; they run in other users browsers when the page loads.'
      },
      {
        question:
          'A user with a viewer role can directly change a URL like /invoice/5 to /invoice/1 and view someone else invoice. Which OWASP category does this fall under?',
        options: [
          'Broken Access Control',
          'SQL Injection',
          'Security Misconfiguration',
          'XSS'
        ],
        answer: 0,
        explanation:
          'Accessing resources beyond your permissions (e.g., IDOR via object IDs) is Broken Access Control — number one on the OWASP Top 10.'
      },
      {
        question:
          'Which tool lets you intercept and modify HTTP/S requests between your browser and a web app during a pentest?',
        options: ['Nmap', 'Burp Suite', 'Splunk', 'WinPEAS'],
        answer: 1,
        explanation:
          'Burp Suite proxy intercepts traffic and its scanner automates detection of SQLi, XSS, CSRF, and more.'
      },
      {
        question:
          'In Metasploit, what is the term for the code that runs on the target AFTER an exploit succeeds?',
        options: ['Auxiliary module', 'Payload', 'Encoder', 'Listener'],
        answer: 1,
        explanation:
          'The payload defines post-exploitation behavior — e.g., a reverse shell or Meterpreter session.'
      },
      {
        question:
          'Your target is behind a firewall that blocks inbound connections. Which shell technique lets the target phone home to you instead?',
        options: ['Bind shell', 'Reverse shell', 'Local shell', 'Jump shell'],
        answer: 1,
        explanation:
          'A reverse shell makes the compromised machine connect OUT to the attacker listener, bypassing inbound firewall rules.'
      },
      {
        question:
          'On a Linux box you find a SUID binary owned by root that you can abuse to run commands as root. What is this attack called?',
        options: ['Privilege escalation', 'Pivoting', 'Lateral movement', 'Persistence'],
        answer: 0,
        explanation:
          'Exploiting SUID binaries (or misconfigs) to gain elevated privileges is classic Linux privilege escalation.'
      }
    ]
  },

  {
    phaseId: 4,
    title: 'Phase 4: Certifications & Specializations',
    shortName: 'Certifications & Specializations',
    description:
      'CompTIA Security+, CEH, OSCP, cloud security (AWS/Azure) and Incident Response & Digital Forensics.',
    duration: '~10 min',
    questions: [
      {
        question:
          'You are early in your career and want a vendor-neutral certification that proves baseline security knowledge. Which one is the best fit?',
        options: ['OSCP', 'CompTIA Security+', 'CISSP', 'AWS Solutions Architect'],
        answer: 1,
        explanation:
          'Security+ validates foundational, vendor-neutral security skills — the classic entry certification.'
      },
      {
        question:
          'Which certification is known as an entry-level ethical hacking credential covering tools and attack methodologies?',
        options: ['CEH (Certified Ethical Hacker)', 'OSCP', 'SANS GCFA', 'CompTIA A+'],
        answer: 0,
        explanation:
          'CEH covers hacking tools and techniques from a defensive/hands-on perspective — a stepping stone to offensive roles.'
      },
      {
        question:
          'A hiring manager for a penetration testing role wants proof you can actually exploit systems hands-on in an exam lab. Which certification proves this best?',
        options: ['Security+', 'CEH', 'OSCP', 'CISM'],
        answer: 2,
        explanation:
          'OSCP is a grueling hands-on exam: you must compromise real machines in a 24-hour lab environment.'
      },
      {
        question:
          'Under the AWS shared responsibility model, who is responsible for patching the guest operating system of an EC2 instance?',
        options: [
          'AWS always',
          'The customer',
          'The third-party auditor',
          'No one'
        ],
        answer: 1,
        explanation:
          'AWS secures the cloud (hardware, hypervisor); the customer secures what is IN the cloud — OS, apps, data, IAM.'
      },
      {
        question:
          'Which cloud security control lets you define exactly who can access which AWS/Azure resources and with what permissions?',
        options: ['Security groups', 'IAM (Identity and Access Management)', 'CloudTrail', 'Load balancers'],
        answer: 1,
        explanation:
          'IAM manages users, roles, and policies — the foundation of cloud access control and least privilege.'
      },
      {
        question:
          'A company server was breached. The team must preserve evidence, analyze how the attacker got in, and contain the incident. What is this discipline called?',
        options: ['Threat modeling', 'Incident Response & Digital Forensics (DFIR)', 'Vulnerability management', 'Red teaming'],
        answer: 1,
        explanation:
          'DFIR combines forensic evidence collection with structured incident response to investigate and recover from breaches.'
      },
      {
        question:
          'During an investigation, which memory should you capture FIRST because it disappears when power is lost?',
        options: ['Hard drive image', 'RAM / volatile memory', 'Backup tapes', 'Cloud snapshots'],
        answer: 1,
        explanation:
          'Volatile data (RAM, running processes, network connections) vanishes on shutdown — capture it before disk images.'
      },
      {
        question:
          'What is the principle that governs how quickly digital evidence degrades and therefore the order in which it must be collected?',
        options: ['Chain of custody', 'Order of volatility', 'Locard exchange', 'Locard principle'],
        answer: 1,
        explanation:
          'Order of volatility: collect the most volatile evidence (registers, RAM, cache) first, then less volatile data (disks, tapes).'
      },
      {
        question:
          'You take a forensic image of a drive. Why do you compute a SHA-256 hash of the image?',
        options: [
          'To compress the image',
          'To prove the image is an exact, unmodified copy (integrity)',
          'To decrypt the drive',
          'To speed up analysis'
        ],
        answer: 1,
        explanation:
          'Hashing verifies the forensic image is identical to the original — critical for evidence integrity and court admissibility.'
      },
      {
        question:
          'After earning Security+, which career move best aligns with a specialization in offensive security?',
        options: [
          'Taking OSCP and building hands-on lab skills',
          'Switching to graphic design',
          'Only doing multiple-choice certifications',
          'Deleting your lab environment'
        ],
        answer: 0,
        explanation:
          'Specializing offensively means hands-on practice (OSCP, HTB, TryHackMe) layered on the fundamentals.'
      }
    ]
  },

  {
    phaseId: 5,
    title: 'Phase 5: Career Launch & Top Product Companies',
    shortName: 'Career Launch & Top Companies',
    description:
      'Portfolio & writeups, CTF competitions, mock interviews, resume optimization and landing a 12+ LPA role.',
    duration: '~10 min',
    questions: [
      {
        question:
          'Why are technical writeups a powerful portfolio asset for a cybersecurity candidate?',
        options: [
          'They show how you think, investigate, and explain vulnerabilities',
          'They replace the need for any certifications',
          'They are required by HR',
          'They only list tools you installed'
        ],
        answer: 0,
        explanation:
          'Writeups demonstrate methodology, communication, and hands-on ability — exactly what hiring managers look for.'
      },
      {
        question:
          'A CTF where teams solve puzzles for points, with the highest score winning, is called a...',
        options: ['Attack-Defense CTF', 'Jeopardy-style CTF', 'King-of-the-Hill', 'Boot2Root'],
        answer: 1,
        explanation:
          'Jeopardy-style CTFs give a board of challenges (web, pwn, crypto, forensics) worth points — the most common format.'
      },
      {
        question:
          'Which platform is best for a beginner who wants guided, structured hacking labs?',
        options: ['TryHackMe', 'A bare production server', 'LinkedIn', 'Stack Overflow'],
        answer: 0,
        explanation:
          'TryHackMe offers guided beginner rooms; HackTheBox is more challenging for intermediate/advanced learners.'
      },
      {
        question:
          'In an interview you are asked to describe a past project using Situation, Task, Action, Result. Which method are you using?',
        options: ['The STAR method', 'Ping-pong method', 'The OODA loop', 'Agile standup'],
        answer: 0,
        explanation:
          'STAR (Situation, Task, Action, Result) structures behavioral answers clearly and convincingly.'
      },
      {
        question:
          'What is the best way to tailor your resume for a cybersecurity job application?',
        options: [
          'Match keywords and requirements from the specific job description',
          'Use the same generic resume for every role',
          'List every technology you have ever heard of',
          'Keep it to one page regardless of relevance'
        ],
        answer: 0,
        explanation:
          'Customizing each resume to the job description dramatically improves screening and ATS matching.'
      },
      {
        question:
          'A top product company technical round for security includes a whiteboard task to design a secure authentication flow. What mindset should you show?',
        options: [
          'Think through threats, controls, and trade-offs out loud',
          'Write code silently and hope it is right',
          'Skip to naming tools without reasoning',
          'Refuse because it is not a real environment'
        ],
        answer: 0,
        explanation:
          'Interviewers evaluate your security reasoning, not just the final diagram — verbalize the threat model.'
      },
      {
        question:
          'Which of these best demonstrates initiative and passion to a hiring manager early in your career?',
        options: [
          'A portfolio with labs, writeups, and CTF participation',
          'A list of certifications you plan to take someday',
          'A screenshot of a rented cloud VM',
          'A social media bio saying hacker'
        ],
        answer: 0,
        explanation:
          'Tangible artifacts (labs, writeups, CTFs, open-source contributions) prove skill far better than claims.'
      },
      {
        question:
          'What does 12+ LPA refer to in the Indian job market?',
        options: [
          '12+ lakh rupees per annum salary',
          '12+ years of professional experience',
          '12+ leaves per annum',
          '12+ projects completed'
        ],
        answer: 0,
        explanation:
          'LPA = Lakhs Per Annum — an annual salary of 12+ lakh rupees, the target for top product company roles.'
      },
      {
        question:
          'You have been applying but getting no callbacks. What is the most effective immediate fix?',
        options: [
          'Get referrals and tailor your resume per role',
          'Send the same application to 500 companies',
          'Stop applying and wait',
          'Lower all expectations silently'
        ],
        answer: 0,
        explanation:
          'Referrals plus tailored resumes drastically improve response rates compared to cold, generic applications.'
      },
      {
        question:
          'After landing your first security role at a product company, what keeps your career growing fastest?',
        options: [
          'Continuous learning: certs, labs, CTFs, and mentorship',
          'Stopping all practice once hired',
          'Only focusing on office politics',
          'Deleting your portfolio'
        ],
        answer: 0,
        explanation:
          'Security evolves constantly — sustained hands-on learning and mentorship compound your growth.'
      }
    ]
  }
];

// ============================================================
// HELPERS
// ============================================================

export const TEST_PASS_THRESHOLD = PASS_THRESHOLD;

export function getTestByPhaseId(phaseId) {
  return testData.find((test) => test.phaseId === phaseId) || null;
}

export function isTestPassed(score, total) {
  if (total <= 0) return false;
  const pct = Math.round((score / total) * 100);
  return pct >= PASS_THRESHOLD;
}
