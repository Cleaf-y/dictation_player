import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function secondsToTime(seconds) {
    return dayjs.duration(seconds, 'seconds').format('mm:ss')
}

export function timeStringToSeconds(timeString) {
    const milliseconds = parseInt(timeString.split(',')[1])
    const time = timeString.split(',')[0]
    const [hours,minutes, seconds] = time.split(':')
    return parseInt(hours)*3600 + parseInt(minutes)*60 + parseInt(seconds) + milliseconds/1000
}
