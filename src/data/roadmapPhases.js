// Roadmap phase definitions shared by the Roadmap page and the Test Examiner.
export const initialRoadmapPhases = [
  {
    id: 1,
    phase: 'Phase 1: Foundations & Networking (Months 1-3)',
    description:
      'Master computer networking, operating systems, and basic security principles.',
    targetDate: 'Oct 2026',
    topics: [
      { id: 't1', name: 'TCP/IP Model, DNS, DHCP, Subnetting', completed: false },
      { id: 't2', name: 'Linux Command Line & File Permissions (Bash)', completed: false },
      { id: 't3', name: 'Windows Administration & Active Directory Basics', completed: false },
      { id: 't4', name: 'Introduction to Information Security Principles (CIA Triad)', completed: false }
    ]
  },
  {
    id: 2,
    phase: 'Phase 2: Core Security & Defensive Tools (Months 4-6)',
    description:
      'Learn system hardening, monitoring, and defensive security operations.',
    targetDate: 'Jan 2027',
    topics: [
      { id: 't5', name: 'Firewalls, IDS/IPS, VPNs, and Network Security Monitoring', completed: false },
      { id: 't6', name: 'SIEM Fundamentals (Splunk / ELK Stack)', completed: false },
      { id: 't7', name: 'Endpoint Security & Antivirus/EDR solutions', completed: false },
      { id: 't8', name: 'Basic Cryptography (Hashing, Symmetric/Asymmetric Encryption)', completed: false }
    ]
  },
  {
    id: 3,
    phase: 'Phase 3: Offensive Security & Penetration Testing (Months 7-12)',
    description:
      'Learn ethical hacking, vulnerability assessment, and exploitation techniques.',
    targetDate: 'Jun 2027',
    topics: [
      { id: 't9', name: 'Reconnaissance & OSINT (Nmap, Shodan, Maltego)', completed: false },
      { id: 't10', name: 'Web Application Vulnerabilities (OWASP Top 10, Burp Suite)', completed: false },
      { id: 't11', name: 'Network Penetration Testing & Metasploit Framework', completed: false },
      { id: 't12', name: 'Privilege Escalation (Linux & Windows)', completed: false }
    ]
  },
  {
    id: 4,
    phase: 'Phase 4: Certifications & Specializations (Years 2-3)',
    description:
      'Earn industry-recognized certifications and choose a specialization.',
    targetDate: 'Dec 2028',
    topics: [
      { id: 't13', name: 'CompTIA Security+ / CEH Certification', completed: false },
      { id: 't14', name: 'Offensive Security Certified Professional (OSCP)', completed: false },
      { id: 't15', name: 'Cloud Security (AWS/Azure Security Fundamentals)', completed: false },
      { id: 't16', name: 'Incident Response & Digital Forensics (DFIR)', completed: false }
    ]
  },
  {
    id: 5,
    phase: 'Phase 5: Career Launch & Top Product Companies (Target: 2030)',
    description:
      'Build portfolio, contribute to open source, and land 12+ LPA role.',
    targetDate: '2030',
    topics: [
      { id: 't17', name: 'Build Cybersecurity Portfolio & Write Technical Writeups', completed: false },
      { id: 't18', name: 'Participate in CTF Competitions (HackTheBox / TryHackMe)', completed: false },
      { id: 't19', name: 'Mock Interviews & Resume Optimization', completed: false },
      { id: 't20', name: 'Secure Top Product Company Role (12+ LPA)', completed: false }
    ]
  }
];
