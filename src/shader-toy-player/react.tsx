import { FC, useEffect, useRef } from 'react'
import ShaderToyPlayer, { IOptions } from './index'
import { useOption } from '../share/hooks'
import each from '../share/native/compat/each'

interface IShaderToyPlayerProps extends IOptions {
  className?: string
  style?: React.CSSProperties
  onCreate?: (shaderToyPlayer: ShaderToyPlayer) => void
}

const LunaShaderToyPlayer: FC<IShaderToyPlayerProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const shaderToyPlayer = useRef<ShaderToyPlayer>()

  useEffect(() => {
    shaderToyPlayer.current = new ShaderToyPlayer(containerRef.current!, {
      renderPass: props.renderPass,
      controls: props.controls,
    })

    props.onCreate?.(shaderToyPlayer.current)

    return () => shaderToyPlayer.current?.destroy()
  }, [])

  each(['renderPass', 'controls'], (key: keyof IOptions) => {
    useOption<ShaderToyPlayer, IOptions>(shaderToyPlayer, key, props[key])
  })

  return (
    <div
      className={props.className || ''}
      style={props.style}
      ref={containerRef}
    />
  )
}

export default LunaShaderToyPlayer
