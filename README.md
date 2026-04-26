# LegalInfoBD

<img width="93" height="20" alt="image" src="https://github.com/user-attachments/assets/9d2bc27e-6393-40a0-9e69-47af8a07cb48" />

<img width="82" height="20" alt="image" src="https://github.com/user-attachments/assets/16f58f34-d36e-435c-9f73-6ce06e58f3b5" />

<img width="88" height="20" alt="image" src="https://github.com/user-attachments/assets/b0e12d55-0a09-4487-89a8-c148e8d50475" />


A web-based legal information system that uses Retrieval-Augmented Generation (RAG) to answer questions about Bangladesh labor law with verifiable citations from the Bangladesh Labour Act 2006.

Built to make legal information more accessible for workers, researchers, and legal professionals—without sacrificing accuracy.

✨ Key Features
RAG-Based Question Answering
Ask questions in Bangla or English and receive answers grounded in actual legal text.
Citation-Backed Responses
Every answer includes references to specific sections of the Labour Act 2006.
Legal Document Browser
Explore the full act organized by chapter and section.
Frequently Asked Questions (FAQ)
Preloaded common legal questions for quick access.
Expert Validation Panel
Legal professionals can review and validate AI-generated answers.
Anonymous Access
No login or personal data collection.
Built-in Legal Disclaimers
Ensures responsible use of AI-generated legal information.
🧠 How It Works (RAG Pipeline)

This system uses a Retrieval-Augmented Generation (RAG) architecture:

User submits a question (Bangla/English)
The system converts the query into embeddings
Relevant sections are retrieved from a vector database
Retrieved legal text is passed to a language model
The model generates an answer grounded in retrieved context
The system returns:
Final answer
Supporting legal citations

This approach reduces hallucination and ensures responses are based on real legal documents.

📦 Dataset Citation

This project is built upon the following dataset:

Sakhawat, A. (2025). Bangladesh Legal Acts Dataset Dataset. Kaggle.
https://doi.org/10.34740/KAGGLE/DSV/12931928

🛠️ Tech Stack

Frontend

React (Create React App)

Backend

Node.js + Express

Database

MySQL (structured data)
Vector Database (e.g., Pinecone)

AI Layer

OpenAI API or open-source LLM (e.g., LLaMA)

Deployment

Vercel / Netlify (frontend)
Railway / similar (backend)
🚀 Getting Started
Prerequisites
Node.js (v16+)
npm (v8+)
Installation
git clone https://github.com/Aranya3004/legal_info_BD.git
cd https://github.com/Aranya3004/legal_info_BD?authuser=0
npm install
Run Development Server
npm start

Visit: http://localhost:3001

🌐 Deployment

This project can be deployed on:

Vercel:https://legal-info-bd-9q7f.vercel.app/

⚖️ Disclaimer

This system is for informational purposes only and does not replace professional legal advice.
All responses are generated based on the Bangladesh Labour Act 2006 and should be reviewed by qualified legal professionals when necessary.

🤝 Contributing

Contributions are welcome.

Fork the repository
Create a feature branch (git checkout -b feature/your-feature)
Commit changes (git commit -m 'Add feature')
Push to your branch
Open a Pull Request

📄 License

This project is licensed under the MIT License.

📬 Contact

For questions or feedback, open an issue on GitHub.
