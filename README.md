# LegalInfoBD

![Version](https://img.shields.io/badge/version-1.1-006a4e?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-f42a41?style=flat-square)
![Status](https://img.shields.io/badge/status-live-006a4e?style=flat-square)
![React](https://img.shields.io/badge/React-CRA-61dafb?style=flat-square&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Deploy](https://img.shields.io/badge/deployed-Vercel-black?style=flat-square&logo=vercel)

> **An AI-powered legal information system for Bangladesh Labour Law**  
> Making the Bangladesh Labour Act 2006 accessible to workers, researchers, and legal professionals — in Bangla and English.

🌐 **Live Demo:** [legal-info-bd-9q7f.vercel.app](https://legal-info-bd-9q7f.vercel.app)

---

## 📸 Preview

> Workers and legal professionals can ask questions in Bangla or English and receive cited, grounded answers from the Labour Act 2006.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **RAG-Based Q&A** | Ask questions in Bangla or English, get answers grounded in real legal text |
| 📎 **Citation-Backed Responses** | Every answer cites the exact section of the Labour Act 2006 |
| 📚 **Legal Document Browser** | Explore the full act by chapter and section |
| ❓ **FAQ Library** | Preloaded common legal questions in Bangla & English |
| ✅ **Expert Validation Panel** | Legal professionals can review and validate AI answers |
| 🔒 **Anonymous Access** | No login or personal data collection for workers |
| ⚖️ **Built-in Legal Disclaimers** | Responsible AI — every page reminds users this is not legal advice |
| 💼 **Case Management** | Lawyers can create, track, and manage legal cases |

---

## 🧠 How It Works (RAG Pipeline)

```
User Query (Bangla / English)
        ↓
① Query converted to vector embeddings
        ↓
② Relevant sections retrieved from vector database
        ↓
③ Retrieved legal text passed to LLM (Llama 3 via OpenRouter)
        ↓
④ Answer generated — grounded in retrieved context
        ↓
⑤ Response returned with citations + section references
```

This architecture **reduces hallucination** and ensures every response is traceable to the actual law.

---

## 🛠️ Tech Stack

### Frontend
- **React** (Create React App) + TypeScript
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animations
- **Lucide React** — icons
- **Axios** — API communication

### Backend
- **Node.js + Express** — REST API
- **PostgreSQL + pgvector** — structured data + vector embeddings
- **JWT Authentication** — secure lawyer/validator login
- **Helmet + Rate Limiting** — security middleware

### AI Layer
- **Llama 3** via **OpenRouter API** — language model
- **RAG Pipeline** — retrieval-augmented generation
- **Vector Embeddings** — semantic search over legal sections

### Deployment
- **Vercel** — frontend
- **Render** — backend
- **Neon / Supabase** — PostgreSQL database

---

## 📦 Dataset

This project is built on the following public dataset:

> Sakhawat, A. (2025). *Bangladesh Legal Acts Dataset*. Kaggle.  
> https://doi.org/10.34740/KAGGLE/DSV/12931928

Primary legal source: **Bangladesh Labour Act 2006 (Act No. XLII of 2006)** — Ministry of Law, Government of Bangladesh.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm v8+
- PostgreSQL (with pgvector extension)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aranya3004/legal_info_BD.git
cd legal_info_BD

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Environment Variables

Create a `.env` file in `/backend`:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

Create a `.env` file in the root (frontend):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Run Development Server

```bash
# Run frontend (from root)
npm start
# → http://localhost:3000

# Run backend (from /backend)
npm start
# → http://localhost:5000
```

---

## 🌐 Deployment

| Service | URL |
|---|---|
| **Frontend (Vercel)** | [legal-info-bd-9q7f.vercel.app](https://legal-info-bd-9q7f.vercel.app) |
| **Backend (Render)** | [legal-ai-backend-kvl5.onrender.com](https://legal-ai-backend-kvl5.onrender.com) |
| **Health Check** | [/health](https://legal-ai-backend-kvl5.onrender.com/health) |

> ⚠️ The backend is hosted on Render's free tier and may take 30–60 seconds to wake up after inactivity.

---

## 👥 User Roles

| Role | Access |
|---|---|
| **Worker (anonymous)** | FAQ library, document browser — no login required |
| **Lawyer** | Full AI Q&A, case management, act reference panel |
| **Validator** | Expert review panel to validate AI-generated answers |

---

## ⚖️ Disclaimer

This system is for **informational purposes only** and does not constitute legal advice.  
All responses are generated based on the Bangladesh Labour Act 2006 and should be reviewed by a qualified legal professional when necessary.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Commit your changes
git commit -m 'Add: your feature description'

# 4. Push to your branch
git push origin feature/your-feature

# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 📬 Contact

For questions or feedback, open an issue on [GitHub](https://github.com/Aranya3004/legal_info_BD/issues).

---

<p align="center">
  Built with ❤️ for access to justice in Bangladesh
</p>
