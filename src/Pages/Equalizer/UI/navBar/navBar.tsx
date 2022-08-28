import React, { CSSProperties, useState } from 'react'
import classes from './navBar.module.css'
type propT = {
  togglerStyles?: CSSProperties
  navContainerStyles?: CSSProperties
  transitionFromTheEdge?: boolean
}
export const NavBar = ({
  togglerStyles,
  navContainerStyles,
  transitionFromTheEdge,
}: propT) => {
  const [animIsShowing, setAnimIsShowing] = useState<boolean>(false)
  const [toggleNav, setToggleNav] = useState<boolean>(false)

  const hrefClickHandler = (e: React.MouseEvent, url: string) => {
    setAnimIsShowing(true)
    e.preventDefault()
    setTimeout(() => {
      window.location.href = url
      setTimeout(() => {
        setAnimIsShowing(false)
      }, 100)
    }, 1000)
  }
  return (
    <>
      {animIsShowing && (
        <>
          <div
            className={
              transitionFromTheEdge && transitionFromTheEdge
                ? `${classes.transition}`
                : `${classes.transition2}`
            }
          ></div>
          <div
            className={
              transitionFromTheEdge && transitionFromTheEdge
                ? `${classes.transition}`
                : `${classes.transition2}`
            }
          ></div>
          <div
            className={
              transitionFromTheEdge && transitionFromTheEdge
                ? `${classes.transition}`
                : `${classes.transition2}`
            }
          ></div>
        </>
      )}
      <div
        style={togglerStyles}
        className={classes.navigationToggler}
        onClick={() => setToggleNav((prev) => !prev)}
      >
        Navigation{' '}
      </div>
      {toggleNav && (
        <>
          <div style={navContainerStyles} className={classes.navContainer}>
            <div
              className={classes.navigationItem}
              onClick={(e) => hrefClickHandler(e, '/')}
            >
              Home
            </div>
            <div
              className={classes.navigationItem}
              onClick={(e) => hrefClickHandler(e, '/piano')}
            >
              Piano
            </div>
            <div
              className={classes.navigationItem}
              onClick={(e) => hrefClickHandler(e, '/equalizer')}
            >
              Equalizer
            </div>
          </div>
        </>
      )}
    </>
  )
}
