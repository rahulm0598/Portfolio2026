# Portfolio 2026 - Local Server Instructions

To run your portfolio project locally and access it on your local network (e.g., from your phone), follow these steps:

## 1. Open Terminal
Open your terminal (PowerShell or Command Prompt) and navigate to the project directory:
```powershell
cd "d:\Portfolio 2026"
```

## 2. Run the Server
Choose one of the following commands:

### Option A: Using Node.js (Recommended)
```powershell
npx http-server -p 8080
```

### Option B: Using Python
```powershell
python -m http.server 8080
```

## 3. Access the Site
Once the server is running, it will show several links. You can use any of them:
- **On this computer:** [http://localhost:8080](http://localhost:8080)
- **On other devices (phone/tablet):** [http://192.168.1.4:8080](http://192.168.1.4:8080)
  *(Ensure all devices are on the same Wi-Fi network)*
