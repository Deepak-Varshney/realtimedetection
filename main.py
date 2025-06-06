# import cv2
# import face_recognition
# import numpy as np
# import os
# from datetime import datetime, date
# from fastapi import FastAPI
# from fastapi.responses import StreamingResponse, HTMLResponse
# from fastapi.middleware.cors import CORSMiddleware
# from ultralytics import YOLO

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load YOLOv8 model (use yolov8n.pt or yolov8s.pt for faster inference)
# model = YOLO("yolov8n.pt")  # Make sure to download this or install via ultralytics

# # Face encoding memory (resets daily)
# known_encodings = []
# detected_faces = []
# current_date = date.today()

# # Webcam capture
# cap = cv2.VideoCapture(0)

# # Ensure snapshot directory exists
# os.makedirs("snapshots", exist_ok=True)

# @app.get("/", response_class=HTMLResponse)
# async def index():
#     return """
#     <html>
#         <head><title>Visitor Camera</title></head>
#         <body>
#             <h1>Live Visitor Camera</h1>
#             <img src="/video_feed" width="720" />
#         </body>
#     </html>
#     """


# def generate_frames():
#     global current_date, known_encodings

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         # Reset encoding memory if date changes
#         today = date.today()
#         if today != current_date:
#             print(f"📆 Date changed: {current_date} ➜ {today}. Resetting memory.")
#             current_date = today
#             known_encodings = []

#         results = model.predict(frame, verbose=False)
        
#         for result in results:
#             boxes = result.boxes
#             for box in boxes:
#                 cls_id = int(box.cls[0])
#                 if cls_id == 0:  # person class
#                     x1, y1, x2, y2 = map(int, box.xyxy[0])

#                     face_frame = frame[y1:y2, x1:x2]
#                     face_rgb = cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB)
#                     face_locations = face_recognition.face_locations(face_rgb)

#                     encodings = face_recognition.face_encodings(face_rgb, face_locations)
#                     for encoding in encodings:
#                         matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=0.6)
#                         if not any(matches):
#                             known_encodings.append(encoding)

#                             # Save snapshot with date folder
#                             date_folder = f"snapshots/{current_date.strftime('%Y-%m-%d')}"
#                             os.makedirs(date_folder, exist_ok=True)
#                             timestamp = datetime.now().strftime("%H%M%S")
#                             filename = f"{date_folder}/visitor_{timestamp}.jpg"
#                             cv2.imwrite(filename, face_frame)

#                             print(f"🔍 New visitor detected: {filename}")

#                             # Draw green box
#                             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                             cv2.putText(frame, "New Visitor", (x1, y1 - 10),
#                                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
#                         else:
#                             # Draw blue box
#                             cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 0), 2)
#                             cv2.putText(frame, "Known Visitor", (x1, y1 - 10),
#                                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

#         # Encode frame to bytes
#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()
#         yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


# @app.get("/video_feed")
# async def video_feed():
#     return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')


# import cv2
# import face_recognition
# import numpy as np
# import os
# from datetime import datetime, date
# from fastapi import FastAPI
# from fastapi.responses import StreamingResponse, HTMLResponse
# from fastapi.middleware.cors import CORSMiddleware
# from ultralytics import YOLO
# import time

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load YOLOv8 model
# model = YOLO("yolov8n.pt")  # Ensure the model file is available

# # Face encoding memory (resets daily)
# known_encodings = []
# detected_faces = []
# current_date = date.today()

# # IP camera URL (can be an environment variable or hardcoded for testing)
# CAMERA_SOURCE = "http://172.16.2.42:8080/video"  # Replace with your phone's IP

# # Open video stream
# cap = cv2.VideoCapture(CAMERA_SOURCE)

# if not cap.isOpened():
#     print(f"❌ Unable to connect to camera at {CAMERA_SOURCE}")
#     while not cap.isOpened():
#         print("🔁 Retrying camera connection...")
#         cap.open(CAMERA_SOURCE)
#         time.sleep(5)

# # Ensure snapshot directory exists
# os.makedirs("snapshots", exist_ok=True)

# @app.get("/", response_class=HTMLResponse)
# async def index():
#     return """
#     <html>
#         <head><title>Visitor Camera</title></head>
#         <body>
#             <h1>Live Visitor Camera</h1>
#             <img src="/video_feed" width="720" />
#         </body>
#     </html>
#     """


# def generate_frames():
#     global current_date, known_encodings
#     frame_count = 0
#     frame_skip = 5  # Only process every 5th frame
#     max_encodings = 500  # Limit stored encodings

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             continue

