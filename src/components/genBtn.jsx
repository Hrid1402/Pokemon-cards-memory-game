import React from 'react'

export function GenBtn({txt, gen, callback}) {
  const handleClick = () => {
    callback(gen)
  }
  return (
    <button className='corner-button' onClick={handleClick}><p>Gen </p><span className='genNumber'>{txt}</span></button>
  )
}

