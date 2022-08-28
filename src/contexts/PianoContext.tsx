import { KeyGroup } from 'components/Classes/KeyGroup'
import { Oscillator } from 'components/Classes/Oscillator'
import React, { FC, useContext, useState } from 'react'
export interface pianoContextType {
  audioCtx?: React.MutableRefObject<AudioContext | undefined>
  osc?: React.MutableRefObject<Oscillator | undefined>
  keyGroup?: React.MutableRefObject<KeyGroup | undefined>
  setContext?: React.Dispatch<
    React.SetStateAction<pianoContextType | undefined>
  >
  useCtx?: () => pianoContextType
  context?: pianoContextType | undefined
}
export function createCtx<T extends {} | null>() {
  const ctx = React.createContext<T | undefined>(undefined)
  return ctx
}
export function useCtx<T>(ctx: React.Context<T | undefined>) {
  const context = useContext(ctx)
  if (context === undefined) {
    throw new Error('context is undefined')
  }
  return context
}

type providerType<T> = {
  children: React.ReactNode
  ctx: React.Context<T | undefined>
}

export const PianoContextProvider: FC<providerType<pianoContextType>> = ({
  children,
  ctx,
}) => {
  const [context, setContext] = useState<pianoContextType>()
  return <ctx.Provider value={{ context, setContext }}>{children}</ctx.Provider>
}