#         frame_count += 1
#         height, width = frame.shape[:2]

#         # Skip processing most frames to reduce lag
#         if frame_count % frame_skip != 0:
#             ret, buffer = cv2.imencode('.jpg', frame)
#             frame_bytes = buffer.tobytes()
#             yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
#             continue

#         # Reset face memory daily
#         today = date.today()
#         if today != current_date:
#             print(f"📆 Date changed: {current_date} ➜ {today}. Resetting memory.")
#             current_date = today
#             known_encodings = []

#         # Resize for faster YOLO processing
#         resized_frame = cv2.resize(frame, (640, 480))
#         scale_x = width / 640
#         scale_y = height / 480

#         results = model.predict(resized_frame, conf=0.5, verbose=False)

#         for result in results:
#             for box in result.boxes:
#                 cls_id = int(box.cls[0])
#                 if cls_id == 0:  # Only detect person
#                     x1, y1, x2, y2 = map(int, box.xyxy[0])

#                     # Scale box back to original frame size
#                     x1 = int(x1 * scale_x)
#                     y1 = int(y1 * scale_y)
#                     x2 = int(x2 * scale_x)
#                     y2 = int(y2 * scale_y)

#                     # Clip box to frame size
#                     x1, y1 = max(0, x1), max(0, y1)
#                     x2, y2 = min(width, x2), min(height, y2)

#                     face_frame = frame[y1:y2, x1:x2]
#                     if face_frame.size == 0:
#                         continue

#                     face_rgb = cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB)
#                     face_locations = face_recognition.face_locations(face_rgb)
#                     encodings = face_recognition.face_encodings(face_rgb, face_locations)

#                     for encoding in encodings:
#                         matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=0.6)
#                         if not any(matches):
#                             known_encodings.append(encoding)
#                             if len(known_encodings) > max_encodings:
#                                 known_encodings.pop(0)  # Prevent memory overload

#                             date_folder = f"snapshots/{current_date.strftime('%Y-%m-%d')}"
#                             os.makedirs(date_folder, exist_ok=True)
#                             timestamp = datetime.now().strftime("%H%M%S")
#                             filename = f"{date_folder}/visitor_{timestamp}.jpg"
#                             cv2.imwrite(filename, face_frame)

#                             print(f"🔍 New visitor detected: {filename}")
#                             cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                             cv2.putText(frame, "New Visitor", (x1, y1 - 10),
#                                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
#                         else:
#                             cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 0), 2)
#                             cv2.putText(frame, "Known Visitor", (x1, y1 - 10),
#                                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

#         # Encode and stream frame
#         ret, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()
#         yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


# @app.get("/video_feed")
# async def video_feed():
#     return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')


# @app.on_event("shutdown")
# def shutdown_event():
#     cap.release()


import os
import time
import cv2
import numpy as np
from datetime import datetime, date
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
import face_recognition
from pymongo import MongoClient
from fastapi.responses import JSONResponse
import json
from bson.json_util import dumps
from bson import ObjectId
from fastapi import FastAPI, HTTPException
from bson import ObjectId
from pymongo import MongoClient
from fastapi import FastAPI, HTTPException
# from motor.motor_asyncio import Async IOMotorClient
from bson import ObjectId
from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str


# FastAPI setup
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static snapshots directory mount
os.makedirs("snapshots", exist_ok=True)
app.mount("/snapshots", StaticFiles(directory="snapshots"), name="snapshots")

# MongoDB setup
client = MongoClient("mongodb+srv://deepakvarshneycom:ijBPV8hWJqdGMolr@cluster0.qllt4ki.mongodb.net/dashdetection")

db = client["dashdetection"]
visitor_collection = db["vis"]

# YOLOv8 model
model = YOLO("yolov8n.pt")

# Memory
known_encodings = []
current_date = date.today()

# Camera
CAMERA_SOURCE = "http://172.16.2.42:8080/"
cap = cv2.VideoCapture(0)
while not cap.isOpened():
    print("🔁 Retrying camera connection...")
    cap.open(CAMERA_SOURCE)
    time.sleep(5)

@app.get("/", response_class=HTMLResponse)
async def index():
    return """
    <html>
        <head>
            <title>Visitor Camera</title>
            <style>
                body { text-align: center; background: #111; color: #fff; }
                img { width: 100%; max-width: 600px; border: 3px solid #ccc; border-radius: 10px; }
            </style>
        </head>
        <body>
            <h2>Live Visitor Feed</h2>
            <img src="/video_feed" />
        </body>
    </html>
    """

