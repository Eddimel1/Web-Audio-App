import React, { useState } from 'react'
import classes from './equalizerTransition.module.css'
export const EqualizerTransition = () => {
  const [animEnded, setAnimEnded] = useState<boolean>(false)
  return (
    <>
      {!animEnded && (
        <>
          <div
            onAnimationEnd={() => setAnimEnded(true)}
            style={{ animationDelay: '0s' }}
            className={classes.transition}
          ></div>
          <div className={classes.transition}></div>
          <div className={classes.transition}></div>
        </>
      )}
    </>
  )
}
