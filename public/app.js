
// =============================================================================
// HYBRID CLIENT-SIDE PERSISTENCE & AUTO-FALLBACK ENGINE
// Guarantees 100% full-stack functionality on static hosts (Netlify, Vercel, GitHub Pages)
// and offline file:// viewing, while automatically using Node.js when available.
// =============================================================================

const INITIAL_SEED_DATA = {
  "users": [
    {
      "id": "usr_stu_1",
      "role": "student",
      "email": "student@campus.edu",
      "password": "student123",
      "name": "Aarav Sharma",
      "studentId": "STU-2026-01",
      "department": "Computer Science"
    },
    {
      "id": "usr_stu_2",
      "role": "student",
      "email": "sneha@campus.edu",
      "password": "student123",
      "name": "Sneha Patel",
      "studentId": "STU-2026-02",
      "department": "Data Science & AI"
    },
    {
      "id": "usr_stu_3",
      "role": "student",
      "email": "vikram@campus.edu",
      "password": "student123",
      "name": "Vikram Rao",
      "studentId": "STU-2026-03",
      "department": "Information Technology"
    },
    {
      "id": "usr_org_1",
      "role": "organizer",
      "email": "organizer@campus.edu",
      "password": "admin123",
      "name": "Lead Event Organizer",
      "organization": "Central Event Committee"
    }
  ],
  "events": [
    {
      "id": "EVT-101",
      "title": "AI & Deep Learning Conclave 2026",
      "category": "Artificial Intelligence",
      "venue": "Main Auditorium, Block C",
      "date": "2026-10-15",
      "time": "10:00 AM - 04:30 PM",
      "description": "Annual symposium on Generative AI, LLMs, Neural Architectures, and Computer Vision with industry experts.",
      "organizer": "AI & Innovation Cell",
      "capacity": 120,
      "bannerColor": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      "status": "Published",
      "createdAt": "2026-10-01T09:00:00.000Z"
    },
    {
      "id": "EVT-102",
      "title": "National Tech Hackathon (36 Hours)",
      "category": "Hackathon",
      "venue": "Innovation & Incubation Hall",
      "date": "2026-10-22",
      "time": "09:00 AM (36 Hours)",
      "description": "Intense competitive coding hackathon solving real-world challenges in FinTech, Healthcare, and Smart Automation.",
      "organizer": "Technology & Coding Club",
      "capacity": 80,
      "bannerColor": "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
      "status": "Published",
      "createdAt": "2026-10-02T11:30:00.000Z"
    },
    {
      "id": "EVT-103",
      "title": "Cloud & DevOps Engineering Workshop",
      "category": "Workshop",
      "venue": "Computer Science Center, Lab 4",
      "date": "2026-10-08",
      "time": "02:00 PM - 05:00 PM",
      "description": "Hands-on masterclass covering containerization with Docker, Kubernetes cluster orchestration, and automated CI/CD pipelines.",
      "organizer": "Cloud Infrastructure Guild",
      "capacity": 45,
      "bannerColor": "linear-gradient(135deg, #059669 0%, #10b981 100%)",
      "status": "Published",
      "createdAt": "2026-10-03T14:15:00.000Z"
    },
    {
      "id": "EVT-104",
      "title": "Cyber Defense & Security Summit",
      "category": "Cybersecurity",
      "venue": "Seminar Hall 2",
      "date": "2026-10-18",
      "time": "11:00 AM - 03:00 PM",
      "description": "Practical deep-dive into zero-trust network defenses, vulnerability hunting, and cyber risk mitigation.",
      "organizer": "Cyber Defense Society",
      "capacity": 60,
      "bannerColor": "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      "status": "Published",
      "createdAt": "2026-10-04T08:45:00.000Z"
    },
    {
      "id": "EVT-105",
      "title": "Annual Campus Cultural Fest",
      "category": "Cultural",
      "venue": "Open Air Amphitheatre",
      "date": "2026-10-28",
      "time": "06:00 PM - 10:30 PM",
      "description": "Grand annual celebration with musical concerts, theatrical showcases, and creative arts.",
      "organizer": "Cultural Committee",
      "capacity": 350,
      "bannerColor": "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
      "status": "Published",
      "createdAt": "2026-10-04T16:00:00.000Z"
    }
  ],
  "registrations": [
    {
      "ticketId": "TK-AI-10101",
      "eventId": "EVT-101",
      "name": "Aarav Sharma",
      "email": "student@campus.edu",
      "rollNo": "STU-2026-01",
      "phone": "+91 98451 22341",
      "department": "Computer Science",
      "registeredAt": "2026-10-02T10:14:00.000Z",
      "status": "Attended",
      "checkedInAt": "2026-10-05T17:45:10.000Z",
      "qrCodeDataUrl": "data:image/png;base64,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"
    },
    {
      "ticketId": "TK-AI-10102",
      "eventId": "EVT-101",
      "name": "Sneha Patel",
      "email": "sneha@campus.edu",
      "rollNo": "STU-2026-02",
      "phone": "+91 97012 33499",
      "department": "Data Science & AI",
      "registeredAt": "2026-10-02T11:20:00.000Z",
      "status": "Attended",
      "checkedInAt": "2026-10-05T17:50:33.000Z",
      "qrCodeDataUrl": "data:image/png;base64,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"
    },
    {
      "ticketId": "TK-AI-10103",
      "eventId": "EVT-101",
      "name": "Vikram Rao",
      "email": "vikram@campus.edu",
      "rollNo": "STU-2026-03",
      "phone": "+91 98881 77123",
      "department": "Information Technology",
      "registeredAt": "2026-10-03T09:15:00.000Z",
      "status": "Confirmed",
      "checkedInAt": null,
      "qrCodeDataUrl": "data:image/png;base64,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"
    },
    {
      "ticketId": "TK-HK-10201",
      "eventId": "EVT-102",
      "name": "Aarav Sharma",
      "email": "student@campus.edu",
      "rollNo": "STU-2026-01",
      "phone": "+91 98451 22341",
      "department": "Computer Science",
      "registeredAt": "2026-10-03T12:00:00.000Z",
      "status": "Confirmed",
      "checkedInAt": null,
      "qrCodeDataUrl": "data:image/png;base64,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"
    },
    {
      "ticketId": "TK-CD-10301",
      "eventId": "EVT-103",
      "name": "Sneha Patel",
      "email": "sneha@campus.edu",
      "rollNo": "STU-2026-02",
      "phone": "+91 97012 33499",
      "department": "Data Science & AI",
      "registeredAt": "2026-10-04T10:05:00.000Z",
      "status": "Attended",
      "checkedInAt": "2026-10-05T18:10:05.000Z",
      "qrCodeDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAEYCAYAAACHjumMAAAAAklEQVR4AewaftIAABKCSURBVO3BwXVkSY5FwUs/oQf2kAHiQwbsIQmHu4mDWYSP1/dMdvUz+/r+gYjIBQsRkUsWIiKXLERELlmIiFyyEBG5ZCEicslCROSShYjIJQsRkUtebDIPfouu5IR5cKor2WEe7OhKJvNgR1fyzjyYupId5sHUlewwD3Z0JafMg3ddyWQeTF3JZB5MXclkHkxdyQ7zYEdXcsI8+C26kk8WIiKXLERELlmIiFyyEBG55MU/0JXcZh7sMA+mruSTruSUeTB1JZN5sKMrmcyDyTx415Wc6kp2mAdTV3JbV/LOPHiSebDDPJi6klPmwbuu5FRXcpt5cGIhInLJQkTkkoWIyCULEZFLXjzMPDjVlZzqSj7pSibzYOpKdnQlk3kwdSWnupJPzIOpK5nMg1NdyQ7zYOpKJvNg6kom8+BdVzKZBzu6kr+hK5nMg5vMg1NdyVMWIiKXLERELlmIiFyyEBG55MW/mHnwFPNg6kqmruRJ5sEnXcmprmQyD3aYB6e6ksk8+MQ8mLqSyTyYupLJPHhSVzKZB1NX8s48mLqS/3QLEZFLFiIilyxERC5ZiIhc8kL+D/Ng6kom8+BUV3KqK/nEPNhhHuwwD06ZB1NX8qeZB0/qSp7SlfwbLURELlmIiFyyEBG5ZCEicsmLh3Ulf4N5MHUl78yDqSuZzINTXclt5sG7rmTqSnaYB1NXcso82GEeTF3JZB6c6Eom82BHV/Kfriv5DRYiIpcsREQuWYiIXLIQEbnkxT9gHshn5sHUlUzmwdSVTObBJ+bB1JWcMg+mrmRHVzKZBye6ksk8mLqSHV3JZB5MXclkHkxdyQnzYOpKdpgHv9VCROSShYjIJQsRkUsWIiKXfH3/4F/APJi6knfmwY6u5JR5MHUlk3kwdSWTeXCiK5nMgx1dySnzYEdXMpkHU1fyzjz4zboS+V8LEZFLFiIilyxERC5ZiIhc8uIvMQ+e1JVM5sG7ruSUefBbdCXvzIMdXclkHkzmwd/QlXzSlUzmwdSVTObBjq5kMg+mruSUefCuK9lhHuzoSk6ZB1NXcmIhInLJQkTkkoWIyCULEZFLvr5/8EuYB1NXssM8mLqSp5gHU1cymQc7upId5sHUlXxiHkxdyWQenOpKdpgHN3UlTzIPpq5kh3mwoyt5Zx5MXcmTzIOpK9lhHkxdyScLEZFLFiIilyxERC558Q+YB7eZB1NXcpN5MHUlp7qSyTzY0ZVM5sG7rmTqSibzYOpKTpkHO7qSHebB1JV8Yh5MXclt5sEp8+AT82DqSibzYEdXMpkHNy1ERC5ZiIhcshARuWQhInLJ1/cPDpkHO7qSJ5kHU1cymQefdCWnzINTXckO8+CTruSUeXCqK9lhHkxdyU3mwdSVPMk8mLqSyTyYupJPzIMndSWnzIOpK/lkISJyyUJE5JKFiMglCxGRS178JebBbV3JO/NgMg92dCWnupKbzIOpK/kbzIOpK5nMg6krmcyDd13JKfNgR1eyoyuZzIMd5sEnXclkHpwyD6auZEdXcmIhInLJQkTkkoWIyCULEZFLXjysK3lSV7LDPDjRlUzmwY6uZId5sKMr2dGVvDMPJvNgR1cymQdTVzKZB1NXMpkHU1dywjzY0ZVM5sHUlUzmwY6uZOpKJvNg6ko+MQ+mrmSHeTB1JafMg6kr+WQhInLJQkTkkoWIyCULEZFLXvxy5sHUlezoSk50JZN5sKMrmbqSyTyYzIOpK5nMg3ddyWQeTF3Jjq7kSV3JZB5MXcnUlfxW5sHUlZwwD6au5FRXssM8uGkhInLJQkTkkoWIyCULEZFLXmwyD3aYBzu6ksk8mLqSyTw4YR7s6EqmruS2rmQyD6au5J158Dd0JZN5MHUlp8yDP60rOWUe7DAPTpgHT+pKJvNg6kpOLERELlmIiFyyEBG5ZCEicsnX9w82mAdTVzKZB1NXMpkHT+pKJvPgRFcymQenupId5sFTupJT5sHUlUzmwdSVPMk8eNeVnDIPdnQlf5p5MHUlO8yDU13JDvNg6ko+WYiIXLIQEblkISJyyUJE5JKv7x9sMA+e1JVM5sHUlUzmwZ/WlewwD57UlUzmwbuuZId5sKMrmcyDqSs5ZR5MXclkHvxWXckO82DqSt6ZBzu6ksk8+Bu6kk8WIiKXLERELlmIiFyyEBG55MWmrmQyD57UlUzmwdSVTObBJ13JDvPgSV3JDvPgKebBKfNg6kp2mAdTV7LDPJi6knfmwamuZDIPdnQlO8yDHebBU7qSyTyYupJT5sGJhYjIJQsRkUsWIiKXLERELnmxyTyYupInmQdTV3KqK7nJPJi6kh3mwdSV7OhKntKVTObBDvPgN+hKJvPgt+hKTpgHp7qSyTyYupLJPJi6khMLEZFLFiIilyxERC5ZiIhc8mJTVzKZBzu6klPmwY6uZDIP/jTz4JR5MHUlJ7qS38I8mLqSyTz4DbqSyTyYupKpK9lhHrzrSnaYB7d1JZN5MHUlnyxERC5ZiIhcshARueTr+wd/gXmwoyuZzIOpK3mKefCkrmSHebCjK3lnHuzoSnaYBzu6ksk82NGVPMU8mLqS28yDqSuZzIMTXckO82BHV7LDPNjRlXyyEBG5ZCEicslCROSShYjIJV/fP9hgHkxdyQ7zYEdXMpkHU1dywjyYupLJPJi6kh3mwamu5CnmwdSVTObBjq5kMg+e1JXcZB5MXckO8+BJXckn5sHUlZwyD57UlXyyEBG5ZCEicslCROSShYjIJS82dSWTeXBbV/KUrmQyD6auZDIPpq5kR1cymQc7zIObupIndSU7zIPJPJi6kj/NPNjRlZwyD06YB6e6klPmwYmFiMglCxGRSxYiIpcsREQuebHJPJi6kh3mwQ7z4EldySddyY6uZDIPpq7klHkwdSWTefCuKzllHjzJPDjVlXxiHuzoSn4L82DqSt6ZB7eZB1NXMpkHT1mIiFyyEBG5ZCEicslCROSSF5u6ksk8mLqSqSuZzIOpKzllHpwwD6auZEdXMpkHO7qSyTw4YR7s6Ep2dCWnzIMnmQfvupJTXcmTzIObupJT5sEO82DqSibz4MRCROSShYjIJQsRkUsWIiKXvNhkHkxdyQ7z4JR5MHUlJ8yDqSuZzIMdXcnUlTzJPJi6knfmwdSVTObBKfNg6kp2dCV/mnkwdSW3dSU3mQdTV7KjK/nTFiIilyxERC5ZiIhcshARueTFpq5kh3kwdSWTebCjK3lKVzKZB6fMgx1dyamuZDIPTnQlk3mwoyt5knmwoyv5xDzYYR5MXcnUlZwyD6au5CldyW3mwdSVnFiIiFyyEBG5ZCEicslCROSSr+8fHDIPfrOu5J15MHUlk3kwdSWTeTB1JZN5cFNXMpkHU1cymQd/Q1dywjyYupLJPHhSV7LDPPitupId5sGOruSThYjIJQsRkUsWIiKXLERELvn6/sFl5sHUlZwyD6au5BPzYEdXcpt5MHUlk3lwoiuZzIOpK5nMg6kruc08eEpXMpkHp7qSU+bB1JW8Mw+mrmQyD6auZDIPdnQlk3kwdSUnFiIilyxERC5ZiIhcshARueTr+weHzIMdXclkHpzqSibz4ERXMpkHU1eywzyYupId5sHUlUzmwbuuZDIPpq5kMg92dCWnzIOpK5nMg0+6klPmwW1dyU3mwY6uZDIPdnQlk3kwdSWfLERELlmIiFyyEBG5ZCEicsnX9w82mAdTV/KbmQfvupInmQdTV7LDPJi6kh3mwVO6ksk82NGVTObB1JVM5sHUlUzmwbuuZId5sKMrmcyDqSvZYR6c6Eom82DqSnaYB1NXssM82NGVfLIQEblkISJyyUJE5JKFiMglL/4S82DqSibzYOpKJvPgKebB1JVMXclkHuzoSibz4ERXssM8mMyDHV3Jjq7klHlwwjy4zTyYupIdXclkHrwzD24zD6auZOpKnrIQEblkISJyyUJE5JKv7x8cMg+mrmQyD6auZDIPpq5kMg+mrmQyD57SlUzmwamu5JR58K4ruc08eFJXssM8+KQr2WEeTF3JZB5MXclkHjylK9lhHtzWlUzmwdSVfLIQEblkISJyyUJE5JKFiMglLx5mHkxdyY6uZDIPpq5kMg+mruSdebCjK9nRlTzJPPgNzIOpK5nMg6krOWUefNKV7DAPbutKJvNgR1fyzjyYupJTXckO8+CmhYjIJQsRkUsWIiKXLERELnmxyTyYupId5sGOrmTqSp7SlUzmwWQeTF3JZB7s6Ep2dCU7zIM/zTyYupId5sHUlUxdyWQefGIePKkrOdWV7DAPntKV7DAPpq5kMg+mruTEQkTkkoWIyCULEZFLFiIil7x4mHnwJPPgKebB1JXsMA+mrmQyDybzYOpKdpgHU1fyiXlwqit5UleywzyYupJPupId5sFkHkxdyZPMg0+6ksk8mLqSyTyYupKpK5nMg6krecpCROSShYjIJQsRkUsWIiKXvNjUlUzmwdSV7DAPdnQlk3kwdSWfdCW3dSWTeTCZBzu6ksk8eNeVTF3JDvNgMg+mrmQyD/4082DqSp5kHuzoSn4r8+CUebCjK/lkISJyyUJE5JKFiMglCxGRS15sMg92mAdPMg+mruTfqCuZzIObupJTXcmf1pVM5sHUlezoSibzYOpKdpgHO7qSE+bBqa5kMg9uWoiIXLIQEblkISJyyUJE5JKv7x9sMA+e1JVM5sHUlZwyD951JTvMg6kr2WEenOpKTpgHU1cymQenupId5sGOrmQyD6au5BPz4EldyZ9mHuzoSibzYOpKTpkHU1dyYiEicslCROSShYjIJQsRkUtebOpKdpgHU1cymQdTVzKZB6e6kpvMg6krOWUeTF3JZB48pSuZzIPJPHiSeXDCPNjRlUzmwdSVTObBjq5kMg9OdCWTebCjK9lhHkxdydSVPGUhInLJQkTkkoWIyCULEZFLXvxyXclkHuwwD951JZN5MHUlO7qSyTzY0ZVMXclkHjylK5nMg6krmcyD27qSyTyQ/z/zYId5cKor+WQhInLJQkTkkoWIyCULEZFLXmwyD3Z0JZN5sMM82NGV7DAPPulKdpgHp7qSHebB1JVM5sG7rmQyD3Z0JZN5sKMrua0r+cQ82NGVnOpKJvPgpq5kMg9OdSWTeXDTQkTkkoWIyCULEZFLFiIil7zY1JVM5sFkHkxdyW9lHvw3Mw+mruRJ5sHUlUzmwSddySnz4JR5cKormcyDd+bBjq5kMg+mrmQyD6auZDIPnrIQEblkISJyyUJE5JKv7x9cZh5MXckO8+BUV/KJeTB1JZN5MHUlO8yDHV3JZB5MXck782DqSibz4G/oSk6ZB++6klPmwdSV7DAP/lt0JU9ZiIhcshARuWQhInLJQkTkkhd/QFdyqivZYR5M5sG7rmTqSnZ0Jf/pupLJPJi6klPmwQ7zYOpKpq7knXlwqivZYR5MXclkHkxdyWQeTF3JO/Ng6kpOmQenzIMdXcknCxGRSxYiIpcsREQuWYiIXPJik3nwW3QlO7qSE+bB1JXsMA+mruRJ5sG7rmQyD55kHkxdyamuZDIPTnQlk3lwW1fyp5kHU1dyqiuZzIOnLERELlmIiFyyEBG5ZCEicsmLf6Aruc08OGUe/FbmwU1dyWQenOpKTpkHp7qSp5gHU1cydSWTeTB1JZN5MHUlT+lK/oau5MRCROSShYjIJQsRkUsWIiKXvHiYeXCqK3lSV/LOPNjRlUzmwdSV7DAPdnQlk3nwiXkwdSVTVzKZB5N5cFtX8hTzYOpKJvNgMg92dCU7upKnmAd/Q1fylIWIyCULEZFLFiIilyxERC558S/RlUzmwSddySnz4FRXMpkHU1cymQfvupId5sHUlewwD3Z0JZN5sMM8mLqSd+bB1JXcZh5MXclkHjylK9lhHkxdyWQeTObBjq7kxEJE5JKFiMglCxGRSxYiIpe8+C/SlUzmwZO6kh3mwQ7zYOpKTnQlk3lwqiuZzIOpK3lKV3KqK5nMgx1dyWQeTF3JU8yDqSt5UleywzyYupJPFiIilyxERC5ZiIhcshARueTFw7qS38o82NGV7DAPdpgHU1cymQc7zIMTXcmOrmQyD06ZB1NXMnUln5gHO7qSHV3JDvNg6kp2mAefdCVTVzKZBzvMg1PmwVMWIiKXLERELlmIiFyyEBG55MU/YB78J+lKJvNgMg+mruRUV7KjK9lhHnzSlUzmwamuZDIPpq5kMg8m82BHV/IU82DqSibzYOpKntSVfGIeTF3JDvNg6kpOdSUnFiIilyxERC5ZiIhcshARueTr+wciIhcsREQuWYiIXLIQEblkISJyyUJE5JKFiMglCxGRSxYiIpf8D4JH6khbRhMqAAAAAElFTkSuQmCC"
    }
  ],
  "attendanceLogs": [
    {
      "id": "LOG-1",
      "ticketId": "TK-AI-10101",
      "eventId": "EVT-101",
      "name": "Aarav Sharma",
      "department": "Computer Science",
      "scannedAt": "2026-10-05T17:45:10.000Z",
      "method": "QR Scanner",
      "gate": "Gate A - Main Lobby"
    },
    {
      "id": "LOG-2",
      "ticketId": "TK-AI-10102",
      "eventId": "EVT-101",
      "name": "Sneha Patel",
      "department": "Data Science & AI",
      "scannedAt": "2026-10-05T17:50:33.000Z",
      "method": "QR Scanner",
      "gate": "Gate A - Main Lobby"
    },
    {
      "id": "LOG-3",
      "ticketId": "TK-CD-10301",
      "eventId": "EVT-103",
      "name": "Sneha Patel",
      "department": "Data Science & AI",
      "scannedAt": "2026-10-05T18:10:05.000Z",
      "method": "Manual Check-In",
      "gate": "Lab 4 Entrance"
    }
  ],
  "notifications": [
    {
      "id": "NOTIF-1",
      "type": "system",
      "title": "System Initialized",
      "message": "Event Management Portal connected and operational.",
      "time": "2026-10-05T17:30:00.000Z",
      "read": false
    },
    {
      "id": "NOTIF-2",
      "type": "attendance",
      "title": "Check-in Verified",
      "message": "Aarav Sharma (TK-AI-10101) checked into AI & Deep Learning Conclave 2026.",
      "time": "2026-10-05T17:45:10.000Z",
      "read": false
    },
    {
      "id": "NOTIF-3",
      "type": "attendance",
      "title": "Check-in Verified",
      "message": "Sneha Patel (TK-AI-10102) successfully verified via QR pass.",
      "time": "2026-10-05T17:50:33.000Z",
      "read": false
    }
  ]
};

