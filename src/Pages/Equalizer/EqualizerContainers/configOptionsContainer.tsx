import React from 'react'
import { drawWithCirclesOptions } from '../drawFunctions/drawCircles'
import { drawWithSvgOptions } from '../drawFunctions/drawWithSvg'
import { drawWithTextOptions } from '../drawFunctions/drawWithTree'
import { drawWithImageOptions } from '../drawFunctions/withDrawImage'
import { GlobalOptions } from '../Options/globalOptions'
import { equalizerT } from '../types/configTypes'
import { OptionsBarContainer } from '../UI/optionsBarContainer/optionsBarContainer'
//equalizerType
type propsT = {
  equalizerT: equalizerT
}
// export const ConfigOptionsContainer = (props:propsT) => {
//     const equalizerT = props.equalizerT
//   return (
//     <>
//      {equalizerT === 'drawWithCircles' ? <OptionsBarContainer>
//     <GlobalOptions  options={drawWithCirclesOptions} config={drawWithCircleConfig} ></GlobalOptions>

//     </OptionsBarContainer> : equalizerT=== 'drawWithImage' ?
//     <OptionsBarContainer>
//     <GlobalOptions  options={drawWithImageOptions} config={drawWithImageConfig} ></GlobalOptions>

//     </OptionsBarContainer> : equalizerT==='drawWithText' ?
//      <OptionsBarContainer>
//      <GlobalOptions  options={drawWithTextOptions} config={drawWithTextConfig} ></GlobalOptions>

//      </OptionsBarContainer> :

//      equalizerT === 'drawWithSvg' ?  <OptionsBarContainer>
//      <GlobalOptions  options={drawWithSvgOptions} config={drawWithSvgConfig} ></GlobalOptions>

//      </OptionsBarContainer> : null

//     }
//     </>

//   )
// }
