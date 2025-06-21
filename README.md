# 🔍 AnalyZer

**AI-Powered Code Complexity Analyzer for Developers**  
_A blazing-fast tool to understand what your code is doing and how to make it better._

---

## ✨ Overview

**AnalyZer** is a powerful VS Code extension that instantly analyzes your code’s **time and space complexity** using AI.  
It provides smart optimization suggestions and tags your code with **top tech company patterns** — making it perfect for interview prep, competitive coding, and writing high-performance software.

---

## 💡 Why the name “AnalyZer”?

> The bold **Z** in **AnalyZer** stands for:

- 🔁 **Z-depth**: Deep analysis from surface-level logic to low-level complexity  
- ⚡ **Zoomed-in focus** on performance bottlenecks  
- 🧠 **AI-powered intelligence** for smart static analysis  

The **Z** symbolizes performance, intelligence, and clarity — the essence of this tool.

---

## 🚀 Features

- 📊 **Time & Space Complexity Analysis** (AI-generated)
- 🛠️ **Optimization Suggestions**
- 💼 **Company Tags** (e.g., “Asked in Google, Amazon”)
- 💬 **Motivational Developer Quotes**
- 🧩 Supports multiple languages: JavaScript, Python, C++, Java

---

## 📂 Project Structure

```
AnalyZer/
├── client/       # VS Code extension source code
│   ├── assets/   # Extension assets (images, icons)
│   ├── src/      # Extension logic (commands, views)
│   ├── package.json
│   └── ...
├── server/       # Express.js backend with AI integration
│   ├── routes/
│   ├── controllers/
│   ├── .env.example
│   └── index.js
├── README.md
└── ...
```

---

## 🧰 Tech Stack

### 💻 Client (VS Code Extension)
- TypeScript
- VS Code Extension API
- HTML + CSS (Webview UI)
- Axios

### 🌐 Server (Backend)
- Node.js (ES Modules)
- Express.js
- OpenAI / DeepSeek APIs
- MongoDB (optional for storing history)

---

## 📦 Installation & Setup

### 🔧 Prerequisites
- Node.js ≥ 18.x
- VS Code (latest)
- Git

---

### 🧪 Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/udayapex1/AnanlyZer-.git
cd AnanlyZer-
```

2. **Install dependencies**
```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

3. **Create `.env` file in the `server/` folder**
```
OPENAI_API_KEY=your_key_here
PORT=5000
```

4. **Start the backend**
```bash
cd server
npm run dev
```

5. **Run the extension (client)**  
- Open `client/` folder in VS Code  
- Press `F5` to launch in Extension Development Host window  
- In that new window, press `Ctrl + Shift + P` and run: `Analyze`

---

## 🛠 Usage

1. Select a code block in your editor  
2. Press `Ctrl + Shift + P`  
3. Run: `Analyze Complexity`  
4. Get results in the sidebar and output panel

---

## 📸 Preview

### 🔎 Real-time AI Analysis in Action

1. Open your code  
2. Press `Ctrl + Shift + P` → **Analyze**  
3. Wait a few seconds (cold start may take longer)

---

### 🪄 Step-by-step Visuals:

#### ▶️ Step 1: Run Command  
![Step 1](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step1.png)

---

#### ⏳ Step 2: Wait for Analysis  
![Step 2](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step2.png)

---

#### 🧠 Step 3: Get AI-based Output in Sidebar  
![Step 3](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step3.png)

---

#### 🖥️ Step 4: Output Panel Insights  
![Step 4](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step4.png)

---

#### 🧮 Time & Space Complexity  
![Step 5](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step5.png)

---

#### 🛠️ Optimization Suggestions  
![Step 6](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step6.png)

---

#### 🏢 Company Tags (Asked in MNCs)  
![Step 7](https://raw.githubusercontent.com/udayapex1/AnanlyZer-/main/client/assets/step7.png)

---

⚠️ **Note:** You might experience a short delay the first time you use the extension.  
This is due to the backend running on a **free-tier server**, and the app may undergo a **cold start**. Your patience is appreciated — I’m a solo dev trying to build something cool! 🙏

---

## 💬 Motivational Dev Quotes

We all need some inspiration during debugging. AnalyZer displays a random motivational quote each time you analyze code!

---

## 🧠 Future Roadmap

- [ ] Language support: Go, Rust, Kotlin  
- [ ] User login & analysis history  
- [ ] AI bug detection & fixes  
- [ ] Graph-based performance visualization  
- [ ] Dark/light theme toggle  

---

## 📥 Install from VS Code Marketplace

🔗 [Click here to Install](https://marketplace.visualstudio.com/items?itemName=UdayPareta.analyzer)

Or use the terminal:

```bash
code --install-extension UdayPareta.analyzer
```

---

## 🤝 Contributing

Pull requests are welcome! Please follow these steps:

1. Fork the repo  
2. Create a new branch: `git checkout -b feature-name`  
3. Commit your changes  
4. Push and open a PR  

---

## 🧾 License

This project is licensed under the [MIT License](LICENSE)

---

Made with ❤️ by [Uday Pareta](https://github.com/udayapex1)
