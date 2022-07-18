import { useMemo, useState } from 'react';
import dayjs from './utils/dayjs';
import { type Dayjs } from 'dayjs';

import { Button, RangeSlider } from '@mantine/core';
import TimezoneSelect from './components/TimezoneSelect';
import UtcSecondList from './components/UtcSecondList';
import DateRangeItem from './components/DateRangeItem';

type TimeSeconds = ({
  start: number;
  end: number
} | null)

function App() {
  const [timezone, setTimezone] = useState<string>('')
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17])

  const secondsArr: TimeSeconds[] = useMemo(() => {
    const startTime = dayjs().tz(timezone || 'UTC', true).hour(timeRange[0]).startOf('hour')
    const endTime   = dayjs().tz(timezone || 'UTC', true).hour(timeRange[1]).startOf('hour')

    return startTime.utcSecond(endTime, dayjs())
  }, [timezone, timeRange])

  const datesArr: {start: Dayjs, end: Dayjs} = useMemo(() => {
    const dateRange = dayjs().convFromSeconds(secondsArr)

    return dateRange
  }, [secondsArr])

  const weekSecondsArr = () => {
    const blockDuration = 60

    const currDate = dayjs().tz(timezone || 'UTC', true)

    const weekArr: {start: number, end: number}[][] = [[], [], [], [], [], [], []]

    // Mon - Fri
    for (let i = 1; i < 6; i++) {
      const startTime = currDate.day(i).hour(timeRange[0]).startOf('hour')
      const endTime   = currDate.day(i).hour(timeRange[1]).startOf('hour')

      const [previus, curr, next] = startTime.utcSecond(endTime, dayjs())

      if (previus)
        weekArr[i - 1].push(previus)

      if (curr) 
        weekArr[i].push(curr)

      if (next)
        weekArr[i + 1].push(next)

    }

    console.log('Seconds arr')
    console.log(JSON.stringify(weekArr))

    //Conv back to dayjs
    const times = weekArr.map((el, index) => 
      el.map(time => currDate.day(index).convFromSeconds(time)))

    //Get times durations
    const timesDurations =  times.map(el => 
      el.map(time => time.start.getBlocksDuration(time.end, blockDuration)).flat(1))

    console.log('Durations arr')
    console.log(JSON.stringify(timesDurations))
  }

  return (
    <div className="max-w-lg mx-auto w-[95%]">
      <div className="text-center pt-4 pb-6">
        <h1 className='text-2xl font-bold mb-4'>
          Dayjs conversion plugin 
        </h1>
        <p className='text-gray-700 text-lg'>
          Plugin to convert time to utc seconds and vice versa
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className='font-medium'>Select timezone</p>

          <Button onClick={() => setTimezone('')}>
            Local timezone
          </Button>
        </div>

        <TimezoneSelect 
          value={timezone}
          onChange={setTimezone}
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className='font-medium'>Select time range</p>

          <Button onClick={() => setTimeRange([9, 17])}>
            9 - 17
          </Button>
        </div>

        <RangeSlider 
          min={0}
          max={23}
          labelAlwaysOn
          minRange={1}
          value={timeRange}
          onChange={setTimeRange}
        />
      </div>

      <div className='my-2 text-center'>
        <Button onClick={weekSecondsArr}>
          Create 7 days arr
        </Button>
      </div>

    
      <div className="mb-4">
        <p className='font-medium mb-2'>Date in seconds items</p>

        <UtcSecondList list={secondsArr}/>
      </div>

      <div className="mb-4 space-y-2">
        <p className='font-medium'>Seconds back to dayjs</p>

        <p className='text-center text-gray-600 font-sm'>UTC time</p>
        <DateRangeItem 
          {...datesArr}/>

        <p className='text-center text-gray-600 font-sm'>Selected tz time</p>
        <DateRangeItem 
          start={datesArr.start.tz(timezone || 'UTC')}
          end={datesArr.end.tz(timezone || 'UTC')}/>
      </div>
    </div>
  )
}

export default App
