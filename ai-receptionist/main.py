from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from datetime import datetime
import subprocess
import shutil
import os

app = FastAPI()

missed_calls = []

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def transcribe_audio(audio_path):

    command = [
        "/home/ryanh4966/whisper.cpp/build/bin/whisper-cli",
        "-m",
        "/home/ryanh4966/whisper.cpp/models/ggml-base.en.bin",
        "-f",
        audio_path
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    return result.stdout


@app.post("/upload")
async def upload_voicemail(file: UploadFile = File(...)):

    filepath = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcript = transcribe_audio(filepath)

    missed_calls.append({
        "caller": "Uploaded Voicemail",
        "time": str(datetime.now()),
        "transcript": transcript
    })

    return {
        "message": "Voicemail uploaded successfully",
        "transcript": transcript
    }


@app.get("/", response_class=HTMLResponse)
def dashboard():

    html = """
    <html>

        <head>
            <title>AI Receptionist Dashboard</title>
        </head>

        <body style="font-family: Arial; padding: 40px;">

            <h1>AI Receptionist</h1>

            <h2>Upload Voicemail</h2>

            <form action="/upload" method="post" enctype="multipart/form-data">

                <input type="file" name="file">

                <button type="submit">
                    Upload
                </button>

            </form>

            <hr>

            <h2>Transcribed Calls</h2>

            <ul>
    """

    for call in missed_calls:

        html += f"""

        <li>

            <b>{call['caller']}</b>

            <br><br>

            {call['time']}

            <br><br>

            <pre>{call['transcript']}</pre>

        </li>

        <hr>
        """

    html += """

            </ul>

        </body>

    </html>
    """

    return html
