import TimezoneSelect from 'react-timezone-select';

import { useEffect, useState } from 'react';
import {
  type ITimezone,
  type ILabelStyle,
  type ITimezoneOption,
} from 'react-timezone-select/dist/esm/dist/types/timezone';

interface TimezoneSelectV2Props {
  value: string;
  onChange: (tz: string) => void;
  labelStyle?: ILabelStyle;
  onBlur?: () => void;
}

function guessUserTimezone(): string {
  const value = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return value;
}

const TimezoneSelectV2 = ({
  value,
  onChange,
  onBlur,
  labelStyle = 'abbrev',
}: TimezoneSelectV2Props) => {
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>('');

  useEffect(() => {
    if (!value) return onChange(guessUserTimezone());

    else setSelectedTimezone(value);
  }, [value]);

  const validateTz = (val: ITimezoneOption) => {
    const { value } = val;

    if (!value) return;

    onChange(value);

    if (onBlur) onBlur();
  };


  return (
    <TimezoneSelect
      className="my-react-select-container"
      classNamePrefix="my-react-select"
      labelStyle={labelStyle}
      value={selectedTimezone}
      onChange={validateTz}
      onBlur={onBlur}
    />
  );
};

export default TimezoneSelectV2;
