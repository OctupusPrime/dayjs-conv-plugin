import React from "react";
import UtcSecondItem from "./UtcSecondItem";

type TimeSeconds = ({
  start: number;
  end: number
} | null) | {start: number, end: number}

interface UtcSecondListProps {
  list: TimeSeconds
}

const UtcSecondList = ({list}: UtcSecondListProps) => {
  return (
    <div className="w-full flex justify-center gap-4 flex-wrap">
      {Array.isArray(list) ? (
        <>
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
        </>
      ) : (
        <UtcSecondItem start={list?.start || 0} end={list?.end || 0}/>
      )}
    </div>
  );
};

export default UtcSecondList;
