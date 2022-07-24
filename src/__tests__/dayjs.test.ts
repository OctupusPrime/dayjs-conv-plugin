import dayjs from '../utils/dayjs';

const timeRanges = [[0, 5], [5, 11], [11, 17], [17, 23]]

const allTimezones = ['Pacific/Midway', 'Pacific/Honolulu', 'America/Juneau', 'America/Dawson', 'America/Boise', 'America/Chicago', 'America/Detroit', 'America/Sao_Paulo', 'America/St_Johns', 'America/Godthab', 'Atlantic/Cape_Verde', 'Etc/GMT', 'Europe/London', 'Europe/Belgrade', 'Europe/Bucharest', 'Asia/Dubai', 'Asia/Tehran', 'Asia/Yekaterinburg', 'Asia/Kolkata', 'Asia/Kathmandu', 'Asia/Dhaka', 'Asia/Rangoon', 'Asia/Bangkok', 'Asia/Shanghai', 'Asia/Seoul', 'Australia/Darwin', 'Asia/Yakutsk', 'Asia/Magadan', 'Asia/Kamchatka', 'Pacific/Tongatapu']

allTimezones.forEach(tz => {
  timeRanges.forEach(time => {
    const [start, end] = time

    const startTime = dayjs().tz(tz, true).hour(start).startOf('hour')
    const endTime   = dayjs().tz(tz, true).hour(end).startOf('hour')

    const secondsArr = startTime.utcSecond(endTime, dayjs())

    const convBack = dayjs().convFromSeconds(secondsArr)

    test(`test ${tz}, at time ${start} - ${end}`, () => {
      expect(convBack.start.tz(tz).format()).toBe(startTime.format())
      expect(convBack.end.tz(tz).format()).toBe(endTime.format())
    })
  })
})

export {}