import { CheckboxGroup, Checkbox } from '@mantine/core';

interface WeekDayPickerProps {
  state: string[],
  onChange: (value: string[]) => void
}

const WeekDayPicker = ({state, onChange}: WeekDayPickerProps) => {
  return (
    <CheckboxGroup
      value={state}
      onChange={onChange}
      >
      <Checkbox value="0" label="Sun" />
      <Checkbox value="1" label="Mon" />
      <Checkbox value="2" label="Tue" />
      <Checkbox value="3" label="Wed" />
      <Checkbox value="4" label="Thu" />
      <Checkbox value="5" label="Fri" />
      <Checkbox value="6" label="Sat" />
    </CheckboxGroup>
  );
};

export default WeekDayPicker;
