import React, { useState } from 'react'
import classes from './instructions.module.css'
import instruction from '../../../../../assets/instructions.png'
import audioFormats from '../../../../../assets/audioFormats.png'

export const Instructions = () => {
   const [toggle,setToggle] = useState<boolean>(false)
  return (
    <>
     <img onClick={() => setToggle((prev)=>!prev)} width="50px" height='50px' className={classes.instructionButton} src={instruction}></img>
        <div className={`${classes.instructionContainer} ${toggle ? `${classes.show}` : `${classes.hide}`}`}>
            <div className={classes.instructions}>
                <img src={audioFormats}></img>
                <div className={classes.instructionText}>
                    <div className={classes.textField}>
                    Equalizers will behave differently and will have different sensitivity depending on that option.
                    </div>
                    <div className={classes.textField}>
                    To have best experience , please choose option from the picture on the left.
                    </div>
                    <div className={classes.textField}>
                    Please be carefull when using globalCompositeOperation and shadows.Currently they are not optimized.
                    They can trigger perfomance issues.
                    </div>
  
                </div>
   
            </div>

        </div>
    </>
   

  )
}
