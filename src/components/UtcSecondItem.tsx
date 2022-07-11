interface UtcSecondItemProps {
  start: number;
  end: number
}

const UtcSecondItem = ({start, end}: UtcSecondItemProps) => {
  return (
    <div className="text-center inline-block p-2 border-2 border-gray-700 rounded-md">
      <p className="text-gray-600 text-sm">
        Start seconds
      </p>
      <p className="font-semibold">
        {start}
      </p>
      <p className="text-gray-600 text-sm">
        End seconds
      </p>
      <p className="font-semibold">
        {end}
      </p>
    </div>
  );
};

export default UtcSecondItem;
