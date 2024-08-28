import React from 'react'

export function DifficultyButton({txt, difficulty, callback}) {
  const handleClick = () => {
    callback(difficulty)
  }
  return (
    <button className="difficultyBtn" onClick={handleClick}>{txt}</button>
  )
}

