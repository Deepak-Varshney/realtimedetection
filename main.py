import cv2
import face_recognition
import numpy as np
import os
from datetime import datetime, date
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv8 model (use yolov8n.pt or yolov8s.pt for faster inference)
model = YOLO("yolov8n.pt")  # Make sure to download this or install via ultralytics

# Face encoding memory (resets daily)
known_encodings = []
detected_faces = []
current_date = date.today()

# Webcam capture
cap = cv2.VideoCapture(0)

# Ensure snapshot directory exists
os.makedirs("snapshots", exist_ok=True)

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
    <html>
        <head><title>Visitor Camera</title></head>
        <body>
            <h1>Live Visitor Camera</h1>
            <img src="/video_feed" width="720" />
        </body>
    </html>
    """


def generate_frames():
    global current_date, known_encodings

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Reset encoding memory if date changes
        today = date.today()
        if today != current_date:
            print(f"📆 Date changed: {current_date} ➜ {today}. Resetting memory.")
            current_date = today
            known_encodings = []

        results = model.predict(frame, verbose=False)
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                if cls_id == 0:  # person class
                    x1, y1, x2, y2 = map(int, box.xyxy[0])

                    face_frame = frame[y1:y2, x1:x2]
                    face_rgb = cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB)
                    face_locations = face_recognition.face_locations(face_rgb)

                    encodings = face_recognition.face_encodings(face_rgb, face_locations)
                    for encoding in encodings:
                        matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=0.6)
                        if not any(matches):
                            known_encodings.append(encoding)

                            # Save snapshot with date folder
                            date_folder = f"snapshots/{current_date.strftime('%Y-%m-%d')}"
                            os.makedirs(date_folder, exist_ok=True)
                            timestamp = datetime.now().strftime("%H%M%S")
                            filename = f"{date_folder}/visitor_{timestamp}.jpg"
                            cv2.imwrite(filename, face_frame)

                            print(f"🔍 New visitor detected: {filename}")

                            # Draw green box
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.putText(frame, "New Visitor", (x1, y1 - 10),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                        else:
                            # Draw blue box
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 0), 2)
                            cv2.putText(frame, "Known Visitor", (x1, y1 - 10),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        # Encode frame to bytes
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')
