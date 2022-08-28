import React, { CSSProperties, useState } from 'react'
import classes from './optionsToggler.module.css'
type propT = {
  styles?: CSSProperties
  children?: React.ReactNode
}
export const OptionsToggler = ({ children, styles }: propT) => {
  const [toggle, setToggle] = useState<boolean>(false)
  return (
    <div
      className={`${toggle ? `${classes.animateOut}` : `${classes.animateIn}`}`}
    >
      {children}
      <div
        style={styles}
        className={classes.showHideToggler}
        onClick={() => {
          setToggle((prev) => !prev)
        }}
      ></div>
    </div>
  )
}
