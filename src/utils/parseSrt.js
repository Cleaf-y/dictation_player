import {readTextFile} from "@tauri-apps/api/fs";

export async function parseSrt(path){
    const raw_text = await readTextFile(path)
    return parseSrtString(raw_text)
}

function parseSrtString(srtString) {
    // Split the subtitles into individual segments
    const subtitles = srtString.trim().split('\r\n\r\n');

    // Helper function to convert time strings to seconds
    function timeStringToSeconds(timeString) {
        const [hours, minutes, secondsAndMillis] = timeString.split(':');
        const [seconds, milliseconds] = secondsAndMillis.split(',');
        return (
            parseInt(hours, 10) * 3600 +
            parseInt(minutes, 10) * 60 +
            parseInt(seconds, 10) +
            parseInt(milliseconds, 10) / 1000
        );
    }

    // Parse each subtitle segment into an object and store them in an array
    return subtitles.map((subtitle) => {
        const lines = subtitle.split('\r\n');
        const [index, timeRange, ...textLines] = lines;
        const [startTimeString, endTimeString] = timeRange.split(' --> ');

        const startTime = timeStringToSeconds(startTimeString);
        const endTime = timeStringToSeconds(endTimeString);
        const duration = Math.round((endTime - startTime) * 1000); // Convert to milliseconds and round

        return {
            startTime,
            endTime,
            duration,
            text: textLines.join(' '),
        };
    });
}
