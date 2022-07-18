import React from "react";
import UtcSecondItem from "./UtcSecondItem";

type TimeSeconds = ({
  start: number;
  end: number
} | null)

interface UtcSecondListProps {
  list: TimeSeconds[]
}

const UtcSecondList = ({list}: UtcSecondListProps) => {
  return (
    <div className="w-full flex justify-center gap-4 flex-wrap">
      {list.map((el, index) => (
        <React.Fragment key={index}>
          {el ? (
            <UtcSecondItem {...el}/>
          ) : (
            <div className="p-2 border-2 border-gray-700 rounded-md px-4 grid place-items-center">
              null
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default UtcSecondList;
