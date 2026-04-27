import { cn } from "@/lib/utils"

interface SectionProps {
  id?: string
  title?: React.ReactNode
  className?: string
  contentClassName?: string
  children?: React.ReactNode
}

export function Section({
  id,
  title,
  className,
  contentClassName,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("w-full py-20", className)}>
      <div className={cn("max-w-[1200px] mx-auto px-8", contentClassName)}>
        {title && (
            <div className="font-mono text-[0.72rem] tracking-widest uppercase text-emerald-400 mb-4">
              // {title}
            </div>
        )}
        {children}
      </div>
    </section>
  )
}