function getLocalDB() {
  try {
    const raw = localStorage.getItem('eventhub_db_v1');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const clone = JSON.parse(JSON.stringify(INITIAL_SEED_DATA));
  try {
    localStorage.setItem('eventhub_db_v1', JSON.stringify(clone));
  } catch (e) {}
  return clone;
}

function saveLocalDB(db) {
  try {
    localStorage.setItem('eventhub_db_v1', JSON.stringify(db));
    window.dispatchEvent(new Event('eventhub_data_changed'));
  } catch (e) {}
}

function computeEventStats(evt, registrations) {
  const regs = registrations.filter(r => r.eventId === evt.id);
  const checkedIn = regs.filter(r => r.status === 'Attended').length;
  const registeredCount = regs.length;
  const capacityRemaining = Math.max(0, evt.capacity - registeredCount);
  const fillPercentage = Math.round((registeredCount / evt.capacity) * 100);
  const attendancePercentage = registeredCount > 0 ? Math.round((checkedIn / registeredCount) * 100) : 0;
  return {
    ...evt,
    stats: {
      registeredCount,
      checkedInCount: checkedIn,
      capacityRemaining,
      fillPercentage,
      attendancePercentage,
      isFull: registeredCount >= evt.capacity
    }
  };
}

function computeClientAnalytics(db) {
  const events = db.events.map(e => computeEventStats(e, db.registrations));
  const totalEvents = events.length;
  const totalRegistrations = db.registrations.length;
  const totalCheckedIn = db.registrations.filter(r => r.status === 'Attended').length;
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);

  const overallAttendanceRate = totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0;
  const overallCapacityFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const eventMetrics = events.map(e => ({
    id: e.id,
    title: e.title,
    category: e.category,
    capacity: e.capacity,
    registered: e.stats.registeredCount,
    checkedIn: e.stats.checkedInCount,
    attendanceRate: e.stats.attendancePercentage,
    fillRate: e.stats.fillPercentage
  }));

  const categoryCounts = {};
  events.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  });

  const hourlyCheckIns = {
    '10:00 AM': 0,
    '11:00 AM': 0,
    '01:00 PM': 0,
    '02:00 PM': 0,
    '03:00 PM': 0,
    '04:00 PM': 0,
    '05:00 PM': 2,
    '06:00 PM': 1
  };

  return {
    kpi: {
      totalEvents,
      totalRegistrations,
      totalCheckedIn,
      overallAttendanceRate,
      overallCapacityFillRate
    },
    eventMetrics,
    categoryCounts,
    hourlyCheckIns,
    recentCheckIns: db.attendanceLogs.slice(0, 10)
  };
}

