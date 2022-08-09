/* eslint-disable */

const tzAbbrObj = {
  'Samoa Standard Time': 'SST',
  'Hawaii-Aleutian Standard Time': 'HST',
  'Alaska Standard Time': 'AKST',
  'Yukon Time': 'MST',
  'Mountain Standard Time': 'MST',
  'Pacific Standard Time': 'PST',
  'Mexican Pacific Standard Time': 'MDT',
  'Central Standard Time': 'CST',
  'Colombia Standard Time': 'COT',
  'Eastern Standard Time': 'EDT',
  'Venezuela Time': 'VET',
  'Chile Summer Time': 'CLT',
  'Brasilia Standard Time': 'BRT',
  'Uruguay Standard Time': 'UYT',
  'Argentina Standard Time': 'UYT',
  'Newfoundland Standard Time': 'HETN',
  'West Greenland Standard Time': 'ADT',
  'Cape Verde Standard Time': 'CVT',
  'Azores Standard Time': 'GMT',
  'Coordinated Universal Time': 'UTC',
  'Greenwich Mean Time': 'GMT',
  'Western European Standard Time': 'GMT',
  'Central European Standard Time': 'CET',
  'Eastern European Standard Time': 'EET',
  'Central Africa Time': 'CAT',
  'Israel Standard Time': 'JEST',
  'Moscow Standard Time': 'MSK',
  'GMT+03:00': 'MSK',
  'Arabian Standard Time': 'AST',
  'East Africa Time': 'EAT',
  'Gulf Standard Time': 'GST',
  'Azerbaijan Standard Time': 'AZT',
  'Iran Standard Time': 'IRDT',
  'Afghanistan Time': 'AFT',
  'Yekaterinburg Standard Time': 'YEKT',
  'Pakistan Standard Time': 'PKT',
  'GMT+5:30': 'IST',
  'India Standard Time': 'IST',
  'Nepal Time': 'NT',
  'Bangladesh Standard Time': 'BST',
  'East Kazakhstan Time': 'ALMT',
  'Myanmar Time': 'MT',
  'Indochina Time': 'ICT',
  'Krasnoyarsk Standard Time': 'KRAT',
  'China Standard Time': 'CST',
  'Malaysia Time': 'MYT',
  'Taipei Standard Time': 'CST',
  'Australian Western Standard Time': 'AWST',
  'Irkutsk Standard Time': 'IRKT',
  'Korean Standard Time': 'KST',
  'Japan Standard Time': 'JST',
  'Australian Central Standard Time': 'ACST',
  'Australian Central Daylight Time': 'ACDT',
  'Yakutsk Standard Time': 'YAKT',
  'Australian Eastern Daylight Time': 'AEDT',
  'Australian Eastern Standard Time': 'AEST',
  'Vladivostok Standard Time': 'VLAT',
  'Chamorro Standard Time': 'ChST',
  'Magadan Standard Time': 'MAGT',
  'Petropavlovsk-Kamchatski Standard Time': 'PETT',
  'Fiji Standard Time': 'FJT',
  'New Zealand Daylight Time': 'NZST',
  'Tonga Standard Time': 'TOT',
};

export default (dayjsInst, dayjsClass, dayjsFactory) => {
  const dayjs = dayjsInst;

  dayjsClass.prototype.toJSON = function () {
    return this.format();
  };

  dayjsClass.prototype.properTz = function (tz, isSave) {
    if (isSave)
      return this.utc(true)
        .startOf('date')
        .tz(tz, true)
        .hour(this.hour())
        .minute(this.minute())
        .second(this.second());

    return this.utc().tz(tz);
  };

  dayjsClass.prototype.getTzAbbr = function () {
    const startOfYear = this.startOf('year');

    const tzAbbr = tzAbbrObj[startOfYear.format('zzz')];

    if (!tzAbbr) return startOfYear.format('z');

    return tzAbbr;
  };

  dayjsFactory.stringToDate = (isoString) => {
    const lastChar = isoString.charAt(isoString.length - 1);
    if (lastChar === 'Z') {
      return dayjs(isoString).utc();
    }

    const [hours, minutes] = isoString.slice(-6).split(':');

    const minutesOffset =
      Number(hours) < 0
        ? Number(hours) * 60 - Number(minutes)
        : Number(hours) * 60 + Number(minutes);

    return dayjs(isoString).utc().utcOffset(minutesOffset);
  };
};
