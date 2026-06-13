try:
    result = subprocess.run(
        [
            "ollama",
            "run",
            "llama3",
            f"Summarize this voicemail professionally:\n\n{transcript}"
        ],
        capture_output=True,
        text=True
    )

    summary = result.stdout.strip()

except Exception as e:
    summary = f"Summary failed: {str(e)}"
