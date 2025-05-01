Here's a **README.md** for your **Visitor Detector App**, explaining how it works, how to set it up, and how to use it:

---

# 👁️ Visitor Detector App

A real-time visitor detection web application using **YOLOv8**, **face recognition**, and **FastAPI**, designed to detect and log unknown faces from an IP camera feed.

## 🚀 Features

- Detects people using **YOLOv8** (Ultralytics)
- Identifies whether a face is **new** or **already seen** using face encodings
- Takes a **snapshot** of new visitors and stores them by date
- Displays a **live video feed** with bounding boxes and labels
- Works with **IP camera streams** (e.g., mobile phone camera apps)
- Automatically **resets known visitors daily**

---

## 🛠️ Requirements

Install dependencies with:

```bash
pip install -r requirements.txt
```

Sample `requirements.txt`:

```txt
fastapi
uvicorn
opencv-python
face_recognition
numpy
python-multipart
ultralytics
```

> ⚠️ You must also have `dlib` and `cmake` installed, which are dependencies of `face_recognition`.

---

## 📷 Setup

1. **Set the IP Camera URL**:
   - You can set it using an environment variable:
     ```bash
     export IP_CAMERA_URL="http://<your-ip>:8080/video"
     ```
   - Or update the `IP_CAMERA_URL` directly in the code.

2. **Ensure YOLOv8 model is present**:
   - The app uses `yolov8n.pt`. Download from [Ultralytics](https://github.com/ultralytics/ultralytics) or run:
     ```bash
     yolo download yolov8n.pt
     ```

3. **Create snapshot directory**:
   - The app will automatically create `snapshots/` and subfolders based on the current date.

---

## ▶️ Running the App

Start the FastAPI server with:

```bash
uvicorn app:app --reload
```

Then navigate to:

```
http://127.0.0.1:8000
```

---

## 📁 Output

- Visitor snapshots are stored in:
  ```
  snapshots/YYYY-MM-DD/visitor_HHMMSS.jpg
  ```

- New visitors are highlighted in **green**, and known ones in **cyan**.

---

## 💡 Notes

- **Performance Tip**: Only every 5th frame is processed for face detection to reduce CPU load.
- **Daily Reset**: The app clears the list of known visitors every new day.
- If the camera feed fails, a `RuntimeError` is raised.

---

## 📌 To-Do / Improvements

- Add a simple UI dashboard for reviewing past visitors
- Store data in a database with metadata (timestamp, image path)
- Support multiple camera feeds
- Use face clustering for better grouping

---

## 🧑‍💻 Author

**Deepak Varshney**
