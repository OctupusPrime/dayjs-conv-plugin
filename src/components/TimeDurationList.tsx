import dayjs, { type Dayjs } from "dayjs";

interface TimeDurationListProps {
  list: Dayjs[][],
}

const TimeDurationList = ({list}: TimeDurationListProps) => {
  return (
    <div className="rounded-md border-2 border-gray-700 p-3">
      {list.map((el, index) => (
        <div className="mb-2" key={dayjs().day(index).valueOf()}>
          <p className="mb-2">
            {dayjs().day(index).format('dddd')}
          </p>
          {el.length ? (
            <ul className="grid grid-cols-6 gap-2">
              {el.map(time => (
                <li className="border-2 border-gray-700 rounded-md text-center text-sm py-1" key={time.hour() + time.minute()}>
                  {time.format('HH:mm')}
                </li>
              ))}    
            </ul>
          ) : (
            <p className="text-center h-[32px]">empty</p>
          )}
        </div>
      ))}

    </div>
  );
};

export default TimeDurationList;
