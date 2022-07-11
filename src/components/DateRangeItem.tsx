import { type Dayjs } from "dayjs";

interface DateRangeItemProps {
  start: Dayjs;
  end: Dayjs
}

const DateRangeItem = ({start, end}: DateRangeItemProps) => {
  return (
    <div className="text-center p-2 border-2 border-gray-700 rounded-md">
      <p className="text-gray-600 text-sm">
        Start seconds
      </p>
      <p className="font-semibold">
        {start.format()}
      </p>
      <p className="text-gray-600 text-sm">
        End seconds
      </p>
      <p className="font-semibold">
        {end.format()}
      </p>
    </div>
  );
};

export default DateRangeItem;