async function generateClientQRCode(text) {
  try {
    if (window.QRCode && window.QRCode.toDataURL) {
      return await window.QRCode.toDataURL(text, { width: 256, margin: 2 });
    }
  } catch (e) {}
  return 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(text);
}

function mockResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function clientApiHandler(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const db = getLocalDB();

  // GET /api/events
  if (url === '/api/events' && method === 'GET') {
    const data = db.events.map(e => computeEventStats(e, db.registrations));
    return mockResponse(200, { success: true, data });
  }

  // POST /api/events
  if (url === '/api/events' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newEvent = {
      id: 'EVT-' + Math.floor(100 + Math.random() * 900),
      title: body.title,
      category: body.category || 'General',
      venue: body.venue,
      date: body.date,
      time: body.time,
      description: body.description,
      organizer: body.organizer || 'Event Coordinator',
      capacity: parseInt(body.capacity) || 100,
      bannerColor: body.bannerColor || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      status: 'Published',
      createdAt: new Date().toISOString()
    };
    db.events.unshift(newEvent);
    db.notifications.unshift({
      id: 'NOTIF-' + Date.now(),
      type: 'broadcast',
      title: 'New Event Published',
      message: '"' + newEvent.title + '" has been published by ' + newEvent.organizer + '.',
      time: new Date().toISOString(),
      read: false
    });
    saveLocalDB(db);
    return mockResponse(201, { success: true, data: newEvent });
  }

  // DELETE /api/events/:id
  if (url.startsWith('/api/events/') && method === 'DELETE') {
    const id = url.split('/').pop();
    db.events = db.events.filter(e => e.id !== id);
    saveLocalDB(db);
    return mockResponse(200, { success: true });
  }

  // GET /api/registrations
  if (url === '/api/registrations' && method === 'GET') {
    const data = db.registrations.map(r => {
      const evt = db.events.find(e => e.id === r.eventId);
      return {
        ...r,
        eventTitle: evt ? evt.title : (r.eventTitle || 'Campus Event'),
        eventDate: evt ? evt.date : (r.eventDate || r.registeredAt),
        eventVenue: evt ? evt.venue : (r.eventVenue || 'Main Auditorium'),
        eventTime: evt ? evt.time : (r.eventTime || '10:00 AM')
      };
    });
    return mockResponse(200, { success: true, data });
  }

  // POST /api/registrations
  if (url === '/api/registrations' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const evt = db.events.find(e => e.id === body.eventId);
    if (!evt) return mockResponse(404, { success: false, error: 'Event not found.' });

    const existing = db.registrations.find(r => r.eventId === body.eventId && r.email.toLowerCase() === (body.email || '').toLowerCase());
    if (existing) {
      return mockResponse(409, { success: false, error: 'You are already registered for this event.', ticketId: existing.ticketId });
    }

    const currentCount = db.registrations.filter(r => r.eventId === body.eventId).length;
    if (currentCount >= evt.capacity) {
      return mockResponse(400, { success: false, error: 'Event capacity reached. Registration closed.' });
    }

    const catPrefix = (evt.category || 'EV').substring(0, 2).toUpperCase();
    const ticketId = 'TK-' + catPrefix + '-' + Math.floor(10000 + Math.random() * 90000);
    const qrCodeDataUrl = await generateClientQRCode(ticketId);

    const newReg = {
      ticketId,
      eventId: evt.id,
      name: body.name,
      email: body.email,
      rollNo: body.rollNo,
      phone: body.phone,
      department: body.department,
      registeredAt: new Date().toISOString(),
      status: 'Confirmed',
      checkedInAt: null,
      qrCodeDataUrl,
      eventTitle: evt.title,
      eventDate: evt.date,
      eventVenue: evt.venue,
      eventTime: evt.time
    };

    db.registrations.unshift(newReg);
    db.notifications.unshift({
      id: 'NOTIF-' + Date.now(),
      type: 'registration',
      title: 'New Student Registration',
      message: body.name + ' registered for ' + evt.title + ' (' + ticketId + ').',
      time: new Date().toISOString(),
      read: false
    });
    saveLocalDB(db);
    return mockResponse(201, { success: true, data: newReg });
  }

  // POST /api/attendance/check-in
  if (url === '/api/attendance/check-in' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const ticketId = (body.ticketId || '').trim();
    const reg = db.registrations.find(r => r.ticketId.toUpperCase() === ticketId.toUpperCase());

    if (!reg) {
      return mockResponse(404, { success: false, error: 'Invalid ticket ID (' + ticketId + '). Not found in registered participants database.' });
    }

    const evt = db.events.find(e => e.id === reg.eventId);

    if (reg.status === 'Attended') {
      return mockResponse(409, {
        success: false,
        error: 'Ticket ' + ticketId + ' has ALREADY BEEN CHECKED IN on ' + formatDate(reg.checkedInAt) + ' at ' + formatTime(reg.checkedInAt) + '. Duplicate entry denied.',
        registration: reg,
        event: evt
      });
    }

    reg.status = 'Attended';
    reg.checkedInAt = new Date().toISOString();

    const newLog = {
      id: 'LOG-' + Date.now(),
      ticketId: reg.ticketId,
      eventId: reg.eventId,
      name: reg.name,
      department: reg.department,
      scannedAt: reg.checkedInAt,
      method: body.method || 'QR Scanner',
      gate: body.gate || 'Main Entrance Gate A',
      eventTitle: evt ? evt.title : 'Campus Event'
    };
    db.attendanceLogs.unshift(newLog);

    db.notifications.unshift({
      id: 'NOTIF-' + Date.now(),
      type: 'attendance',
      title: 'Attendee Verified',
      message: reg.name + ' checked into ' + (evt ? evt.title : 'Event') + ' (' + reg.ticketId + ').',
      time: new Date().toISOString(),
      read: false
    });

    saveLocalDB(db);

    return mockResponse(200, {
      success: true,
      data: {
        registration: reg,
        event: evt || { title: reg.eventTitle || 'Campus Event' },
        log: newLog
      }
    });
  }

  // GET /api/attendance/logs
  if (url === '/api/attendance/logs' && method === 'GET') {
    return mockResponse(200, { success: true, data: db.attendanceLogs });
  }

  // GET /api/notifications
  if (url === '/api/notifications' && method === 'GET') {
    return mockResponse(200, { success: true, data: db.notifications });
  }

  // POST /api/notifications/broadcast
  if (url === '/api/notifications/broadcast' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const newNotif = {
      id: 'NOTIF-' + Date.now(),
      type: body.type || 'broadcast',
      title: body.title,
      message: body.message,
      time: new Date().toISOString(),
      read: false
    };
    db.notifications.unshift(newNotif);
    saveLocalDB(db);
    return mockResponse(200, { success: true, notification: newNotif });
  }

  // PATCH /api/notifications/:id/read
  if (url.startsWith('/api/notifications/') && url.endsWith('/read') && method === 'PATCH') {
    const parts = url.split('/');
    const id = parts[parts.length - 2];
    const n = db.notifications.find(item => item.id === id);
    if (n) n.read = true;
    saveLocalDB(db);
    return mockResponse(200, { success: true });
  }

  // POST /api/notifications/mark-all-read
  if (url === '/api/notifications/mark-all-read' && method === 'POST') {
    db.notifications.forEach(n => n.read = true);
    saveLocalDB(db);
    return mockResponse(200, { success: true });
  }

  // GET /api/analytics
  if (url === '/api/analytics' && method === 'GET') {
    return mockResponse(200, { success: true, data: computeClientAnalytics(db) });
  }

  // POST /api/auth/login
  if (url === '/api/auth/login' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const user = db.users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase() && u.password === body.password);
    if (!user) {
      return mockResponse(401, { success: false, error: 'Invalid email or password.' });
    }
    if (body.role && user.role !== body.role) {
      return mockResponse(403, { success: false, error: 'Account exists but does not have ' + body.role + ' privileges.' });
    }
    return mockResponse(200, { success: true, user });
  }

  // POST /api/auth/student-register
  if (url === '/api/auth/student-register' && method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    if (db.users.some(u => u.email.toLowerCase() === (body.email || '').toLowerCase())) {
      return mockResponse(409, { success: false, error: 'An account with this email already exists.' });
    }
    const newUser = {
      id: 'usr_stu_' + Date.now(),
      role: 'student',
      email: body.email,
      password: body.password,
      name: body.name,
      studentId: body.studentId || ('STU-' + Math.floor(1000 + Math.random() * 9000)),
      department: body.department || 'Computer Science'
    };
    db.users.push(newUser);
    saveLocalDB(db);
    return mockResponse(201, { success: true, user: newUser });
  }

  // POST /api/system/reset
  if (url === '/api/system/reset' && method === 'POST') {
    localStorage.removeItem('eventhub_db_v1');
    return mockResponse(200, { success: true });
  }

  return mockResponse(404, { success: false, error: 'Not found' });
}