def generate_frames():
    global current_date, known_encodings
    frame_count = 0
    frame_skip = 5
    max_encodings = 500

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        frame_count += 1
        height, width = frame.shape[:2]

        if frame_count % frame_skip != 0:
            _, buffer = cv2.imencode('.jpg', frame)
            yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
            continue

        today = date.today()
        if today != current_date:
            current_date = today
            known_encodings = []

        resized = cv2.resize(frame, (640, 480))
        scale_x, scale_y = width / 640, height / 480

        results = model.predict(resized, conf=0.5, verbose=False)

        for result in results:
            for box in result.boxes:
                if int(box.cls[0]) != 0:
                    continue
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                x1, y1 = int(x1 * scale_x), int(y1 * scale_y)
                x2, y2 = int(x2 * scale_x), int(y2 * scale_y)

                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(width, x2), min(height, y2)

                face_frame = frame[y1:y2, x1:x2]
                if face_frame.size == 0:
                    continue

                face_rgb = cv2.cvtColor(face_frame, cv2.COLOR_BGR2RGB)
                face_locations = face_recognition.face_locations(face_rgb)
                encodings = face_recognition.face_encodings(face_rgb, face_locations)

                for encoding in encodings:
                    matches = face_recognition.compare_faces(known_encodings, encoding, tolerance=0.6)
                    if not any(matches):
                        known_encodings.append(encoding)
                        if len(known_encodings) > max_encodings:
                            known_encodings.pop(0)

                        folder = f"snapshots/{current_date.strftime('%Y-%m-%d')}"
                        os.makedirs(folder, exist_ok=True)
                        timestamp = datetime.now().strftime("%H%M%S")
                        filepath = f"{folder}/visitor_{timestamp}.jpg"
                        cv2.imwrite(filepath, face_frame)

                        visitor_collection.insert_one({
                            "imagePath": filepath.replace("\\", "/"),
                            "timestamp": datetime.now(),
                            "status": "unknown",
                            "faceEncoding": encoding.tolist()
                        })

                        print(f"🔍 New visitor logged: {filepath}")
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.putText(frame, "New Visitor", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
                    else:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 255, 0), 2)
                        cv2.putText(frame, "Known Visitor", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        yield b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type='multipart/x-mixed-replace; boundary=frame')


@app.get("/visitor_logs")
def get_visitor_logs(status: str = None, start_date: str = None, end_date: str = None):
    query = {}

    if status:
        query["status"] = status

    if start_date or end_date:
        query["timestamp"] = {}
        if start_date:
            query["timestamp"]["$gte"] = datetime.strptime(start_date, "%Y-%m-%d")
        if end_date:
            query["timestamp"]["$lte"] = datetime.strptime(end_date, "%Y-%m-%d")

    visitors = list(visitor_collection.find(query).sort("timestamp", -1))

    # ✅ Convert _id to string
    for v in visitors:
        v["_id"] = str(v["_id"])

    return visitors  # FastAPI will auto-JSON this cleanly

@app.delete("/visitor_logs/{visitor_id}")
async def delete_visitor(visitor_id: str):
    try:
        obj_id = ObjectId(visitor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid visitor ID")

    result = visitor_collection.delete_one({"_id": obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")
    
    return {"message": "Visitor deleted successfully"}


@app.delete("/visitor_logs/today")
async def delete_todays_visitors():
    start = datetime.combine(date.today(), datetime.min.time())
    end = datetime.combine(date.today(), datetime.max.time())

    result = visitor_collection.delete_many({
        "timestamp": {"$gte": start, "$lte": end}
    })

    return {"message": f"{result.deleted_count} visitor(s) deleted for today"}

@app.patch("/visitor_logs/{visitor_id}")
async def review_visitor(visitor_id: str, update: StatusUpdate):
    try:
        obj_id = ObjectId(visitor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid visitor ID")

    if update.status not in ["known", "unknown", "reviewed"]:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'known', 'unknown', or 'reviewed'.")

    result = visitor_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": update.status}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Visitor not found")

    return {"message": "Visitor status updated successfully"}

@app.post("/reset_encodings")
def reset_encodings_only():
    global known_encodings, current_date
    known_encodings = []
    current_date = date.today()
    return {"message": "In-memory face encodings reset for today"}

@app.on_event("shutdown")
def shutdown_event():
    cap.release()
