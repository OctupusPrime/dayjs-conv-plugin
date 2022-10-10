/* eslint-disable */

import { PluginFunc, ConfigType, Dayjs } from 'dayjs';

declare const plugin: PluginFunc;
export = plugin;

type DayjsDurr = { start: Dayjs; end: Dayjs };

type SecondDurr = { start: number; end: number };

declare module 'dayjs' {
  interface Dayjs {

    secondsToAvail2(secondsAvail: SecondDurr[][], tz: string): DayjsDurr[][];
  }
}