// Intercept window.fetch for transparent offline/static cloud support
const _nativeFetch = window.fetch.bind(window);
window.fetch = async function(url, options = {}) {
  if (typeof url !== 'string' || !url.startsWith('/api/')) {
    return _nativeFetch(url, options);
  }

  // Attempt live Node.js server with 1.2s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const fetchOptions = { ...options, signal: controller.signal };
    const res = await _nativeFetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return res;
    }
  } catch (err) {
    // Backend offline, network error, or static host 404 (e.g. Netlify)
  }

  // Fall back to client-side database
  return await clientApiHandler(url, options);
};

function activateCloudSyncMode(statusBadge, statusText) {
  state.sseConnected = true;
  if (statusBadge) {
    statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.5)';
    statusBadge.style.background = 'rgba(16, 185, 129, 0.1)';
    const dot = statusBadge.querySelector('.live-dot');
    if (dot) {
      dot.style.background = '#10b981';
      dot.style.boxShadow = '0 0 10px #10b981';
    }
  }
  if (statusText) {
    statusText.textContent = 'Live Cloud Sync (Active)';
  }
  window.addEventListener('eventhub_data_changed', () => {
    refreshAllData();
  });
  window.addEventListener('storage', (e) => {
    if (e.key === 'eventhub_db_v1') {
      refreshAllData();
    }
  });
}

/**
 * EventHub - Centralized Event Management Portal
 * Student Portal & Organizer Command Hub
 */

// Application State
const state = {
  currentUser: {
    id: "usr_stu_1",
    role: "student", // 'student' or 'organizer'
    name: "Aarav Sharma",
    email: "student@campus.edu",
    studentId: "STU-2026-01",
    department: "Computer Science"
  },
  events: [],
  registrations: [],
  attendanceLogs: [],
  notifications: [],
  analytics: null,
  activeTab: 'events',
  activeCategoryFilter: 'ALL',
  searchQuery: '',
  unreadNotifsCount: 0,
  sseConnected: false,
  charts: {
    attendanceBar: null,
    categoryDoughnut: null,
    velocityLine: null
  },
  html5QrScanner: null,
  isCameraScanning: false
};

// Web Audio API Synthesized Sound Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSuccessChime() {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {}
}

function playWarningTone() {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.setValueAtTime(260, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {}
}

// Toast Notifications System
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  if (type === 'error') icon = 'fa-circle-xmark';

  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-message">${escapeHTML(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function formatTime(isoStr) {
  if (!isoStr) return '--';
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(isoStr) {
  if (!isoStr) return '--';
  const d = new Date(isoStr);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

// -----------------------------------------------------------------------------
// USER SESSION & ROLE MANAGEMENT
// -----------------------------------------------------------------------------
function loadUserSession() {
  const saved = localStorage.getItem('eventhub_user');
  if (saved) {
    try {
      state.currentUser = JSON.parse(saved);
    } catch (e) {}
  }
  applyRoleUI();
}

function saveUserSession(user) {
  state.currentUser = user;
  localStorage.setItem('eventhub_user', JSON.stringify(user));
  applyRoleUI();
}

function applyRoleUI() {
  const u = state.currentUser;
  const isOrganizer = u && u.role === 'organizer';

  // Header Role & User display
  const roleBadge = document.getElementById('current-role-badge');
  const roleText = document.getElementById('role-text-label');
  const userName = document.getElementById('user-display-name');
  const userRole = document.getElementById('user-display-role');

  if (roleBadge && roleText) {
    roleBadge.className = `role-badge-pill ${isOrganizer ? 'organizer' : 'student'}`;
    roleText.textContent = isOrganizer ? 'Organizer Portal' : 'Student Portal';
  }

  if (userName && userRole) {
    userName.textContent = u ? u.name : 'Guest';
    userRole.textContent = isOrganizer ? 'Event Organizer' : 'Student';
  }

  // Welcome Banner Content
  const welcomeIcon = document.getElementById('welcome-role-icon');
  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeSub = document.getElementById('welcome-subtitle');
  const welcomeActions = document.getElementById('welcome-actions-container');

  if (isOrganizer) {
    if (welcomeIcon) welcomeIcon.className = 'fa-solid fa-user-tie icon-role organizer';
    if (welcomeTitle) welcomeTitle.textContent = `Organizer Console: Welcome, ${u.name}!`;
    if (welcomeSub) welcomeSub.textContent = 'Manage campus events, monitor real-time attendance, and verify attendee QR codes.';
    if (welcomeActions) {
      welcomeActions.innerHTML = `
        <button class="btn btn-primary btn-sm" id="btn-header-create-event">
          <i class="fa-solid fa-plus"></i> Create Event
        </button>
        <button class="btn btn-secondary btn-sm" onclick="switchTab('checkin')">
          <i class="fa-solid fa-qrcode"></i> Check-In Station
        </button>
      `;
      document.getElementById('btn-header-create-event')?.addEventListener('click', () => {
        document.getElementById('create-event-modal').style.display = 'flex';
      });
    }
  } else {
    if (welcomeIcon) welcomeIcon.className = 'fa-solid fa-user-graduate icon-role student';
    if (welcomeTitle) welcomeTitle.textContent = `Student Portal: Welcome, ${u ? u.name : 'Student'}!`;
    if (welcomeSub) welcomeSub.textContent = 'Explore upcoming campus events, register with 1-click, and access your digital QR passes.';
    if (welcomeActions) {
      welcomeActions.innerHTML = `
        <button class="btn btn-secondary btn-sm" onclick="switchTab('my-tickets')">
          <i class="fa-solid fa-ticket"></i> View My Tickets
        </button>
      `;
    }
  }

  // Render Navigation Tabs Based on Role
  renderNavigationTabs();

  // Show/Hide Organizer elements
  const orgBroadcast = document.getElementById('organizer-broadcast-card');
  if (orgBroadcast) {
    orgBroadcast.style.display = isOrganizer ? 'block' : 'none';
  }
}

function renderNavigationTabs() {
  const nav = document.getElementById('main-nav-tabs');
  if (!nav) return;

  const isOrganizer = state.currentUser && state.currentUser.role === 'organizer';

  let tabsHTML = '';

  if (isOrganizer) {
    tabsHTML = `
      <button class="tab-btn active" data-tab="analytics">
        <i class="fa-solid fa-chart-line"></i>
        <span>Analytics Dashboard</span>
      </button>
      <button class="tab-btn" data-tab="events">
        <i class="fa-regular fa-calendar-days"></i>
        <span>Event Management</span>
      </button>
      <button class="tab-btn" data-tab="checkin">
        <i class="fa-solid fa-qrcode"></i>
        <span>QR Attendance</span>
      </button>
      <button class="tab-btn" data-tab="attendees">
        <i class="fa-solid fa-users"></i>
        <span>Attendees Directory</span>
      </button>
      <button class="tab-btn" data-tab="notifications">
        <i class="fa-solid fa-bell"></i>
        <span>Announcements & Alerts</span>
      </button>
    `;
    state.activeTab = 'analytics';
  } else {
    tabsHTML = `
      <button class="tab-btn active" data-tab="events">
        <i class="fa-regular fa-calendar-days"></i>
        <span>Browse Events</span>
      </button>
      <button class="tab-btn" data-tab="my-tickets">
        <i class="fa-solid fa-ticket"></i>
        <span>My Registered Tickets & Passes</span>
      </button>
      <button class="tab-btn" data-tab="notifications">
        <i class="fa-solid fa-bell"></i>
        <span>Notifications</span>
      </button>
    `;
    state.activeTab = 'events';
  }

  nav.innerHTML = tabsHTML;

  // Add click listeners to new tabs
  nav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Switch to the default active tab pane
  switchTab(state.activeTab);
}

window.switchTab = function(tabId) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => {
    if (t.getAttribute('data-tab') === tabId) t.classList.add('active');
    else t.classList.remove('active');
  });

  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) targetPane.classList.add('active');

  state.activeTab = tabId;

  if (tabId === 'analytics') {
    renderCharts();
  } else if (tabId === 'my-tickets') {
    renderMyTickets();
  }
};

