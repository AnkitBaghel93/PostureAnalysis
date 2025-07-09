import cv2
import mediapipe as mp
import tempfile
import math
import os

def calculate_angle(a, b, c):
    angle = math.degrees(math.atan2(c.y - b.y, c.x - b.x) - math.atan2(a.y - b.y, a.x - b.x))
    return abs(angle) if abs(angle) <= 180 else 360 - abs(angle)

def analyze_video(file):
    try:
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        temp_input.write(file.read())
        temp_input.close()

        cap = cv2.VideoCapture(temp_input.name)
        if not cap.isOpened():
            return {"results": [{"frame": 0, "status": "Unable to open video file"}]}

        fourcc = cv2.VideoWriter_fourcc(*'vp80')
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 20
        out = cv2.VideoWriter(temp_output.name, fourcc, fps, (width, height))

        mp_pose = mp.solutions.pose
        pose = mp_pose.Pose()
        mp_draw = mp.solutions.drawing_utils
        mp_lm = mp_pose.PoseLandmark

        results = []
        frame_id = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_id += 1
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = pose.process(rgb)

            status_list = []
            if result.pose_landmarks:
                lms = result.pose_landmarks.landmark

                ls = lms[mp_lm.LEFT_SHOULDER.value]
                rs = lms[mp_lm.RIGHT_SHOULDER.value]
                lh = lms[mp_lm.LEFT_HIP.value]
                rh = lms[mp_lm.RIGHT_HIP.value]
                le = lms[mp_lm.LEFT_EAR.value]
                nose = lms[mp_lm.NOSE.value]
                lk = lms[mp_lm.LEFT_KNEE.value]
                la = lms[mp_lm.LEFT_ANKLE.value]

                # Posture rules
                if abs(ls.y - lh.y) < 0.1: status_list.append("slouching")
                if nose.z < ls.z - 0.1: status_list.append("forward head")
                if ls.z < lh.z - 0.1 or rs.z < rh.z - 0.1: status_list.append("rounded shoulders")
                if abs(lk.x - la.x) > 0.1 and lk.x > la.x: status_list.append("bad squat: knee beyond toe")
                if calculate_angle(ls, lh, lk) < 150: status_list.append("bad squat: back angle <150°")
                if calculate_angle(ls, le, nose) > 30: status_list.append("bad desk: neck bent")
                if calculate_angle(ls, lh, lk) < 160: status_list.append("bad desk: back not straight")

                final_status = "good" if not status_list else ", ".join(status_list)
                results.append({"frame": frame_id, "status": final_status})

                # Annotate video
                mp_draw.draw_landmarks(frame, result.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                cv2.putText(
                    frame, f"{final_status}", (30, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                    (0, 0, 255) if final_status != "good" else (0, 255, 0), 2
                )

            out.write(frame)

        cap.release()
        out.release()
        return {"results": results, "video_path": temp_output.name}

    except Exception as e:
        return {"results": [{"frame": 0, "status": f"Exception: {str(e)}"}]}
