interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className = "" }: TypographyProps) {
  return (
    <h1 className={`scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </h1>
  )
}

// Componente Tipografía H2 Reutilizable
export function H2({ children, className = "" }: TypographyProps) {
  return (
    <h2 className={`scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 ${className}`}>
      {children}
    </h2>
  )
}

// Componente Tipografía H3 Reutilizable
export function H3({ children, className = "" }: TypographyProps) {
  return (
    <h3 className={`scroll-m-20 text-lg font-semibold tracking-tight ${className}`}>
      {children}
    </h3>
  )
}

// Componente Tipografía H4 Reutilizable
export function H4({ children, className = "" }: TypographyProps) {
  return (
    <h4 className={`scroll-m-20 text-base font-semibold tracking-tight ${className}`}>
      {children}
    </h4>
  )
}

// Componente P (párrafo) Reutilizable
export function P({ children, className = "" }: TypographyProps) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  )
}

// Componente Blockquote Reutilizable
export function TypographyBlockquote({ children, className = "" }: TypographyProps) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  )
}

// Componente Lead (texto destacado) Reutilizable
export function TypographyLead({ children, className = "" }: TypographyProps) {
  return (
    <p className={`text-xl text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}

// Componente Large Reutilizable
export function TypographyLarge({ children, className = "" }: TypographyProps) {
  return (
    <div className={`text-lg font-semibold ${className}`}>
      {children}
    </div>
  )
}

// Componente Small Reutilizable
export function TypographySmall({ children, className = "" }: TypographyProps) {
  return (
    <small className={`text-sm font-medium leading-none ${className}`}>
      {children}
    </small>
  )
}

// Componente Muted Reutilizable
export function TypographyMuted({ children, className = "" }: TypographyProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </p>
  )
}