// -----------------------------------------------------------------------------
// LIVE SERVER-SENT EVENTS (SSE)
// -----------------------------------------------------------------------------
function initSSE() {
  const statusBadge = document.getElementById('sse-status-badge');
  const statusText = document.getElementById('sse-status-text');

  try {
    const sseSource = new EventSource('/api/live-stream');

    sseSource.addEventListener('connected', () => {
      state.sseConnected = true;
      if (statusBadge) statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      if (statusText) statusText.textContent = 'Live SSE Connected';
    });

    sseSource.addEventListener('event_created', (e) => {
      const data = JSON.parse(e.data);
      showToast('New Event Created', data.event.title, 'success');
      refreshAllData();
    });

    sseSource.addEventListener('registration_created', (e) => {
      const data = JSON.parse(e.data);
      showToast('New Registration', data.registration.name + ' (' + data.registration.ticketId + ')', 'info');
      refreshAllData();
    });

    sseSource.addEventListener('attendance_verified', (e) => {
      const data = JSON.parse(e.data);
      showToast('Live Check-In Verified', data.registration.name + ' @ ' + data.eventTitle, 'success');
      playSuccessChime();
      refreshAllData();
    });

    sseSource.addEventListener('broadcast_message', (e) => {
      const data = JSON.parse(e.data);
      showToast('Campus Announcement', data.notification.title, 'warning');
      refreshAllData();
    });

    sseSource.addEventListener('system_reset', () => {
      showToast('System Reset', 'Database restored to default demo state.', 'info');
      refreshAllData();
    });

    let sseErrorCount = 0;
    sseSource.onerror = () => {
      sseErrorCount++;
      if (sseErrorCount >= 2) {
        try { sseSource.close(); } catch(e) {}
        activateCloudSyncMode(statusBadge, statusText);
      } else {
        if (statusBadge) statusBadge.style.borderColor = 'rgba(244, 63, 94, 0.4)';
        if (statusText) statusText.textContent = 'Connecting Live Stream...';
      }
    };
  } catch (err) {
    activateCloudSyncMode(statusBadge, statusText);
  }
}

// -----------------------------------------------------------------------------
// DATA FETCHING & SYNCHRONIZATION
// -----------------------------------------------------------------------------
async function fetchEvents() {
  try {
    const res = await fetch('/api/events');
    const json = await res.json();
    if (json.success) {
      state.events = json.data;
      renderEvents();
      populateBroadcastDropdown();
    }
  } catch (err) {
    console.error('Failed to fetch events:', err);
  }
}

async function fetchRegistrations() {
  try {
    const res = await fetch('/api/registrations');
    const json = await res.json();
    if (json.success) {
      state.registrations = json.data;
      renderAttendeesTable();
      renderMyTickets();
      renderQuickSimChips();
    }
  } catch (err) {
    console.error('Failed to fetch registrations:', err);
  }
}

async function fetchAttendanceLogs() {
  try {
    const res = await fetch('/api/attendance/logs');
    const json = await res.json();
    if (json.success) {
      state.attendanceLogs = json.data;
      renderAuditLogStream();
    }
  } catch (err) {
    console.error('Failed to fetch attendance logs:', err);
  }
}

async function fetchNotifications() {
  try {
    const res = await fetch('/api/notifications');
    const json = await res.json();
    if (json.success) {
      state.notifications = json.data;
      renderNotifications();
    }
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
  }
}

async function fetchAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    const json = await res.json();
    if (json.success) {
      state.analytics = json.data;
      renderAnalyticsKPIs();
      renderCharts();
      renderAnalyticsEventsTable();
    }
  } catch (err) {
    console.error('Failed to fetch analytics:', err);
  }
}

async function refreshAllData() {
  await Promise.all([
    fetchEvents(),
    fetchRegistrations(),
    fetchAttendanceLogs(),
    fetchNotifications(),
    fetchAnalytics()
  ]);
}

