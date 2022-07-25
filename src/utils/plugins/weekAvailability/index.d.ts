import { PluginFunc, ConfigType, Dayjs } from 'dayjs'

declare const plugin: PluginFunc
export = plugin

type DayjsDurr  = {start: Dayjs, end: Dayjs}

type SecondDurr = {start: number, end: number}

declare module 'dayjs' {
  interface Dayjs {
    getTimeSeconds(): number

    utcSecond(endTime: Dayjs): TimeSeconds[]

    convFromSeconds(secondsArr: TimeSeconds[] | TimeSeconds): {start: Dayjs, end: Dayjs}

    secondsToAvail(secondsAvail: SecondDurr[][], tz: string): DayjsDurr[][]

    generateBlocksFromDurr(endTime: Dayjs, blockSize: number): Dayjs[]
  }

  export function generateAvail(times: DayjsDurr, availDays: boolean[]): DayjsDurr[][]

  export function availToSeconds(dayjsAvail: DayjsDurr[][]): SecondDurr[][]

  export function availToBlockDurr(dayjsAvail: DayjsDurr[][], blockSize: number): Dayjs[][]

  export function addBlockedTimes(dayjsDurr: Dayjs[], blocksArr: DayjsDurr[], itemSize: number): Dayjs[]
}
