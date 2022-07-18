import { useEffect, useMemo, useState } from 'react';
import dayjs from './utils/dayjs';

import { Button, RangeSlider } from '@mantine/core';
import TimezoneSelect from './components/TimezoneSelect';
import UtcSecondList from './components/UtcSecondList';
import DateRangeItem from './components/DateRangeItem';
import { Dayjs } from 'dayjs';

const secArr = [{
  start: 0,
  end: 32400
}, {
  start: 0,
  end: 32400
}]

type TimeSeconds = ({
  start: number;
  end: number
} | null) | {start: number, end: number}


function App() {
  const [timezone, setTimezone] = useState<string>('')
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17])

  const secondsArr: TimeSeconds = useMemo(() => {
    const startTime = dayjs().tz(timezone || 'UTC', true).hour(timeRange[0]).startOf('hour')
    const endTime   = dayjs().tz(timezone || 'UTC', true).hour(timeRange[1]).startOf('hour')

    return startTime.utcSecond(endTime)
  }, [timezone, timeRange])

  const datesArr: {start: Dayjs, end: Dayjs} = useMemo(() => {
    console.log(secondsArr)
    const dateRange = dayjs().convFromSeconds(secondsArr)

    console.log(dateRange.start.getBlocksDuration(dateRange.end, 45))
    return dateRange
  }, [secondsArr])

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