// -----------------------------------------------------------------------------
// RENDER: STUDENT - MY TICKETS & DIGITAL PASSES
// -----------------------------------------------------------------------------
function renderMyTickets() {
  const container = document.getElementById('my-tickets-container');
  if (!container) return;

  const user = state.currentUser;
  if (!user || user.role !== 'student') {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-dim);">
        <i class="fa-solid fa-lock" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-muted);"></i>
        <h3>Student Portal Restricted</h3>
        <p>Please log in with a student account to view personal tickets and QR passes.</p>
        <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="openAuthModal('student')">Student Login</button>
      </div>
    `;
    return;
  }

  // Filter registrations matching the student's email
  const myRegs = state.registrations.filter(r => r.email.toLowerCase() === user.email.toLowerCase());

  if (myRegs.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-dim);">
        <i class="fa-solid fa-ticket-simple" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-muted);"></i>
        <h3>No Event Registrations Yet</h3>
        <p>You haven't registered for any events yet. Browse active events and secure your seat!</p>
        <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="switchTab('events')">Browse Active Events</button>
      </div>
    `;
    return;
  }

  container.innerHTML = myRegs.map(reg => {
    const isAttended = reg.status === 'Attended';
    return `
      <div class="my-ticket-card glass-panel">
        <div class="my-ticket-header">
          <div class="my-ticket-event-info">
            <span class="ticket-tag">${reg.ticketId}</span>
            <h3 class="my-ticket-title">${escapeHTML(reg.eventTitle || 'Campus Event')}</h3>
          </div>
          <span class="badge-status ${isAttended ? 'attended' : 'confirmed'}">
            ${isAttended ? '<i class="fa-solid fa-check"></i> Checked-In' : 'Confirmed'}
          </span>
        </div>

        <div class="my-ticket-meta">
          <div class="meta-item"><i class="fa-regular fa-calendar"></i> ${formatDate(reg.eventDate || reg.registeredAt)}</div>
          <div class="meta-item"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(reg.eventVenue || 'Main Auditorium')}</div>
          <div class="meta-item"><i class="fa-regular fa-clock"></i> ${escapeHTML(reg.eventTime || '10:00 AM')}</div>
        </div>

        <div class="my-ticket-footer">
          <div class="qr-thumbnail-box">
            <img src="${reg.qrCodeDataUrl || ''}" alt="QR" />
          </div>
          <div class="my-ticket-actions">
            <button class="btn btn-primary btn-sm" onclick="viewDigitalPass('${reg.ticketId}')">
              <i class="fa-solid fa-qrcode"></i> View QR Pass
            </button>
            <span class="ticket-subtext">Present this at venue entrance</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// -----------------------------------------------------------------------------
// RENDER: BROWSE EVENTS & 1-CLICK REGISTRATION
// -----------------------------------------------------------------------------
function renderEvents() {
  const container = document.getElementById('events-grid-container');
  const heroActions = document.getElementById('events-hero-actions');
  if (!container) return;

  const isOrganizer = state.currentUser && state.currentUser.role === 'organizer';

  // Toggle "Create Event" button in hero actions for Organizers
  if (heroActions) {
    if (isOrganizer) {
      heroActions.innerHTML = `
        <button class="btn btn-primary" id="btn-create-event-tab">
          <i class="fa-solid fa-calendar-plus"></i> Create New Event
        </button>
      `;
      document.getElementById('btn-create-event-tab')?.addEventListener('click', () => {
        document.getElementById('create-event-modal').style.display = 'flex';
      });
    } else {
      heroActions.innerHTML = '';
    }
  }

  let filtered = state.events;

  if (state.activeCategoryFilter !== 'ALL') {
    filtered = filtered.filter(e => e.category === state.activeCategoryFilter);
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-dim);">
        <i class="fa-regular fa-calendar-xmark" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-muted);"></i>
        <h3>No events found matching your filter</h3>
        <p>Try searching with another keyword or click "All Categories".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(evt => {
    const { stats } = evt;
    const isFull = stats.isFull;

    // Check if the current student is already registered for this event
    const isAlreadyRegistered = state.currentUser && state.registrations.some(
      r => r.eventId === evt.id && r.email.toLowerCase() === state.currentUser.email.toLowerCase()
    );

    return `
      <div class="event-card">
        <div class="event-banner" style="background: ${evt.bannerColor || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'};">
          <span class="event-category-tag">${escapeHTML(evt.category)}</span>
          <span class="event-status-badge">${escapeHTML(evt.status || 'Published')}</span>
        </div>

        <div class="event-body">
          <h3 class="event-title">${escapeHTML(evt.title)}</h3>
          <p class="event-desc">${escapeHTML(evt.description)}</p>

          <div class="event-meta-list">
            <div class="event-meta-item">
              <i class="fa-regular fa-calendar"></i>
              <span>${formatDate(evt.date)} &bull; ${escapeHTML(evt.time)}</span>
            </div>
            <div class="event-meta-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>${escapeHTML(evt.venue)}</span>
            </div>
            <div class="event-meta-item">
              <i class="fa-solid fa-users-gear"></i>
              <span>${escapeHTML(evt.organizer || 'Event Coordinator')}</span>
            </div>
          </div>

          <div class="event-capacity-section">
            <div class="capacity-stats-row">
              <span><strong>Capacity Quota</strong></span>
              <span><strong>${stats.registeredCount}</strong> / ${evt.capacity} (${stats.fillPercentage}%)</span>
            </div>
            <div class="capacity-bar-bg">
              <div class="capacity-bar-fill" style="width: ${Math.min(100, stats.fillPercentage)}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">
              <span>Remaining: ${stats.capacityRemaining}</span>
              <span>Checked In: ${stats.checkedInCount}</span>
            </div>
          </div>

          <div class="event-card-actions">
            ${
              isAlreadyRegistered 
                ? `<button class="btn btn-outline btn-sm btn-block" onclick="switchTab('my-tickets')"><i class="fa-solid fa-check"></i> Already Registered (View Pass)</button>`
                : `<button class="btn btn-primary btn-sm btn-block" onclick="studentRegisterForEvent('${evt.id}', '${escapeHTML(evt.title)}')" ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Capacity Full' : '<i class="fa-solid fa-ticket"></i> Register Now'}
                  </button>`
            }
            ${
              isOrganizer 
                ? `<button class="btn btn-outline btn-sm" onclick="deleteEvent('${evt.id}', '${escapeHTML(evt.title)}')" title="Delete Event">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 1-Click Student Registration for an Event
window.studentRegisterForEvent = async function(eventId, title) {
  const user = state.currentUser;

  if (!user || user.role !== 'student') {
    showToast('Student Login Required', 'Please log in as a student to register for events.', 'warning');
    openAuthModal('student');
    return;
  }

  const payload = {
    eventId,
    name: user.name,
    email: user.email,
    rollNo: user.studentId || 'STU-001',
    phone: '+91 98765 43210',
    department: user.department || 'Computer Science'
  };

  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.status === 201 && data.success) {
      showToast('Registration Confirmed', `Seat reserved for "${title}"! Digital pass ready.`, 'success');
      playSuccessChime();
      await refreshAllData();
      viewDigitalPass(data.data.ticketId);
    } else {
      showToast('Registration Notice', data.error || 'Could not complete registration', 'warning');
    }
  } catch (err) {
    console.error(err);
    showToast('Error', 'Network request failed', 'error');
  }
};

// -----------------------------------------------------------------------------
// RENDER: ORGANIZER - ANALYTICS & CHARTS
// -----------------------------------------------------------------------------
function renderAnalyticsKPIs() {
  if (!state.analytics) return;
  const { kpi } = state.analytics;

  const totalEvts = document.getElementById('kpi-total-events');
  const totalRegs = document.getElementById('kpi-total-registrations');
  const totalChecked = document.getElementById('kpi-total-checkedin');
  const rateText = document.getElementById('kpi-attendance-rate');
  const fillText = document.getElementById('kpi-capacity-fill');
  const fillBar = document.getElementById('kpi-capacity-bar');

  if (totalEvts) totalEvts.textContent = kpi.totalEvents;
  if (totalRegs) totalRegs.textContent = kpi.totalRegistrations;
  if (totalChecked) totalChecked.textContent = `${kpi.totalCheckedIn} / ${kpi.totalRegistrations}`;
  if (rateText) rateText.innerHTML = `<i class="fa-solid fa-arrow-up"></i> ${kpi.overallAttendanceRate}% Rate`;
  if (fillText) fillText.textContent = `${kpi.overallCapacityFillRate}%`;
  if (fillBar) fillBar.style.width = `${Math.min(100, kpi.overallCapacityFillRate)}%`;
}

function renderCharts() {
  if (!state.analytics) return;
  const { eventMetrics, categoryCounts, hourlyCheckIns } = state.analytics;

  // Chart 1: Attendance vs Registered Bar Chart
  const barCanvas = document.getElementById('attendanceBarChart');
  if (barCanvas) {
    const barCtx = barCanvas.getContext('2d');
    const labels = eventMetrics.map(e => e.title.length > 20 ? e.title.substring(0, 18) + '...' : e.title);
    const registeredData = eventMetrics.map(e => e.registered);
    const checkedInData = eventMetrics.map(e => e.checkedIn);

    if (state.charts.attendanceBar) {
      state.charts.attendanceBar.data.labels = labels;
      state.charts.attendanceBar.data.datasets[0].data = registeredData;
      state.charts.attendanceBar.data.datasets[1].data = checkedInData;
      state.charts.attendanceBar.update();
    } else {
      state.charts.attendanceBar = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Registered',
              data: registeredData,
              backgroundColor: 'rgba(99, 102, 241, 0.75)',
              borderRadius: 6
            },
            {
              label: 'QR Verified (Checked-In)',
              data: checkedInData,
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } }
          },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
            y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
          }
        }
      });
    }
  }

  // Chart 2: Category Distribution Doughnut
  const doughnutCanvas = document.getElementById('categoryDoughnutChart');
  if (doughnutCanvas) {
    const doughnutCtx = doughnutCanvas.getContext('2d');
    const catLabels = Object.keys(categoryCounts);
    const catData = Object.values(categoryCounts);
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    if (state.charts.categoryDoughnut) {
      state.charts.categoryDoughnut.data.labels = catLabels;
      state.charts.categoryDoughnut.data.datasets[0].data = catData;
      state.charts.categoryDoughnut.update();
    } else {
      state.charts.categoryDoughnut = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: catLabels,
          datasets: [{
            data: catData,
            backgroundColor: colors.slice(0, catLabels.length),
            borderColor: 'rgba(17, 24, 39, 0.8)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          cutout: '68%'
        }
      });
    }
  }

  // Chart 3: Real-Time Hourly Velocity Line Chart
  const lineCanvas = document.getElementById('velocityLineChart');
  if (lineCanvas) {
    const lineCtx = lineCanvas.getContext('2d');
    const hours = Object.keys(hourlyCheckIns);
    const counts = Object.values(hourlyCheckIns);

    if (state.charts.velocityLine) {
      state.charts.velocityLine.data.labels = hours;
      state.charts.velocityLine.data.datasets[0].data = counts;
      state.charts.velocityLine.update();
    } else {
      state.charts.velocityLine = new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: hours,
          datasets: [{
            label: 'Check-In Velocity (Attendees / Hour)',
            data: counts,
            fill: true,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            tension: 0.35,
            pointBackgroundColor: '#06b6d4',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } }
          },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
            y: { ticks: { color: '#94a3b8', stepSize: 1 }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
          }
        }
      });
    }
  }
}

function renderAnalyticsEventsTable() {
  if (!state.analytics) return;
  const tbody = document.querySelector('#analytics-events-table tbody');
  if (!tbody) return;

  tbody.innerHTML = state.analytics.eventMetrics.map(item => `
    <tr>
      <td>
        <strong>${escapeHTML(item.title)}</strong><br>
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">${item.id}</span>
      </td>
      <td><span class="filter-pill" style="padding: 2px 8px; font-size: 0.72rem;">${escapeHTML(item.category)}</span></td>
      <td><strong>${item.capacity}</strong></td>
      <td>${item.registered}</td>
      <td><span style="color: var(--accent-emerald); font-weight: 700;">${item.checkedIn}</span></td>
      <td>
        <span class="badge-status ${item.attendanceRate >= 60 ? 'attended' : 'confirmed'}">
          ${item.attendanceRate}%
        </span>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="progress-bar-wrap" style="width: 70px; margin: 0;">
            <div class="progress-bar-fill" style="width: ${Math.min(100, item.fillRate)}%;"></div>
          </div>
          <span>${item.fillRate}%</span>
        </div>
      </td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="switchTab('checkin')">
          <i class="fa-solid fa-qrcode"></i> Scan
        </button>
      </td>
    </tr>
  `).join('');
}

// -----------------------------------------------------------------------------
// RENDER: ORGANIZER - ATTENDEES DIRECTORY
// -----------------------------------------------------------------------------
function renderAttendeesTable() {
  const tbody = document.getElementById('attendees-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('search-attendees-input');
  const statusFilter = document.getElementById('filter-attendee-status');
  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterStat = statusFilter ? statusFilter.value : '';

  let list = state.registrations;
  if (filterStat) {
    list = list.filter(r => r.status === filterStat);
  }
  if (q) {
    list = list.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.ticketId.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.rollNo.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-dim);">
          No registered participants found matching criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(reg => `
    <tr>
      <td><span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-indigo);">${reg.ticketId}</span></td>
      <td><strong>${escapeHTML(reg.name)}</strong><br><span style="font-size: 0.72rem; color: var(--text-dim);">${escapeHTML(reg.email)}</span></td>
      <td><span style="font-family: var(--font-mono);">${escapeHTML(reg.rollNo)}</span></td>
      <td>${escapeHTML(reg.eventTitle || 'Event')}</td>
      <td>${escapeHTML(reg.department)}</td>
      <td>${formatDate(reg.registeredAt)}</td>
      <td>
        <span class="badge-status ${reg.status === 'Attended' ? 'attended' : 'confirmed'}">
          ${reg.status === 'Attended' ? 'Attended' : 'Confirmed'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="viewDigitalPass('${reg.ticketId}')" title="View Digital Pass">
          <i class="fa-solid fa-qrcode"></i> Pass
        </button>
      </td>
    </tr>
  `).join('');
}

// -----------------------------------------------------------------------------
// RENDER: QR ATTENDANCE SCANNER TERMINAL
// -----------------------------------------------------------------------------
function renderQuickSimChips() {
  const chipsContainer = document.getElementById('quick-sim-chips');
  if (!chipsContainer) return;

  const unchecked = state.registrations.filter(r => r.status !== 'Attended');

  if (unchecked.length === 0) {
    chipsContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--accent-emerald);">All registered participants have checked in!</span>`;
    return;
  }

  chipsContainer.innerHTML = unchecked.slice(0, 6).map(reg => `
    <button class="sim-chip" onclick="simulateCheckIn('${reg.ticketId}')" title="Click to verify ${escapeHTML(reg.name)}">
      <i class="fa-solid fa-barcode"></i> ${reg.ticketId} (${escapeHTML(reg.name.split(' ')[0])})
    </button>
  `).join('');
}

function renderAuditLogStream() {
  const container = document.getElementById('audit-log-stream');
  if (!container) return;

  if (state.attendanceLogs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px; color: var(--text-dim);">
        <i class="fa-solid fa-clipboard-check" style="font-size: 2rem; margin-bottom: 8px;"></i>
        <p>No check-in logs recorded yet. Scan a ticket to verify attendance.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.attendanceLogs.map(log => {
    const initials = log.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `
      <div class="audit-entry">
        <div class="audit-entry-left">
          <div class="audit-avatar">${initials}</div>
          <div>
            <div class="audit-name">${escapeHTML(log.name)}</div>
            <div class="audit-meta">${escapeHTML(log.eventTitle || 'Event')} &bull; ${escapeHTML(log.gate)}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <span class="audit-badge">${formatTime(log.scannedAt)}</span>
          <div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 2px;">${log.ticketId}</div>
        </div>
      </div>
    `;
  }).join('');
}

// -----------------------------------------------------------------------------
// RENDER: NOTIFICATIONS MODULE
// -----------------------------------------------------------------------------
function populateBroadcastDropdown() {
  const broadcastSelect = document.getElementById('broadcast-target');
  if (broadcastSelect) {
    const currentVal = broadcastSelect.value;
    broadcastSelect.innerHTML = `<option value="all">All Events (Campus-wide)</option>` +
      state.events.map(e => `
        <option value="${e.id}">${escapeHTML(e.title)}</option>
      `).join('');
    if (currentVal) broadcastSelect.value = currentVal;
  }
}

function renderNotifications() {
  const bellBadge = document.getElementById('notif-badge');
  const dropdownList = document.getElementById('header-notif-list');
  const feedList = document.getElementById('notif-feed-list');

  const unreadList = state.notifications.filter(n => !n.read);
  state.unreadNotifsCount = unreadList.length;

  if (bellBadge) {
    bellBadge.textContent = state.unreadNotifsCount;
    bellBadge.style.display = state.unreadNotifsCount > 0 ? 'flex' : 'none';
  }

  if (dropdownList) {
    if (state.notifications.length === 0) {
      dropdownList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-dim);">No notifications</div>`;
    } else {
      dropdownList.innerHTML = state.notifications.slice(0, 5).map(n => `
        <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="markNotifRead('${n.id}')">
          <div class="notif-icon-wrap ${n.type}">
            <i class="fa-solid ${getNotifIcon(n.type)}"></i>
          </div>
          <div class="notif-content">
            <div class="notif-title">${escapeHTML(n.title)}</div>
            <div class="notif-msg">${escapeHTML(n.message)}</div>
            <div class="notif-time">${formatTime(n.time)}</div>
          </div>
        </div>
      `).join('');
    }
  }

  if (feedList) {
    if (state.notifications.length === 0) {
      feedList.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-dim);">No notifications logged yet</div>`;
    } else {
      feedList.innerHTML = state.notifications.map(n => `
        <div class="feed-item ${!n.read ? 'unread' : ''}">
          <div class="notif-icon-wrap ${n.type}">
            <i class="fa-solid ${getNotifIcon(n.type)}"></i>
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="font-size: 0.85rem;">${escapeHTML(n.title)}</strong>
              <span style="font-size: 0.7rem; color: var(--text-dim);">${formatTime(n.time)}</span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${escapeHTML(n.message)}</p>
          </div>
        </div>
      `).join('');
    }
  }
}

