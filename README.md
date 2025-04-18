## 🏗️ Goal Summary

We’re building a **CCTV-powered Visitor Logging + Ticketing System** for a society gate:

- Camera at gate (now webcam, later CCTV IP cam)
- Real-time face logging (with YOLO + face recognition)
- Daily visitor tracking with snapshots
- Future dashboard for ticketing system (React)

---

## ✅ PART 1: Architecture Options (Cost vs Performance)

| Option | Pros | Cons | Ideal Use |
|-------|------|------|-----------|
| 💻 **Full PC with GPU (NVIDIA)** | Fastest YOLOv8 + face recognition | Expensive | Large societies with lots of traffic |
| 🧠 **Mini PC (Intel NUC / Jetson Nano)** | Balanced performance, compact | Slightly costly | Mid-size societies, no GPU |
| 🍓 **Raspberry Pi 4/5 with Coral USB / NPU** | Low cost, low power | Limited performance | Low-traffic gates, or where budget is priority |

---

### 🎯 Recommended for You:

### **🧠 Jetson Nano or Raspberry Pi + Coral Accelerator**
Because:
- YOLOv8n can run on Jetson Nano **with GPU acceleration**
- Face Recognition can run with optimizations (Dlib or even OpenVINO for Intel-based boards)
- Cheaper than full PC and low maintenance
- Compact and easy to mount in a box near gate

---

## 📡 PART 2: How To Connect CCTV Instead of Webcam

You’ll use the **RTSP stream** from the CCTV camera.

### Update your capture line:
```python
cap = cv2.VideoCapture("rtsp://username:password@camera_ip_address:port/stream")
```

> 🔒 Tip: Make sure camera supports RTSP and is reachable on the same LAN

---

## 🔧 PART 3: Installation Plan at Main Gate

### 🛠 Hardware Setup:
- **Jetson Nano / Pi 4/5** (with passive cooling or fan)
- **32GB+ microSD** or SSD
- **Coral USB Accelerator** (if needed for face detection)
- **PoE splitter or power adapter**
- **LAN cable or Wi-Fi dongle**
- **Enclosure box** (weatherproof, mountable)

---

### 🧪 Software Stack (on Jetson Nano or Pi):

1. **Install Python + FastAPI + YOLOv8**  
    ```bash
    sudo apt update && sudo apt install python3-pip cmake libopenblas-dev liblapack-dev libjpeg-dev libx264-dev
    pip3 install fastapi uvicorn face_recognition opencv-python ultralytics
    ```

2. **Enable camera or use RTSP stream**  
    Test with:
    ```bash
    ffplay rtsp://username:password@ip_address
    ```

3. **Set your app to autostart on boot (systemd)**  
    Use `systemd` service to run the FastAPI app after boot

4. **Forward your app port for dashboard (if needed)**  
    You can expose port 8000 or 80 with NGINX

---

## 🔄 PART 4: Daily Maintenance & Logging

- Store visitor snapshots in folders by date (`snapshots/YYYY-MM-DD`)
- Periodically upload to cloud/FTP (optional)
- Export logs as CSV if needed

---

## 🖥️ PART 5: Future Dashboard (React + API)

You’ll create:
- Frontend: React app hosted on same device or on cloud
- Backend:
  - `/video_feed` for stream
  - `/log` API for visitor log data
  - `/tickets` API to manage tickets
- Auth system for manager/supervisor roles

We’ll build that API layer later — but your current architecture supports it nicely.

---

## 🎁 TL;DR: Final Setup Recommendation

| Component       | Suggestion                             |
|----------------|-----------------------------------------|
| Camera          | IP CCTV with RTSP                      |
| Compute Device  | Jetson Nano / Raspberry Pi + Coral USB |
| Storage         | 32–64GB microSD or SSD                 |
| Network         | LAN preferred for video                |
| Power           | PoE or standard adapter                |
| App             | Python + FastAPI + YOLOv8 + React      |
| Optional        | Daily logs to cloud, email alerts      |
---
