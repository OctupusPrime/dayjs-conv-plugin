import { PluginFunc, ConfigType, Dayjs } from 'dayjs'

declare const plugin: PluginFunc
export = plugin

type TimeSeconds = ({
  start: number;
  end: number
} | null)

declare module 'dayjs' {
  interface Dayjs {

    getBlocksDuration(endTime: Dayjs, blockSize: number): Dayjs[]

    convAvailToUTC(secondsTime: TimeSeconds[][]): Dayjs[][]
  }

  export function createWeekAvail(dates: string[], secondsTime: TimeSeconds[]): TimeSeconds[][]

  export function weekDurationTz(durationArr: Dayjs[][], tz: string): Dayjs[][]

  export function changeAvailOpts(availArr: Dayjs[][], tz: string, dur?: number): Dayjs[][]
}