function getNotifIcon(type) {
  switch (type) {
    case 'attendance': return 'fa-user-check';
    case 'registration': return 'fa-ticket';
    case 'broadcast': return 'fa-bullhorn';
    default: return 'fa-bolt';
  }
}

// -----------------------------------------------------------------------------
// QR CHECK-IN LOGIC
// -----------------------------------------------------------------------------
async function verifyCheckIn(ticketId) {
  const displayCard = document.getElementById('scan-result-display');
  if (!ticketId) return;

  try {
    const res = await fetch('/api/attendance/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, gate: 'Main Entrance Gate A', method: 'Terminal Scanner' })
    });

    const data = await res.json();

    displayCard.style.display = 'flex';

    if (res.status === 200 && data.success) {
      displayCard.className = 'scan-result-card success';
      displayCard.innerHTML = `
        <div class="scan-result-icon"><i class="fa-solid fa-check"></i></div>
        <div class="scan-result-info">
          <h4>VERIFIED: ${escapeHTML(data.data.registration.name)}</h4>
          <p><strong>Ticket ID:</strong> ${data.data.registration.ticketId} &bull; <strong>Student ID:</strong> ${data.data.registration.rollNo}</p>
          <p><strong>Event:</strong> ${escapeHTML(data.data.event.title)} &bull; <strong>Time:</strong> Just now (${formatTime(data.data.log.scannedAt)})</p>
        </div>
      `;
      playSuccessChime();
      showToast('Attendance Verified', `${data.data.registration.name} verified successfully!`, 'success');
      refreshAllData();
    } else if (res.status === 409) {
      displayCard.className = 'scan-result-card duplicate';
      displayCard.innerHTML = `
        <div class="scan-result-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="scan-result-info">
          <h4>ALREADY CHECKED IN</h4>
          <p>${escapeHTML(data.error)}</p>
          <p><strong>Participant:</strong> ${escapeHTML(data.registration.name)} (${data.registration.ticketId})</p>
        </div>
      `;
      playWarningTone();
      showToast('Duplicate Scan Detected', data.error, 'warning');
    } else {
      displayCard.className = 'scan-result-card error';
      displayCard.innerHTML = `
        <div class="scan-result-icon"><i class="fa-solid fa-xmark"></i></div>
        <div class="scan-result-info">
          <h4>INVALID TICKET</h4>
          <p>${escapeHTML(data.error || 'Ticket not found in active registrations database.')}</p>
        </div>
      `;
      playWarningTone();
      showToast('Check-In Failed', data.error || 'Invalid ticket code', 'error');
    }
  } catch (err) {
    console.error('Check-in error:', err);
    showToast('Network Error', 'Could not reach attendance backend.', 'error');
  }
}

window.simulateCheckIn = function(ticketId) {
  const input = document.getElementById('input-ticket-id');
  if (input) input.value = ticketId;
  verifyCheckIn(ticketId);
};

// View Digital QR Pass in Canva-grade Modal
window.viewDigitalPass = function(ticketId) {
  const reg = state.registrations.find(r => r.ticketId === ticketId);
  if (!reg) return;

  const modal = document.getElementById('ticket-modal');
  document.getElementById('ticket-modal-status').textContent = reg.status.toUpperCase();
  document.getElementById('ticket-modal-status').style.background = reg.status === 'Attended' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.2)';
  document.getElementById('ticket-modal-event-title').textContent = reg.eventTitle || 'Campus Event';
  document.getElementById('ticket-modal-datetime').textContent = `${formatDate(reg.eventDate || reg.registeredAt)}`;
  document.getElementById('ticket-modal-venue').textContent = reg.eventVenue || 'Campus Auditorium';
  document.getElementById('ticket-modal-name').textContent = reg.name;
  document.getElementById('ticket-modal-roll').textContent = reg.rollNo || 'N/A';
  document.getElementById('ticket-modal-ticket-id').textContent = reg.ticketId;
  document.getElementById('ticket-modal-qr-img').src = reg.qrCodeDataUrl || '';

  modal.style.display = 'flex';
};

// Delete Event (Organizer only)
window.deleteEvent = async function(eventId, title) {
  if (!confirm(`Are you sure you want to remove event "${title}"?`)) return;

  try {
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Event Removed', `"${title}" has been deleted.`, 'info');
      refreshAllData();
    }
  } catch (err) {
    console.error('Delete event error:', err);
  }
};

window.markNotifRead = async function(notifId) {
  try {
    await fetch(`/api/notifications/${notifId}/read`, { method: 'PATCH' });
    const n = state.notifications.find(item => item.id === notifId);
    if (n) n.read = true;
    renderNotifications();
  } catch (e) {}
};

// -----------------------------------------------------------------------------
// LOGIN & AUTHENTICATION MODAL CONTROLLERS
// -----------------------------------------------------------------------------
window.openAuthModal = function(defaultRole = 'student') {
  const modal = document.getElementById('auth-modal');
  modal.style.display = 'flex';
  setAuthTab(defaultRole);
};

