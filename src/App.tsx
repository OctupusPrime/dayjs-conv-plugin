import { useEffect, useMemo, useState } from 'react';
import dayjs from './utils/dayjs';

import { Button, JsonInput, RangeSlider, Select, Switch } from '@mantine/core';
import TimezoneSelect from './components/TimezoneSelect';
import WeekDayPicker from './components/WeekDayPicker';
import TimeDurationList from './components/TimeDurationList';

const blocksObj: Record<string, { start: string; end: string }[]> = {
  '26-07-2022': [
    {start: '2022-07-26T08:00:00Z', end: '2022-07-26T10:00:00Z'},
    {start: '2022-07-26T17:00:00Z', end: '2022-07-26T18:00:00Z'}
  ]
}

function App() {
  const [timezone, setTimezone] = useState<string>('')
  const [timeRange, setTimeRange] = useState<[number, number]>([9, 17])
  const [blockSize, setBlockSize] = useState('60')

  const [availJSON, setAvailJSON] = useState('')

  const [isJSON, setIsJSON] = useState(false)

  const [availDays, setAvailDays] = useState<string[]>(['1', '2', '3', '4', '5'])

  const availInDayjs = useMemo(() => {
    if (!timezone)
      return [[], [], [], [], [], [], []]

    if (isJSON) {
      try {
        const secondAvail = JSON.parse(availJSON)
    
        return dayjs().secondsToAvail(secondAvail, timezone)
      } catch (e) {
        return [[], [], [], [], [], [], []]
      }
    }

    // const tzDateRange = {
    //   start: dayjs().tz(timezone, true).format(),
    //   end: dayjs().tz(timezone, true).valueOf()
    // }

    // const tzDateRange2 = dayjs().hour(timeRange[0]).startOf('hour').properTz(timezone)

    // console.log(JSON.stringify(tzDateRange2))

    // console.log(tzDateRange.start, 'tz')

    // console.log(dayjs.stringToDate(tzDateRange.start).format(), 'conv')

    
    const dateRange = {
      start: dayjs().hour(timeRange[0]).startOf('hour').properTz(timezone, true),
      end: dayjs().hour(timeRange[1]).startOf('hour').properTz(timezone, true)
    }

    const boolAvailDays: boolean[] = []

    for (let i = 0; i < 7; i++) {
      boolAvailDays.push(availDays.includes(i + ''))
    }

    return dayjs.generateAvail(dateRange, boolAvailDays)
  }, [timeRange, timezone, availDays, isJSON, availJSON])

  const availInDurations = useMemo(() => {
    return dayjs.availToBlockDurr(availInDayjs, Number(blockSize))
  }, [availInDayjs, blockSize])

  const availInSeconds = useMemo(() => {
    return dayjs.availToSeconds(availInDayjs)
  }, [availInDayjs])

  //Add blocks
  // useEffect(() => {
  //   if (timezone) {
  //     const todayBlocks = blocksObj['26-07-2022'].map(el => ({
  //       start: dayjs.stringToDate(el.start).properTz(timezone),
  //       end: dayjs.stringToDate(el.end).properTz(timezone)
  //     }))
  
  //     const blockedTimes = dayjs.addBlockedTimes(availInDurations[2], todayBlocks, Number(blockSize))

  //     console.log(JSON.stringify(blockedTimes))
  //   }
  // }, [availInDurations, timezone, blockSize])

  //Change date
  // useEffect(() => {
  //   console.log(JSON.stringify(availInDurations), 'old')
  //   dayjs().add(1, 'week').availDurrChangeDate(availInDurations)
  // }, [availInDurations])

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
          <p className='font-medium'>Insert your seconds JSON</p>

          <Switch 
            checked={isJSON}
            onChange={(event) => setIsJSON(event.currentTarget.checked)}/>
        </div>     
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

      {isJSON ? (
        <>
          <JsonInput 
            label="Avail seconds in JSON"
            placeholder="Insert your JSON"
            validationError="Invalid json"
            autosize
            minRows={4}
            value={availJSON}
            onChange={setAvailJSON}/>
        </>
      ) : (
        <>
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

          <div className='mb-4 space-y-2'>
            <div className="flex justify-between items-center mb-2">
              <p className='font-medium'>Select avail week days</p>

              <Button onClick={() => setAvailDays(['1', '2', '3', '4', '5'])}>
                Mon - Fri
              </Button>
            </div>

            <WeekDayPicker 
              state={availDays}
              onChange={setAvailDays}/>

          </div> 
        </>
      )}

    <div className='mb-4 space-y-2'>
      <Select
        label="Select duration"
        placeholder="Pick one"
        value={blockSize}
        onChange={(val) => val ? setBlockSize(val) : false}
        data={[
          { value: '15', label: '15 mins' },
          { value: '30', label: '30 mins' },
          { value: '60', label: '1 hour' },
          { value: '90', label: '1.5 hour' },
          { value: '120', label: '2 hours' },
          { value: '180', label: '3 hours' },
        ]}
      />
    </div>
    
      <div className='mb-4 space-y-2'>
        <p className='font-medium'>Availability in durations</p>

        <TimeDurationList list={availInDurations}/>
      </div>

      <div className='mb-4 space-y-2'>
        <p className='font-medium'>Availability in seconds</p>

        <p className='rounded-md border-2 border-gray-700 p-3'>
          {JSON.stringify(availInSeconds)}
        </p>
      </div>
    </div>
  )
}

export default App
