import logoCoffee from '../assets/logo-coffee.png'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  lightText?: boolean
}

export function VinkaLogo({ size = 'md', lightText = false }: Props) {
  const heightClass = size === 'sm' ? 'h-9' : size === 'lg' ? 'h-16' : 'h-11'

  return (
    <span className="inline-flex items-center select-none">
      <img
        src={logoCoffee}
        alt="Vinka"
        className={`${heightClass} w-auto object-contain transition-opacity ${lightText ? 'brightness-0 invert opacity-95' : ''
          }`}
        style={{
          filter: lightText
            ? 'brightness(0) invert(1)'
            : 'drop-shadow(0 4px 10px rgba(45, 29, 22, 0.08))',
        }}
      />
    </span>
  )
}
