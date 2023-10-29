import * as moment from 'moment'
export const timeValidator = (startTime: string, endTime: string) => {
  if (startTime && endTime) {
    const end = moment(endTime, 'HH:mm')
    const start = moment(startTime, 'HH:mm')
    return end > start ? null : { time: true }
  }
  return null
}
