// ============================================================
// QUIZ DATA — Cybersecurity Roadmap Knowledge Tests
// Each topic has 5–7 MCQ questions covering the full subject.
// ============================================================

export const quizData = {

  // ================================================================
  // PHASE 1: FOUNDATIONS & NETWORKING
  // ================================================================

  t1: {
    title: 'TCP/IP Model, DNS, DHCP, Subnetting',
    questions: [
      {
        question: 'How many layers does the TCP/IP model have?',
        options: ['4', '7', '5', '3'],
        answer: 0,
        explanation: 'The TCP/IP model has 4 layers: Network Access, Internet, Transport, and Application.'
      },
      {
        question: 'Which layer of the TCP/IP model is responsible for routing packets between networks?',
        options: ['Application', 'Internet', 'Transport', 'Network Access'],
        answer: 1,
        explanation: 'The Internet layer handles logical addressing and routing via IP packets.'
      },
      {
        question: 'What does DNS stand for?',
        options: ['Dynamic Network System', 'Domain Name System', 'Distributed Network Service', 'Data Name Server'],
        answer: 1,
        explanation: 'DNS (Domain Name System) translates human-readable domain names into IP addresses.'
      },
      {
        question: 'Which default port does DNS use?',
        options: ['80', '443', '53', '25'],
        answer: 2,
        explanation: 'DNS operates on port 53 using both UDP (queries) and TCP (zone transfers).'
      },
      {
        question: 'What does DHCP dynamically assign to client devices?',
        options: ['MAC addresses', 'IP addresses', 'Domain names', 'Port numbers'],
        answer: 1,
        explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, and gateway info to clients.'
      },
      {
        question: 'What is the subnet mask for a /24 network in dotted-decimal notation?',
        options: ['255.255.0.0', '255.0.0.0', '255.255.255.0', '255.255.255.128'],
        answer: 2,
        explanation: '/24 means 24 bits are masked, giving 255.255.255.0 — supporting 254 usable hosts.'
      },
      {
        question: 'Which TCP/IP layer handles end-to-end communication, flow control, and error recovery?',
        options: ['Internet', 'Network Access', 'Application', 'Transport'],
        answer: 3,
        explanation: 'The Transport layer (TCP/UDP) manages end-to-end communication between applications on different hosts.'
      }
    ]
  },

  t2: {
    title: 'Linux Command Line & File Permissions (Bash)',
    questions: [
      {
        question: 'Which command displays the current working directory in Linux?',
        options: ['ls', 'pwd', 'cd', 'dir'],
        answer: 1,
        explanation: '`pwd` (Print Working Directory) shows the absolute path of your current location in the filesystem.'
      },
      {
        question: 'In Linux permissions `rwxr-xr--`, what permissions does the "group" have?',
        options: ['rwx', 'r-x', 'r--', 'rw-'],
        answer: 1,
        explanation: 'Permissions are split as owner|group|others. The middle triplet `r-x` means group can read and execute, not write.'
      },
      {
        question: 'What does `chmod 755 script.sh` grant?',
        options: [
          'Owner read-only; everyone else nothing',
          'Everyone full access',
          'Owner gets rwx; group and others get r-x',
          'Removes all permissions'
        ],
        answer: 2,
        explanation: '755 = owner(7=rwx), group(5=r-x), others(5=r-x). Owner can read, write, execute; others can read and execute.'
      },
      {
        question: 'Which command is used to change file ownership in Linux?',
        options: ['chmod', 'chown', 'chgrp', 'usermod'],
        answer: 1,
        explanation: '`chown user:group file` changes the owner and group of a file or directory.'
      },
      {
        question: 'What does the `grep` command do?',
        options: ['Copies files', 'Searches text patterns in files', 'Lists processes', 'Changes directories'],
        answer: 1,
        explanation: '`grep` (Global Regular Expression Print) searches through files for lines matching a given pattern.'
      },
      {
        question: 'Which command shows running processes and resource usage in Linux?',
        options: ['ls', 'top', 'cat', 'find'],
        answer: 1,
        explanation: '`top` displays a real-time, dynamic view of running processes and their CPU/memory usage.'
      },
      {
        question: 'What does `sudo` allow a user to do?',
        options: ['Switch user accounts', 'Execute commands with superuser (root) privileges', 'Delete system files permanently', 'Mount storage drives'],
        answer: 1,
        explanation: '`sudo` (Superuser Do) lets authorized users run commands as root or another user, as configured in /etc/sudoers.'
      }
    ]
  },

  t3: {
    title: 'Windows Administration & Active Directory Basics',
    questions: [
      {
        question: 'What is Active Directory (AD) primarily used for?',
        options: ['File storage', 'Web hosting', 'Centralized identity and access management', 'Network traffic monitoring'],
        answer: 2,
        explanation: 'Active Directory provides centralized authentication, authorization, and management of users, computers, and resources in a Windows domain.'
      },
      {
        question: 'What is a Domain Controller (DC) in Active Directory?',
        options: ['A firewall appliance', 'A server that manages AD authentication and directory services', 'A client workstation', 'A managed network switch'],
        answer: 1,
        explanation: 'A Domain Controller hosts the AD database and handles all authentication requests within the domain.'
      },
      {
        question: 'Which protocols does Active Directory use for authentication?',
        options: ['RADIUS and TACACS+', 'LDAP and Kerberos', 'SAML and OAuth', 'SSH and SSL'],
        answer: 1,
        explanation: 'AD uses LDAP for directory queries and Kerberos for ticket-based authentication within the domain.'
      },
      {
        question: 'What tool is used to manage Active Directory users and computers?',
        options: ['Registry Editor', 'Task Manager', 'ADUC (Active Directory Users and Computers)', 'Control Panel'],
        answer: 2,
        explanation: 'ADUC (dsa.msc) is the standard Microsoft MMC snap-in for managing AD objects like users, groups, and OUs.'
      },
      {
        question: 'What is a Group Policy Object (GPO) used for in Active Directory?',
        options: ['Managing firewall rules on the router', 'Applying security and configuration settings to users and computers in AD', 'Encrypting files on the domain', 'Monitoring network traffic'],
        answer: 1,
        explanation: 'GPOs allow administrators to enforce security settings, software deployment, and desktop configurations across the domain.'
      },
      {
        question: 'Which Windows command shows details about the currently logged-in user including group memberships?',
        options: ['net user', 'ipconfig', 'netstat', 'whoami /all'],
        answer: 3,
        explanation: '`whoami /all` displays the username, SID, and all group memberships including privileges — essential for privilege escalation recon.'
      }
    ]
  },

  t4: {
    title: 'Introduction to Information Security Principles (CIA Triad)',
    questions: [
      {
        question: 'What does the "C" in the CIA Triad stand for?',
        options: ['Control', 'Confidentiality', 'Compliance', 'Cryptography'],
        answer: 1,
        explanation: 'Confidentiality ensures that sensitive information is only accessible to authorized individuals.'
      },
      {
        question: 'Which CIA Triad principle ensures data is accurate, consistent, and unaltered?',
        options: ['Availability', 'Confidentiality', 'Integrity', 'Authentication'],
        answer: 2,
        explanation: 'Integrity guarantees data is not modified by unauthorized parties and remains trustworthy.'
      },
      {
        question: 'A Distributed Denial of Service (DDoS) attack primarily threatens which CIA Triad pillar?',
        options: ['Confidentiality', 'Integrity', 'Availability', 'Authentication'],
        answer: 2,
        explanation: 'DDoS attacks flood a target with traffic, making services unavailable — a direct attack on Availability.'
      },
      {
        question: 'Encryption is primarily used to protect which CIA Triad principle?',
        options: ['Availability', 'Integrity', 'Confidentiality', 'Authorization'],
        answer: 2,
        explanation: 'Encryption ensures only authorized parties can read the data, protecting Confidentiality in transit and at rest.'
      },
      {
        question: 'What is non-repudiation in information security?',
        options: [
          'Denying access to unauthorized users',
          'Ensuring a party cannot deny having performed an action',
          'Encrypting all transmitted data',
          'Verifying user identity before access'
        ],
        answer: 1,
        explanation: 'Non-repudiation provides proof of origin and delivery — a user cannot deny sending a message if digital signatures are in place.'
      }
    ]
  },

  // ================================================================
  // PHASE 2: CORE SECURITY & DEFENSIVE TOOLS
  // ================================================================

  t5: {
    title: 'Firewalls, IDS/IPS, VPNs, and Network Security Monitoring',
    questions: [
      {
        question: 'What is the primary function of a firewall?',
        options: ['Detect and remove malware', 'Monitor bandwidth usage', 'Filter network traffic based on predefined rules', 'Encrypt all network communications'],
        answer: 2,
        explanation: 'Firewalls inspect incoming and outgoing traffic and allow or block packets based on configured rules.'
      },
      {
        question: 'What is the key difference between an IDS and an IPS?',
        options: [
          'IDS blocks traffic; IPS only detects it',
          'IDS only detects and alerts; IPS can actively block threats',
          'They are functionally identical',
          'IPS is software; IDS is always hardware'
        ],
        answer: 1,
        explanation: 'IDS (Intrusion Detection System) passively monitors and alerts. IPS (Intrusion Prevention System) sits inline and can block malicious traffic.'
      },
      {
        question: 'What does VPN stand for?',
        options: ['Virtual Private Network', 'Virtual Protocol Node', 'Verified Private Network', 'Variable Packet Network'],
        answer: 0,
        explanation: 'A VPN (Virtual Private Network) creates an encrypted tunnel over a public network, ensuring secure remote access.'
      },
      {
        question: 'Which VPN protocol is open-source and known for strong security, using port 1194 by default?',
        options: ['PPTP', 'L2TP/IPSec', 'OpenVPN', 'SSTP'],
        answer: 2,
        explanation: 'OpenVPN is a widely trusted open-source VPN protocol using SSL/TLS and often running on UDP 1194.'
      },
      {
        question: 'What is a DMZ in network security architecture?',
        options: [
          'A type of next-generation firewall',
          'A network segment isolating public-facing servers from the internal network',
          'An encrypted VPN tunnel',
          'A signature-based intrusion detection system'
        ],
        answer: 1,
        explanation: 'A DMZ (Demilitarized Zone) sits between the internet and internal network, hosting public services like web servers without exposing the internal LAN.'
      },
      {
        question: 'Which type of IDS monitors activity on a specific host or endpoint?',
        options: ['NIDS (Network-based IDS)', 'HIDS (Host-based IDS)', 'PIDS (Protocol-based IDS)', 'APIDS (Application-based IDS)'],
        answer: 1,
        explanation: 'HIDS monitors log files, system calls, and file integrity on a single host to detect insider threats or compromises.'
      },
      {
        question: 'What is the primary goal of Network Security Monitoring (NSM)?',
        options: [
          'Encrypting all network packets at rest',
          'Detecting and responding to threats by collecting and analyzing network data',
          'Configuring firewall ACL rules',
          'Setting up site-to-site VPN tunnels'
        ],
        answer: 1,
        explanation: 'NSM collects network traffic metadata and full packet captures to enable threat detection and incident response.'
      }
    ]
  },

  t6: {
    title: 'SIEM Fundamentals (Splunk / ELK Stack)',
    questions: [
      {
        question: 'What does SIEM stand for?',
        options: [
          'Security Information and Event Management',
          'System Intrusion and Event Monitoring',
          'Secure Identity and Encryption Management',
          'Security Integration and Error Monitoring'
        ],
        answer: 0,
        explanation: 'SIEM aggregates security data from multiple sources, correlates events, and provides real-time threat detection and compliance reporting.'
      },
      {
        question: 'What is the primary purpose of a SIEM platform?',
        options: [
          'Encrypt sensitive data at rest',
          'Aggregate, correlate, and analyze security logs to detect threats',
          'Block network-based attacks in real time',
          'Manage user passwords and credentials'
        ],
        answer: 1,
        explanation: 'SIEM centralizes log data and uses correlation rules to identify patterns indicating security incidents.'
      },
      {
        question: 'In Splunk, what query language is used to search and analyze log data?',
        options: ['SQL', 'KQL (Kusto Query Language)', 'SPL (Search Processing Language)', 'Splunk Python API'],
        answer: 2,
        explanation: 'SPL (Search Processing Language) is Splunk\'s proprietary language for querying, transforming, and visualizing data.'
      },
      {
        question: 'What does the ELK Stack stand for?',
        options: [
          'Endpoint, Linux, Kubernetes',
          'Elasticsearch, Logstash, Kibana',
          'Encryption, Logging, Key Management',
          'Event, Log, Kubernetes'
        ],
        answer: 1,
        explanation: 'ELK = Elasticsearch (search/storage), Logstash (log ingestion/parsing), and Kibana (visualization dashboard).'
      },
      {
        question: 'What does "event correlation" mean in a SIEM context?',
        options: [
          'Copying log files to a backup server',
          'Linking multiple security events across sources to identify patterns of an attack',
          'Encrypting log data at rest',
          'Automatically deleting logs older than 30 days'
        ],
        answer: 1,
        explanation: 'Correlation connects disparate events (e.g., failed logins + privilege escalation) to detect multi-step attacks like APTs.'
      },
      {
        question: 'What is a SIEM "use case" or detection rule?',
        options: [
          'A user account with special privileges',
          'A predefined rule that triggers an alert when specific log conditions are met',
          'A firewall ACL entry',
          'A network segment for sensitive systems'
        ],
        answer: 1,
        explanation: 'Use cases define the logic for when SIEM should fire an alert — e.g., "alert if 5+ failed logins from same IP in 1 minute".'
      }
    ]
  },

  t7: {
    title: 'Endpoint Security & Antivirus/EDR Solutions',
    questions: [
      {
        question: 'What does EDR stand for?',
        options: [
          'Endpoint Detection and Response',
          'Event Detection and Reporting',
          'Enhanced Defense Router',
          'Endpoint Data Recovery'
        ],
        answer: 0,
        explanation: 'EDR (Endpoint Detection and Response) monitors endpoints in real time, records activity, and enables rapid response to threats.'
      },
      {
        question: 'How does EDR differ from traditional antivirus software?',
        options: [
          'EDR only scans for known viruses using signatures',
          'EDR provides continuous behavioral monitoring, threat hunting, and incident response capabilities',
          'Traditional antivirus is more advanced than EDR',
          'EDR only works on server operating systems'
        ],
        answer: 1,
        explanation: 'Traditional AV uses signatures; EDR uses behavioral analysis, machine learning, and telemetry to detect unknown and fileless threats.'
      },
      {
        question: 'In endpoint security, what is a "false positive"?',
        options: [
          'A real threat that was missed by the security tool',
          'A legitimate, benign activity incorrectly flagged as malicious',
          'A virus that successfully evades detection',
          'A failed antivirus scan due to system errors'
        ],
        answer: 1,
        explanation: 'False positives create alert fatigue — legitimate software flagged as malware — reducing SOC efficiency.'
      },
      {
        question: 'What is "threat hunting" in the context of endpoint security?',
        options: [
          'Automatically deleting files identified as malware',
          'Proactively searching for hidden or advanced threats that evade automated detection',
          'Running scheduled antivirus scans on all endpoints',
          'Blocking all USB drive access on corporate devices'
        ],
        answer: 1,
        explanation: 'Threat hunters manually investigate endpoints using hypotheses and threat intelligence, finding threats that slip past automated tools.'
      },
      {
        question: 'Which of the following is a well-known EDR solution used in enterprise environments?',
        options: ['Wireshark', 'CrowdStrike Falcon', 'Nmap', 'Burp Suite'],
        answer: 1,
        explanation: 'CrowdStrike Falcon is a leading cloud-native EDR platform known for its threat intelligence and behavioral detection capabilities.'
      }
    ]
  },

  t8: {
    title: 'Basic Cryptography (Hashing, Symmetric/Asymmetric Encryption)',
    questions: [
      {
        question: 'What is a cryptographic hash function used for?',
        options: [
          'Encrypting data for secure transmission',
          'Generating a fixed-size digest (fingerprint) from any input data',
          'Creating public/private key pairs for asymmetric encryption',
          'Compressing files for storage efficiency'
        ],
        answer: 1,
        explanation: 'Hash functions produce a fixed-length output from any input. They are one-way (irreversible) and used for integrity verification.'
      },
      {
        question: 'Which hashing algorithm is considered cryptographically broken and should NOT be used for security?',
        options: ['SHA-256', 'SHA-3', 'MD5', 'bcrypt'],
        answer: 2,
        explanation: 'MD5 is vulnerable to collision attacks — two different inputs can produce the same hash — making it unsuitable for security purposes.'
      },
      {
        question: 'In symmetric encryption, what key is used for both encryption and decryption?',
        options: ['A public key', 'A private key', 'The same shared secret key', 'A session hash'],
        answer: 2,
        explanation: 'Symmetric encryption uses a single shared key. Both sender and receiver must have the same key, which is the key distribution challenge.'
      },
      {
        question: 'Which of the following is a symmetric encryption algorithm?',
        options: ['RSA', 'ECC (Elliptic Curve Cryptography)', 'AES (Advanced Encryption Standard)', 'Diffie-Hellman'],
        answer: 2,
        explanation: 'AES is the gold-standard symmetric encryption algorithm, used in WPA2, TLS, and disk encryption (BitLocker, VeraCrypt).'
      },
      {
        question: 'In asymmetric encryption, what is the PUBLIC key primarily used for?',
        options: ['Decrypting messages sent by the owner', 'Signing digital documents', 'Encrypting messages sent TO the owner', 'Generating password hashes'],
        answer: 2,
        explanation: 'Anyone can use your public key to encrypt a message; only your private key can decrypt it — ensuring confidentiality.'
      },
      {
        question: 'What is a digital signature used for in cryptography?',
        options: [
          'Encrypting emails for confidentiality',
          'Verifying the authenticity and integrity of a message or document',
          'Compressing files before transmission',
          'Generating symmetric session keys'
        ],
        answer: 1,
        explanation: 'A digital signature uses the sender\'s private key to sign data. The receiver verifies with the public key, confirming authenticity and integrity.'
      },
      {
        question: 'What is PKI (Public Key Infrastructure)?',
        options: [
          'A type of symmetric block cipher',
          'A framework for managing digital certificates, public/private keys, and certificate authorities',
          'A hashing algorithm family',
          'A network protocol for key exchange'
        ],
        answer: 1,
        explanation: 'PKI enables trust in digital communications by issuing and managing digital certificates through Certificate Authorities (CAs) like DigiCert or Let\'s Encrypt.'
      }
    ]
  },

  // ================================================================
  // PHASE 3: OFFENSIVE SECURITY & PENETRATION TESTING
  // ================================================================

  t9: {
    title: 'Reconnaissance & OSINT (Nmap, Shodan, Maltego)',
    questions: [
      {
        question: 'What does OSINT stand for in cybersecurity?',
        options: [
          'Open Source Intelligence',
          'Operational Security Intelligence',
          'Online System Intrusion Testing',
          'Open System Integration'
        ],
        answer: 0,
        explanation: 'OSINT involves collecting information from publicly available sources — websites, social media, databases — without directly interacting with the target.'
      },
      {
        question: 'What is Nmap primarily used for in penetration testing?',
        options: [
          'Cracking password hashes',
          'Network discovery, port scanning, and service enumeration',
          'Web application vulnerability testing',
          'Real-time log analysis'
        ],
        answer: 1,
        explanation: 'Nmap (Network Mapper) is the industry-standard tool for discovering hosts, open ports, running services, and OS fingerprinting.'
      },
      {
        question: 'Which Nmap flag performs a stealthy TCP SYN (half-open) scan?',
        options: ['-sV', '-O', '-sS', '-A'],
        answer: 2,
        explanation: '`-sS` sends SYN packets and doesn\'t complete the TCP handshake, making it stealthier than a full connect scan (-sT).'
      },
      {
        question: 'What is Shodan primarily used for?',
        options: [
          'Cracking password hashes offline',
          'Searching for internet-connected devices, services, and vulnerabilities',
          'Capturing and analyzing network packets',
          'Aggregating and correlating SIEM logs'
        ],
        answer: 1,
        explanation: 'Shodan is a search engine for internet-facing devices (cameras, routers, ICS/SCADA) — invaluable for external reconnaissance.'
      },
      {
        question: 'What is Maltego used for in OSINT investigations?',
        options: [
          'Performing automated port scans',
          'Visually mapping relationships between entities like domains, IPs, emails, and people',
          'Analyzing network packet captures',
          'Running automated vulnerability scans'
        ],
        answer: 1,
        explanation: 'Maltego uses "transforms" to query data sources and build graphical link-analysis charts showing connections between entities.'
      },
      {
        question: 'What is "passive reconnaissance"?',
        options: [
          'Directly sending probe packets to the target system',
          'Gathering intelligence without directly interacting with the target',
          'Performing a brute force attack on login portals',
          'Scanning target for open ports using Nmap'
        ],
        answer: 1,
        explanation: 'Passive recon uses publicly available data (WHOIS, DNS records, social media) and leaves no trace on the target\'s systems.'
      },
      {
        question: 'Which Nmap flag enables operating system detection?',
        options: ['-sV', '-O', '-p', '-T4'],
        answer: 1,
        explanation: '`-O` enables OS detection by analyzing TCP/IP stack responses. Combine with `-sV` for service version detection.'
      }
    ]
  },

  t10: {
    title: 'Web Application Vulnerabilities (OWASP Top 10, Burp Suite)',
    questions: [
      {
        question: 'What is SQL Injection (SQLi)?',
        options: [
          'Injecting CSS code into a web page\'s style',
          'Inserting malicious SQL statements into input fields to manipulate the backend database',
          'A network-level packet injection attack',
          'Injecting JavaScript into email clients'
        ],
        answer: 1,
        explanation: 'SQLi allows attackers to read, modify, or delete database data by injecting SQL commands through unvalidated user inputs.'
      },
      {
        question: 'What does XSS stand for?',
        options: ['Extended Style Sheets', 'Cross-Site Scripting', 'Cross-Server Synchronization', 'Extreme Security Scanning'],
        answer: 1,
        explanation: 'XSS (Cross-Site Scripting) injects malicious scripts into web pages viewed by other users, enabling session hijacking and credential theft.'
      },
      {
        question: 'According to OWASP Top 10, what is "Broken Access Control"?',
        options: [
          'Using outdated or weak encryption algorithms',
          'Users being able to access resources or perform actions beyond their intended permissions',
          'SQL injection through web form inputs',
          'Using weak or default passwords on admin accounts'
        ],
        answer: 1,
        explanation: 'Broken Access Control is the #1 OWASP risk — it includes IDOR (Insecure Direct Object Reference), privilege escalation, and missing authorization checks.'
      },
      {
        question: 'What is Burp Suite primarily used for?',
        options: [
          'Network packet capture and analysis',
          'Web application security testing by intercepting and manipulating HTTP/S traffic',
          'Offline password hash cracking',
          'Open-source intelligence (OSINT) gathering'
        ],
        answer: 1,
        explanation: 'Burp Suite is the go-to web pentesting platform — its proxy intercepts browser traffic, and its scanner finds vulnerabilities like XSS, SQLi, and CSRF.'
      },
      {
        question: 'What is CSRF (Cross-Site Request Forgery)?',
        options: [
          'Stealing authentication cookies using XSS',
          'Tricking an authenticated user into unknowingly making a malicious request to a trusted site',
          'A variant of SQL injection targeting stored procedures',
          'A volumetric DDoS attack on web servers'
        ],
        answer: 1,
        explanation: 'CSRF exploits a site\'s trust in the user\'s browser — an attacker tricks a logged-in victim into submitting a request (e.g., bank transfer) without their knowledge.'
      },
      {
        question: 'What is "Security Misconfiguration" in the OWASP Top 10?',
        options: [
          'Using outdated cryptographic algorithms like MD5',
          'Improperly configured security settings leaving systems exposed to attacks',
          'SQL injection exploiting stored procedures in databases',
          'Using weak, guessable passwords on all accounts'
        ],
        answer: 1,
        explanation: 'Security misconfiguration includes default credentials, open cloud buckets, verbose error messages, and unnecessary features left enabled.'
      },
      {
        question: 'What is the purpose of a WAF (Web Application Firewall)?',
        options: [
          'Encrypting web traffic using TLS certificates',
          'Filtering and monitoring HTTP/S traffic to detect and block web application attacks',
          'Managing user authentication sessions',
          'Scanning server file systems for malware'
        ],
        answer: 1,
        explanation: 'A WAF sits in front of web apps and applies rules to block common attacks like SQLi, XSS, and CSRF before they reach the application.'
      }
    ]
  },

  t11: {
    title: 'Network Penetration Testing & Metasploit Framework',
    questions: [
      {
        question: 'What is the Metasploit Framework?',
        options: [
          'A password manager for security professionals',
          'A comprehensive penetration testing platform with exploits, payloads, and auxiliary tools',
          'A network packet analysis tool like Wireshark',
          'A SIEM platform for log correlation'
        ],
        answer: 1,
        explanation: 'Metasploit is the world\'s most widely used pentesting framework, providing a massive library of exploits, payloads, encoders, and post-exploitation modules.'
      },
      {
        question: 'What is a "payload" in the Metasploit Framework?',
        options: [
          'The network traffic generated by a scan',
          'The code that is executed on the target system after a successful exploit',
          'A module that scans for vulnerabilities without exploiting them',
          'A firewall evasion rule'
        ],
        answer: 1,
        explanation: 'A payload defines what happens after exploitation — e.g., Meterpreter (advanced shell), reverse_tcp (connect back), or bind_tcp (listen on target).'
      },
      {
        question: 'What does Meterpreter provide in Metasploit?',
        options: [
          'A web application vulnerability scanner',
          'An advanced, in-memory interactive shell on a compromised system with built-in commands',
          'Automated firewall rule bypassing',
          'Real-time log analysis and alerting'
        ],
        answer: 1,
        explanation: 'Meterpreter runs entirely in memory (no disk footprint), supports encrypted communications, and provides powerful post-exploitation commands.'
      },
      {
        question: 'What is the purpose of `auxiliary` modules in Metasploit?',
        options: [
          'To exploit known vulnerabilities in remote services',
          'To perform supporting tasks like scanning, fuzzing, brute forcing, and enumeration',
          'To generate and encode payloads for delivery',
          'To escalate privileges after gaining initial access'
        ],
        answer: 1,
        explanation: 'Auxiliary modules don\'t exploit systems — they gather info through port scanning, service enumeration, credential brute forcing, and more.'
      },
      {
        question: 'In network pentesting, what is a "reverse shell"?',
        options: [
          'The attacker connects to a port open on the target machine',
          'The compromised target machine connects back to the attacker\'s listener',
          'A type of site-to-site VPN connection',
          'A firewall bypass using protocol tunneling'
        ],
        answer: 1,
        explanation: 'Reverse shells are preferred when the target is behind a firewall/NAT — the victim initiates the connection outbound to the attacker\'s IP.'
      },
      {
        question: 'What does the `db_nmap` command do inside Metasploit\'s msfconsole?',
        options: [
          'Deletes the Metasploit workspace database',
          'Runs an Nmap scan and automatically saves results into Metasploit\'s database for use in exploitation',
          'Downloads the latest exploit modules from GitHub',
          'Lists all available payloads in the current module'
        ],
        answer: 1,
        explanation: '`db_nmap` integrates Nmap results directly into Metasploit\'s database, making discovered hosts and services immediately available for exploitation.'
      }
    ]
  },

  t12: {
    title: 'Privilege Escalation (Linux & Windows)',
    questions: [
      {
        question: 'What is privilege escalation in cybersecurity?',
        options: [
          'Gaining higher system privileges (e.g., root/SYSTEM) from a lower-privileged account',
          'Logging in directly as the administrator using stolen credentials',
          'Creating new privileged user accounts on a system',
          'Encrypting system files to lock out the legitimate user'
        ],
        answer: 0,
        explanation: 'Privilege escalation is the act of exploiting bugs, misconfigurations, or vulnerabilities to gain elevated access on a system.'
      },
      {
        question: 'What is a SUID (Set User ID) binary in Linux, and why is it dangerous?',
        options: [
          'A file that executes with the permissions of the file\'s owner (often root), not the executing user',
          'A firewall rule blocking unauthorized users',
          'A type of rootkit that modifies kernel modules',
          'A read-only log file protected from modification'
        ],
        answer: 0,
        explanation: 'If a SUID binary has vulnerabilities or misuse potential (e.g., bash, find, vim), attackers can exploit it to execute code as root.'
      },
      {
        question: 'What does running `sudo -l` reveal to an attacker?',
        options: [
          'Active system log entries and audit trails',
          'Which commands the current user can execute with sudo (potentially without a password)',
          'All currently running processes and their PIDs',
          'Active network connections and listening ports'
        ],
        answer: 1,
        explanation: '`sudo -l` lists sudo privileges for the current user — misconfigured entries (e.g., NOPASSWD: /bin/bash) are direct privilege escalation paths.'
      },
      {
        question: 'What is "Pass the Hash" (PtH) in Windows environments?',
        options: [
          'Cracking NTLM password hashes using rainbow tables or brute force',
          'Authenticating to Windows services using a captured NTLM hash without knowing the plaintext password',
          'Brute forcing the administrator account password',
          'Injecting shellcode into running processes using reflective DLL injection'
        ],
        answer: 1,
        explanation: 'PtH exploits Windows NTLM authentication — since the hash IS the authenticator, attackers can use captured hashes without cracking them.'
      },
      {
        question: 'What tool is commonly used for automated Windows privilege escalation enumeration?',
        options: ['Nmap', 'WinPEAS (Windows Privilege Escalation Awesome Script)', 'Burp Suite', 'Wireshark'],
        answer: 1,
        explanation: 'WinPEAS automatically enumerates misconfigurations, unquoted service paths, weak permissions, and other Windows privesc vectors.'
      },
      {
        question: 'What is a kernel exploit in the context of privilege escalation?',
        options: [
          'A web-based attack targeting a server\'s application layer',
          'Exploiting a vulnerability in the operating system kernel to gain root or SYSTEM privileges',
          'A phishing attack targeting system administrators',
          'A network scan to identify vulnerable services'
        ],
        answer: 1,
        explanation: 'Kernel exploits like Dirty COW (CVE-2016-5195) target vulnerabilities in the OS kernel, granting root access regardless of user permissions.'
      }
    ]
  },

  // ================================================================
  // PHASE 4: CERTIFICATIONS & SPECIALIZATIONS
  // ================================================================

  t13: {
    title: 'CompTIA Security+ / CEH Certification',
    questions: [
      {
        question: 'What does the CompTIA Security+ certification validate?',
        options: [
          'Advanced penetration testing and exploit development skills',
          'Baseline cybersecurity knowledge including threats, vulnerabilities, and security controls',
          'Network engineering and Cisco routing/switching expertise',
          'Cloud architecture and DevSecOps practices'
        ],
        answer: 1,
        explanation: 'Security+ is a vendor-neutral cert validating core security skills — a common baseline requirement for cybersecurity roles.'
      },
      {
        question: 'What does CEH stand for?',
        options: ['Certified Ethical Hacker', 'Certified Enterprise Hacker', 'Certified Endpoint Handler', 'Cyber Ethical Hacking'],
        answer: 0,
        explanation: 'CEH (Certified Ethical Hacker) by EC-Council teaches thinking and tools used by malicious hackers, applied legally and ethically.'
      },
      {
        question: 'Which organization offers the CEH certification?',
        options: ['CompTIA', 'EC-Council', 'ISACA', 'ISC²'],
        answer: 1,
        explanation: 'EC-Council (International Council of E-Commerce Consultants) developed and maintains the CEH certification.'
      },
      {
        question: 'What exam code is associated with the current CompTIA Security+ certification?',
        options: ['SY0-701', 'CEH-001', 'CISSP-1', 'CHP-100'],
        answer: 0,
        explanation: 'SY0-701 is the current (2023 onwards) CompTIA Security+ exam code, replacing SY0-601.'
      },
      {
        question: 'CompTIA Security+ is approved by which U.S. government mandate for IT security roles?',
        options: ['FISMA', 'DoD 8570/8140', 'HIPAA Security Rule', 'PCI DSS v4'],
        answer: 1,
        explanation: 'DoD 8570/8140 mandates Security+ for U.S. Department of Defense personnel in IAT (Information Assurance Technical) roles.'
      },
      {
        question: 'What does the CEH certification primarily teach?',
        options: [
          'Enterprise network design and BGP routing',
          'Thinking like an attacker — using hacking tools and techniques ethically to identify vulnerabilities',
          'Cloud migration and serverless architecture',
          'Relational database design and SQL optimization'
        ],
        answer: 1,
        explanation: 'CEH covers reconnaissance, scanning, exploitation, and reporting from an attacker\'s perspective — legally and ethically.'
      }
    ]
  },

  t14: {
    title: 'Offensive Security Certified Professional (OSCP)',
    questions: [
      {
        question: 'What does OSCP stand for?',
        options: [
          'Open Source Certified Professional',
          'Offensive Security Certified Professional',
          'Online Security Compliance Program',
          'Operational Security Certified Practitioner'
        ],
        answer: 1,
        explanation: 'OSCP is Offensive Security\'s flagship penetration testing certification, globally recognized as a gold standard in the industry.'
      },
      {
        question: 'Who offers the OSCP certification?',
        options: ['EC-Council', 'CompTIA', 'Offensive Security (OffSec)', 'ISC²'],
        answer: 2,
        explanation: 'Offensive Security (now OffSec) created OSCP alongside Kali Linux and runs the PWK course that prepares candidates for the exam.'
      },
      {
        question: 'What is the format of the OSCP exam?',
        options: [
          'A 4-hour multiple-choice online exam',
          'A 24-hour hands-on practical exam requiring exploitation of real machines in a lab environment',
          'An oral examination with a panel of expert hackers',
          'A written report with no practical component'
        ],
        answer: 1,
        explanation: 'OSCP is a grueling 24-hour exam where candidates must compromise machines in an isolated network and submit a detailed penetration test report.'
      },
      {
        question: 'What training course is the prerequisite/companion to the OSCP exam?',
        options: [
          'CEH (Certified Ethical Hacker) course',
          'CompTIA Security+ bootcamp',
          'PWK (Penetration Testing with Kali Linux) / PEN-200 course',
          'CISSP prep course'
        ],
        answer: 2,
        explanation: 'PWK (PEN-200) is OffSec\'s official course, providing lab access with vulnerable machines to practice the skills tested in the OSCP exam.'
      },
      {
        question: 'What makes OSCP stand out from other cybersecurity certifications?',
        options: [
          'It is the least expensive certification available',
          'It requires zero prior security knowledge',
          'It is a fully practical, hands-on exam — you must demonstrate real exploitation skills, not just theory',
          'It is an open-book online test with unlimited retakes'
        ],
        answer: 2,
        explanation: '"Try Harder" — OSCP\'s motto reflects its demand for real hacking ability. No amount of memorization passes it; you must pwn machines under pressure.'
      }
    ]
  },

  t15: {
    title: 'Cloud Security (AWS/Azure Security Fundamentals)',
    questions: [
      {
        question: 'What is the AWS Shared Responsibility Model?',
        options: [
          'AWS is responsible for all security, including customer data',
          'Security responsibilities are divided: AWS secures the cloud infrastructure; customers secure what they put in the cloud',
          'The customer is responsible for all security including the physical datacenter',
          'A compliance framework exclusively for government agencies'
        ],
        answer: 1,
        explanation: 'AWS secures "of the cloud" (hardware, networking, hypervisor); customers secure "in the cloud" (data, IAM, applications, configurations).'
      },
      {
        question: 'What does IAM stand for in AWS?',
        options: ['Internet Access Management', 'Identity and Access Management', 'Internal Audit Management', 'Incident and Alert Management'],
        answer: 1,
        explanation: 'AWS IAM controls who (identity) can do what (access) to which AWS resources — through users, roles, groups, and policies.'
      },
      {
        question: 'Which AWS service records API calls and user activity for auditing and compliance?',
        options: ['AWS Shield', 'AWS CloudTrail', 'AWS WAF', 'Amazon GuardDuty'],
        answer: 1,
        explanation: 'CloudTrail logs every API call made in your AWS account — who did what, when, and from where — essential for security auditing and incident investigation.'
      },
      {
        question: 'What is Azure Security Center (Microsoft Defender for Cloud)?',
        options: [
          'Microsoft\'s physical datacenter security team',
          'A unified cloud security management and threat protection platform for Azure resources',
          'A software firewall service exclusively for Azure VMs',
          'Microsoft\'s content delivery network (CDN) service'
        ],
        answer: 1,
        explanation: 'Defender for Cloud provides security posture management, threat detection, and compliance monitoring across Azure and hybrid environments.'
      },
      {
        question: 'What does "defense in depth" mean in cloud security?',
        options: [
          'Relying on one extremely strong perimeter security control',
          'Implementing multiple layered security controls so that if one fails, others still protect the system',
          'Only protecting the network perimeter and firewall',
          'Encrypting all data at rest and ignoring network controls'
        ],
        answer: 1,
        explanation: 'Defense in depth uses multiple security layers (IAM, encryption, firewalls, logging, WAF) so a single control failure doesn\'t result in a breach.'
      },
      {
        question: 'What does a CSPM (Cloud Security Posture Management) tool do?',
        options: [
          'Manages virtual machine scaling and load balancing',
          'Continuously monitors cloud configurations for misconfigurations, compliance violations, and security risks',
          'Encrypts all data stored in cloud object storage buckets',
          'Manages network load balancing across availability zones'
        ],
        answer: 1,
        explanation: 'CSPM tools like Prisma Cloud and AWS Security Hub automatically detect misconfigurations (e.g., public S3 buckets, overly permissive IAM) across cloud accounts.'
      }
    ]
  },

  t16: {
    title: 'Incident Response & Digital Forensics (DFIR)',
    questions: [
      {
        question: 'What are the phases of the NIST Incident Response lifecycle?',
        options: [
          'Identify, Protect, Detect, Respond, Recover (NIST CSF)',
          'Preparation, Detection & Analysis, Containment, Eradication, Recovery, Post-Incident Activity',
          'Plan, Scan, Exploit, Report (pentesting lifecycle)',
          'Detect, Analyze, Block, Delete, Restore'
        ],
        answer: 1,
        explanation: 'NIST SP 800-61 defines the IR lifecycle: Preparation → Detection & Analysis → Containment → Eradication → Recovery → Lessons Learned.'
      },
      {
        question: 'What is "chain of custody" in digital forensics?',
        options: [
          'A blockchain-based evidence management system',
          'Documented tracking of who handled evidence, when, and how, ensuring its integrity and admissibility',
          'A network protocol for secure evidence transmission',
          'An automated malware analysis technique'
        ],
        answer: 1,
        explanation: 'Chain of custody documentation is legally critical — it proves evidence hasn\'t been tampered with from collection through courtroom presentation.'
      },
      {
        question: 'What does "triage" mean in incident response?',
        options: [
          'Permanently deleting compromised files and malware',
          'Quickly assessing and prioritizing security incidents based on their severity and impact',
          'Restoring systems from backup after an attack',
          'Sending breach notifications to affected users'
        ],
        answer: 1,
        explanation: 'IR triage determines which incidents are most severe and require immediate attention — preventing responders from being overwhelmed by alerts.'
      },
      {
        question: 'Which tool is the industry standard for memory forensics analysis?',
        options: ['Nmap', 'Volatility Framework', 'Burp Suite', 'Metasploit'],
        answer: 1,
        explanation: 'Volatility analyzes RAM dumps to recover running processes, network connections, malware artifacts, encryption keys, and attacker activity in memory.'
      },
      {
        question: 'What is an IOC (Indicator of Compromise)?',
        options: [
          'A digital security certificate issued by a CA',
          'A forensic artifact or observable piece of evidence suggesting a system has been compromised',
          'A compliance policy requirement under GDPR',
          'A network topology diagram showing critical assets'
        ],
        answer: 1,
        explanation: 'IOCs include malicious IPs, domains, file hashes, registry keys, and behavioral patterns — shared in formats like STIX/TAXII for threat intelligence.'
      },
      {
        question: 'Why do forensic investigators create a disk image before analyzing a compromised system?',
        options: [
          'To securely delete evidence of the breach',
          'To create an exact bit-by-bit copy of storage media, preserving original evidence while allowing safe analysis',
          'To encrypt the drive before sending it to law enforcement',
          'To reformat the drive and remove malware'
        ],
        answer: 1,
        explanation: 'Working on a forensic image (using tools like dd or FTK Imager) preserves the original evidence intact and ensures the hash values match for legal admissibility.'
      }
    ]
  },

  // ================================================================
  // PHASE 5: CAREER LAUNCH
  // ================================================================

  t17: {
    title: 'Build Cybersecurity Portfolio & Write Technical Writeups',
    questions: [
      {
        question: 'What should a cybersecurity portfolio primarily demonstrate to potential employers?',
        options: [
          'Academic qualifications and GPA from university',
          'Practical hands-on skills, real projects, CTF achievements, and tool proficiency',
          'Only social media presence and follower count',
          'Pure theoretical knowledge without practical application'
        ],
        answer: 1,
        explanation: 'Employers value demonstrated skills over credentials — a portfolio with working projects, writeups, and code proves you can actually do the job.'
      },
      {
        question: 'What is a CTF writeup?',
        options: [
          'A malware analysis report submitted to antivirus vendors',
          'A detailed, step-by-step walkthrough of how you solved a CTF challenge, including methodology and tools',
          'A resume template formatted for cybersecurity positions',
          'A formal certification study guide'
        ],
        answer: 1,
        explanation: 'CTF writeups showcase your problem-solving approach and technical depth — top-quality writeups on Medium or personal blogs significantly boost visibility.'
      },
      {
        question: 'Which platforms are best for hosting and showcasing a cybersecurity portfolio?',
        options: [
          'Only LinkedIn profiles',
          'GitHub (code/tools), personal blog (writeups), and platforms like Medium or HackMD',
          'Facebook and Instagram pages',
          'Only company intranets and private repositories'
        ],
        answer: 1,
        explanation: 'GitHub shows code quality, a blog shows communication skills, and LinkedIn creates professional visibility — all three together are most effective.'
      },
      {
        question: 'What makes a technical security writeup genuinely valuable?',
        options: [
          'Maximum length with extensive padding and repetition',
          'Clear methodology, reproducible steps, specific tools used, and lessons learned',
          'Using maximum technical jargon to impress readers',
          'Avoiding technical details to keep it accessible to all audiences'
        ],
        answer: 1,
        explanation: 'Great writeups are clear, reproducible, and educational — they demonstrate structured thinking, which is exactly what security teams value.'
      },
      {
        question: 'Why is contributing to open-source security tools beneficial for your career?',
        options: [
          'It provides direct monetary compensation from downloads',
          'It demonstrates collaboration skills, code quality, security expertise, and community involvement',
          'It is a mandatory requirement for all security certifications',
          'It replaces the need for formal university education'
        ],
        answer: 1,
        explanation: 'Contributing to tools like Metasploit, OWASP projects, or threat intelligence platforms shows real-world collaboration and technical credibility.'
      }
    ]
  },

  t18: {
    title: 'Participate in CTF Competitions (HackTheBox / TryHackMe)',
    questions: [
      {
        question: 'What does CTF stand for in the cybersecurity context?',
        options: ['Catch The Flag', 'Capture The Flag', 'Cybersecurity Training Framework', 'Code Testing Format'],
        answer: 1,
        explanation: 'CTF (Capture The Flag) competitions challenge participants to find hidden flags in vulnerable systems, covering hacking, crypto, forensics, and more.'
      },
      {
        question: 'What is HackTheBox (HTB)?',
        options: [
          'A social network for cybersecurity professionals',
          'An online platform providing legal lab machines and challenges for practicing real-world penetration testing',
          'A certification body for ethical hacking credentials',
          'A database of publicly known vulnerabilities'
        ],
        answer: 1,
        explanation: 'HackTheBox hosts realistic vulnerable machines (Windows, Linux, Active Directory) for ethical hacking practice — machines are created by the community and industry professionals.'
      },
      {
        question: 'What types of challenges are typically found in CTF competitions?',
        options: [
          'Exclusively networking configuration challenges',
          'Reverse engineering, web exploitation, cryptography, forensics, OSINT, binary exploitation, and more',
          'Only programming algorithm challenges',
          'Multiple-choice theory questions about security concepts'
        ],
        answer: 1,
        explanation: 'CTFs cover a wide range of disciplines — each category tests different skills, making them excellent for building broad cybersecurity competency.'
      },
      {
        question: 'What makes TryHackMe different from HackTheBox for beginners?',
        options: [
          'TryHackMe focuses exclusively on advanced bug bounty hunting',
          'TryHackMe offers guided, beginner-friendly learning rooms with step-by-step instructions alongside challenges',
          'TryHackMe is an enterprise security consulting firm',
          'TryHackMe sells proprietary security hardware tools'
        ],
        answer: 1,
        explanation: 'TryHackMe is ideal for beginners — structured learning paths, guided rooms, and browser-based attack machines make it highly accessible for newcomers.'
      },
      {
        question: 'What is a "flag" in a CTF competition?',
        options: [
          'A country flag image used as a visual marker',
          'A hidden token or string (e.g., flag{s0m3_s3cr3t}) that proves you successfully exploited a challenge',
          'A security certificate awarded after completing a challenge',
          'A captured network packet containing sensitive data'
        ],
        answer: 1,
        explanation: 'Flags are typically formatted strings (e.g., HTB{...} or picoCTF{...}) hidden in files, databases, or memory — submitting them proves you pwned the challenge.'
      }
    ]
  },

  t19: {
    title: 'Mock Interviews & Resume Optimization',
    questions: [
      {
        question: 'For entry-level cybersecurity candidates, which resume section should receive the most emphasis?',
        options: [
          'Publications in academic journals',
          'Hands-on projects, labs, CTF achievements, and certifications',
          'Hobbies and personal interests section',
          'References from unrelated previous employers'
        ],
        answer: 1,
        explanation: 'Entry-level candidates lack work experience, so demonstrating hands-on skills through projects, HTB/THM profiles, and certifications is critical.'
      },
      {
        question: 'What is the STAR method used for in cybersecurity job interviews?',
        options: [
          'Formatting a professional cybersecurity resume',
          'Structuring behavioral interview answers: Situation, Task, Action, Result',
          'A technical skill assessment framework used by employers',
          'A salary negotiation strategy for security professionals'
        ],
        answer: 1,
        explanation: 'STAR structures your behavioral answers (e.g., "Tell me about a time you dealt with a security incident") into a clear, compelling narrative.'
      },
      {
        question: 'What should a cybersecurity resume emphasize over a general IT resume?',
        options: [
          'Office productivity software proficiency',
          'Security tools experience, incident response work, certifications, and documented security projects',
          'Typing speed and data entry accuracy',
          'Customer service and communication roles'
        ],
        answer: 1,
        explanation: 'Cybersecurity resumes should lead with security-specific skills, tools (Splunk, Metasploit, Wireshark), and relevant certifications and projects.'
      },
      {
        question: 'Which is a common behavioral interview question in cybersecurity roles?',
        options: [
          '"What is your favorite programming language and why?"',
          '"Tell me about a time you identified a security vulnerability and how you handled it."',
          '"How fast can you type and process data?"',
          '"What was your GPA in university?"'
        ],
        answer: 1,
        explanation: 'Behavioral questions assess how you handle real situations — prepare STAR-method answers about incidents, problem-solving, and teamwork scenarios.'
      },
      {
        question: 'Which platforms are most effective for networking with cybersecurity professionals and finding opportunities?',
        options: [
          'Instagram and TikTok exclusively',
          'LinkedIn, Twitter/X, Reddit (r/netsec, r/cybersecurity), and industry forums/Discord communities',
          'Only company career pages and job boards',
          'Pinterest and Tumblr'
        ],
        answer: 1,
        explanation: 'LinkedIn for professional networking, Twitter/X for following security researchers, Reddit for community discussions, and Discord for CTF team collaboration.'
      }
    ]
  },

  t20: {
    title: 'Secure Top Product Company Role (12+ LPA)',
    questions: [
      {
        question: 'What is typically required to land a senior cybersecurity role at a top product company?',
        options: [
          'A university degree and no practical experience',
          'Strong technical skills, hands-on experience, relevant certifications, and a public portfolio',
          'Only industry certifications without practical skills',
          'Only networking connections inside the company'
        ],
        answer: 1,
        explanation: 'Top product companies (Google, Microsoft, Flipkart, etc.) look for demonstrated expertise through projects, certifications, and practical problem-solving ability.'
      },
      {
        question: 'In the context of the Indian job market, what does "12+ LPA" mean?',
        options: ['12 Lakh Per Annum (annual salary of ₹12,00,000+)', '12 months probation period', '12 leave days per year', '12 years of work experience required'],
        answer: 0,
        explanation: 'LPA = Lakh Per Annum. 12+ LPA means an annual package of ₹12,00,000 or more — a strong target for experienced cybersecurity professionals in India.'
      },
      {
        question: 'What interview rounds are common at top product companies for security engineering roles?',
        options: [
          'Only an HR screening interview',
          'Technical screening, DSA/coding round, security domain questions, system design, and HR/culture fit',
          'Only a written aptitude test',
          'Only a group discussion and presentation'
        ],
        answer: 1,
        explanation: 'Product companies often combine DSA (data structures), security domain expertise (threat modeling, secure coding), system design, and behavioral rounds.'
      },
      {
        question: 'What is a bug bounty program, and how does it boost career prospects?',
        options: [
          'A competitive multiplayer security game with no career value',
          'A program where companies pay researchers for ethically finding and reporting vulnerabilities — demonstrating real-world offensive skills',
          'A mandatory certification path for penetration testers',
          'A HR program offering performance bonuses to security employees'
        ],
        answer: 1,
        explanation: 'Bug bounty experience (HackerOne, Bugcrowd) proves real-world vulnerability discovery — CVEs and Hall of Fame mentions are powerful resume differentiators.'
      },
      {
        question: 'What is the most important differentiator for cybersecurity candidates at top product companies?',
        options: [
          'University/college brand name and ranking',
          'Demonstrable hands-on experience, public contributions (open source, CVEs, writeups), and deep specialization',
          'Age and years since graduation',
          'Geographic proximity to the company office'
        ],
        answer: 1,
        explanation: 'Skills trump credentials at top companies. A GitHub full of security tools, a blog of CTF writeups, and real vulnerability discoveries speak louder than a degree.'
      }
    ]
  }

};