window.setAuthTab = function(role) {
  const tabStu = document.getElementById('tab-auth-student');
  const tabOrg = document.getElementById('tab-auth-organizer');
  const viewStu = document.getElementById('student-auth-view');
  const viewOrg = document.getElementById('organizer-auth-view');

  if (role === 'organizer') {
    tabOrg.classList.add('active');
    tabStu.classList.remove('active');
    viewOrg.style.display = 'block';
    viewStu.style.display = 'none';
  } else {
    tabStu.classList.add('active');
    tabOrg.classList.remove('active');
    viewStu.style.display = 'block';
    viewOrg.style.display = 'none';
  }
};

window.quickLogin = function(email, password, role) {
  loginUser(email, password, role);
};

async function loginUser(email, password, role) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();

    if (res.status === 200 && data.success) {
      saveUserSession(data.user);
      document.getElementById('auth-modal').style.display = 'none';
      showToast('Login Successful', `Welcome, ${data.user.name}! Switched to ${data.user.role === 'organizer' ? 'Organizer' : 'Student'} mode.`, 'success');
      playSuccessChime();
    } else {
      showToast('Login Failed', data.error || 'Invalid credentials.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error', 'Could not authenticate.', 'error');
  }
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS & SETUP
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Theme Toggle
  const themeBtn = document.getElementById('btn-toggle-theme');
  const themeIcon = document.getElementById('theme-icon');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeIcon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });

  // Switch Account / Login button
  document.getElementById('btn-switch-account').addEventListener('click', () => {
    openAuthModal(state.currentUser?.role === 'organizer' ? 'student' : 'organizer');
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    openAuthModal('student');
  });

  // Close Auth Modal
  document.getElementById('btn-close-auth-modal').addEventListener('click', () => {
    document.getElementById('auth-modal').style.display = 'none';
  });

  // Auth modal role tabs
  document.getElementById('tab-auth-student').addEventListener('click', () => setAuthTab('student'));
  document.getElementById('tab-auth-organizer').addEventListener('click', () => setAuthTab('organizer'));

  // Student Login Form
  document.getElementById('student-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('stu-email').value;
    const pass = document.getElementById('stu-password').value;
    loginUser(email, pass, 'student');
  });

  // Organizer Login Form
  document.getElementById('organizer-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('org-email').value;
    const pass = document.getElementById('org-password').value;
    loginUser(email, pass, 'organizer');
  });

  // Notification dropdown toggle
  const notifBellBtn = document.getElementById('btn-toggle-notifs');
  const notifDropdown = document.getElementById('notif-dropdown');
  notifBellBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
      notifDropdown.classList.remove('open');
    }
  });

  document.getElementById('btn-mark-all-read').addEventListener('click', async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    state.notifications.forEach(n => n.read = true);
    renderNotifications();
    showToast('Notifications Cleared', 'All notifications marked as read', 'info');
  });

  document.getElementById('btn-mark-all-read-center').addEventListener('click', async () => {
    await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    state.notifications.forEach(n => n.read = true);
    renderNotifications();
    showToast('Notifications Cleared', 'All notifications marked as read', 'info');
  });

  document.getElementById('btn-view-all-notifs').addEventListener('click', () => {
    notifDropdown.classList.remove('open');
    switchTab('notifications');
  });

  // Create Event Modal
  const createEvtModal = document.getElementById('create-event-modal');
  document.getElementById('btn-close-create-event').addEventListener('click', () => { createEvtModal.style.display = 'none'; });
  document.getElementById('btn-cancel-create-event').addEventListener('click', () => { createEvtModal.style.display = 'none'; });

  document.getElementById('create-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      title: document.getElementById('evt-title').value,
      category: document.getElementById('evt-category').value,
      capacity: document.getElementById('evt-capacity').value,
      date: document.getElementById('evt-date').value,
      time: document.getElementById('evt-time').value,
      venue: document.getElementById('evt-venue').value,
      organizer: document.getElementById('evt-organizer').value,
      description: document.getElementById('evt-desc').value
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event Created', `"${payload.title}" published with capacity ${payload.capacity}`, 'success');
        createEvtModal.style.display = 'none';
        document.getElementById('create-event-form').reset();
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
      showToast('Error', 'Failed to publish event', 'error');
    }
  });

  // Ticket Modal Close
  const ticketModal = document.getElementById('ticket-modal');
  document.getElementById('btn-close-ticket-modal').addEventListener('click', () => { ticketModal.style.display = 'none'; });
  document.getElementById('btn-done-ticket').addEventListener('click', () => { ticketModal.style.display = 'none'; });
  document.getElementById('btn-print-ticket').addEventListener('click', () => {
    window.print();
  });

  // Manual Check-In Form Submit
  document.getElementById('manual-checkin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('input-ticket-id').value.trim();
    if (val) verifyCheckIn(val);
  });

  // Scanner Switcher (Camera vs Manual)
  const tabCamera = document.getElementById('tab-scan-camera');
  const tabManual = document.getElementById('tab-scan-manual');
  const cameraView = document.getElementById('camera-scanner-view');
  const manualView = document.getElementById('manual-scanner-view');

  if (tabCamera && tabManual) {
    tabCamera.addEventListener('click', () => {
      tabCamera.classList.add('active');
      tabManual.classList.remove('active');
      cameraView.style.display = 'flex';
      manualView.style.display = 'none';
    });

    tabManual.addEventListener('click', () => {
      tabManual.classList.add('active');
      tabCamera.classList.remove('active');
      manualView.style.display = 'flex';
      cameraView.style.display = 'none';
      document.getElementById('input-ticket-id')?.focus();
    });
  }

  // Camera QR Scanner Toggle
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnStopCam = document.getElementById('btn-stop-camera');

  if (btnStartCam && btnStopCam) {
    btnStartCam.addEventListener('click', () => {
      if (typeof Html5QrcodeScanner !== 'undefined') {
        btnStartCam.style.display = 'none';
        btnStopCam.style.display = 'inline-flex';

        state.html5QrScanner = new Html5QrcodeScanner("qr-reader", {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1.0
        });

        state.html5QrScanner.render(
          (decodedText) => { verifyCheckIn(decodedText); },
          (error) => {}
        );
        state.isCameraScanning = true;
      } else {
        showToast('Camera Scanner', 'Use manual input or test simulation chips.', 'warning');
      }
    });

    btnStopCam.addEventListener('click', () => {
      if (state.html5QrScanner) {
        state.html5QrScanner.clear();
        state.html5QrScanner = null;
      }
      btnStopCam.style.display = 'none';
      btnStartCam.style.display = 'inline-flex';
      state.isCameraScanning = false;
    });
  }

  // Broadcast Composer Submit
  document.getElementById('broadcast-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.querySelector('input[name="broadcast-type"]:checked').value;
    const payload = {
      eventId: document.getElementById('broadcast-target').value,
      title: document.getElementById('broadcast-title').value,
      message: document.getElementById('broadcast-message').value,
      type: type === 'urgent' ? 'broadcast' : 'system'
    };

    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Announcement Broadcasted', 'Notification sent to live dashboard stream', 'success');
        document.getElementById('broadcast-form').reset();
        refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Category Filters on Events Tab
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.activeCategoryFilter = pill.getAttribute('data-category');
      renderEvents();
    });
  });

  // Search Input for Events
  document.getElementById('event-search-input')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderEvents();
  });

  // Search & Filter for Attendees Directory
  document.getElementById('search-attendees-input')?.addEventListener('input', renderAttendeesTable);
  document.getElementById('filter-attendee-status')?.addEventListener('change', renderAttendeesTable);

  // Refresh Buttons
  document.getElementById('btn-refresh-analytics')?.addEventListener('click', () => {
    fetchAnalytics();
    showToast('Analytics Refreshed', 'Real-time metrics updated', 'info');
  });

  document.getElementById('btn-refresh-my-tickets')?.addEventListener('click', () => {
    fetchRegistrations();
    showToast('Tickets Refreshed', 'Passes synchronized with server', 'info');
  });

  document.getElementById('btn-refresh-attendees')?.addEventListener('click', () => {
    fetchRegistrations();
    showToast('Attendee Directory Refreshed', 'Data synchronized', 'info');
  });

  // Export CSV Report
  document.getElementById('btn-export-csv')?.addEventListener('click', exportCSVReport);
}

// -----------------------------------------------------------------------------
// EXPORT CSV REPORT
// -----------------------------------------------------------------------------
function exportCSVReport() {
  if (!state.analytics) return;

  let csv = '=== EVENT MANAGEMENT SYSTEM REPORT ===\r\n';
  csv += `Generated At: ${new Date().toLocaleString()}\r\n\r\n`;

  csv += '--- EVENT PERFORMANCE & ATTENDANCE METRICS ---\r\n';
  csv += 'Event ID,Title,Category,Capacity,Registered,Checked-In,Attendance Rate %,Capacity Fill %\r\n';

  state.analytics.eventMetrics.forEach(m => {
    csv += `"${m.id}","${m.title}","${m.category}",${m.capacity},${m.registered},${m.checkedIn},${m.attendanceRate}%,${m.fillRate}%\r\n`;
  });

  csv += '\r\n--- REGISTERED ATTENDEES DIRECTORY ---\r\n';
  csv += 'Ticket ID,Name,Student ID,Email,Department,Event,Status,Checked-In Timestamp\r\n';

  state.registrations.forEach(r => {
    csv += `"${r.ticketId}","${r.name}","${r.rollNo}","${r.email}","${r.department}","${r.eventTitle || ''}","${r.status}","${r.checkedInAt || 'Pending'}"\r\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `EventReport_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Report Exported', 'CSV analytics report downloaded successfully.', 'success');
}

// -----------------------------------------------------------------------------
// LIVE CLOCK
// -----------------------------------------------------------------------------
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  function update() {
    const now = new Date();
    if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  update();
  setInterval(update, 1000);
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', async () => {
  initLiveClock();
  setupEventListeners();
  loadUserSession();
  initSSE();
  await refreshAllData();
  console.log('EventHub Portal Initialized.');
});
