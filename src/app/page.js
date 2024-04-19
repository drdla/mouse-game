'use client';

import {useState} from 'react';

import {
  catPositions,
  cheesePosition,
  isCatPosition,
  isCheesePosition,
  isMousePosition,
  field,
  moveThroughField,
} from './lib/mouse-game';

export default function Home() {
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const [counter, setCounter] = useState(0);

  const handleMoveThroughField = () => {
    const { counter, currentPosition } = moveThroughField();
    setCurrentPosition(currentPosition);
    setCounter(counter);
  }

  return (
    <main className="flex flex-col min-h-screen gap-y-4 items-center p-4 md:p-24">
      <div className="flex flex-col md:flex-row gap-x-8 items-center">
        <button onClick={handleMoveThroughField} className="rounded-md bg-blue-600 px-4 py-2 whitespace-nowrap">
          Start Mouse Game
        </button>
        <p>Game took {counter} moves</p>
      </div>
      <div className="flex flex-col bg-gray-900 border border-gray-700 divide-y max-w-full">
        {field.map((row, rowIndex) => (
          <div key={rowIndex} className="flex divide-x border-inherit">
            {row.map((col, colIndex) => {
              const cellIsCheeseCell = isCheesePosition([rowIndex, colIndex], cheesePosition);
              const cellIsCatCell = isCatPosition([rowIndex, colIndex], catPositions);
              const cellIsMouseCell = isMousePosition([rowIndex, colIndex], currentPosition);

              return (
                <div
                  key={colIndex}
                  className="flex size-8 md:size-16 justify-center items-center md:text-4xl border-inherit text-center">
                  {cellIsCheeseCell ? '🧀' : ''}
                  {cellIsCatCell ? '🐈' : ''}
                  {cellIsMouseCell ? '🐭' : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
