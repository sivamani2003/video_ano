# Video Text Overlay Application

This application allows users to overlay text onto a video at specific pause times and export the modified video. It also supports speech-to-text input for adding overlayed text using the browser's speech recognition capabilities.

## Features

- Load and play a video.
- Pause video at any time and add text overlay at the paused frame.
- Use browser-based speech recognition to input overlayed text.
- Export the processed video with text overlay as a downloadable file.

## Prerequisites

- Node.js and npm installed on your system.
- A modern browser with support for `MediaRecorder`, `Canvas API`, and `Speech Recognition API` (`webkitSpeechRecognition` is used here).
- Ensure the `hero-video.mp4` file is located in the `./assets` directory relative to the project.

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/sivamani2003/video_ano
```
2. Navigate to the project directory:
```bash
   cd frontend
```
3. Install the dependencies:
```bash
   npm install
```

## Running the Application

1. Start the development server:
```bash
   npm run dev
```

2. Open the application in your browser:
```bash
   http://localhost:5173
```

## File Structure

```
src/
├── App.js             # Main application file.
├── assets/
│   └── hero-video.mp4  # Sample video file.
├── index.js           # Entry point of the React app.
├── styles.css         # Optional styles for the app.
...
```

## How to Use

1. Load the application in your browser.
2. Play the video or pause it at a specific frame to add text overlay.
3. Use the text input field to type the text or click on `Start Listening` to use speech-to-text functionality for overlay text.
4. Click on `Download Video with Text` to process and download the video with text overlay.

## Notes

- Ensure you use a browser with the `MediaRecorder` and `Speech Recognition` APIs supported (e.g., Google Chrome).
- If speech recognition is not supported in your browser, the application will display an alert.
- The exported video will be in `.webm` format.

## Known Limitations

- Processing large videos may be resource-intensive and could cause performance issues.
- Video exporting relies on the browser's `MediaRecorder` API and might not support all codecs or formats.
- Only tested in modern Chromium-based browsers; compatibility with other browsers is not guaranteed.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

