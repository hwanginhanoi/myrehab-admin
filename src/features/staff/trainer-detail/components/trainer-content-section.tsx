import { Separator } from '@/components/ui/separator'

type TrainerContentSectionProps = {
  title: string
  desc: string
  children: React.JSX.Element
  fullWidth?: boolean
}

export function TrainerContentSection({ title, desc, children, fullWidth = false }: TrainerContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-muted-foreground text-sm'>{desc}</p>
      </div>
      <Separator className='my-4 flex-none' />
      <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div className={fullWidth ? '-mx-1 px-1.5' : '-mx-1 px-1.5 lg:max-w-xl'}>{children}</div>
      </div>
    </div>
  )
}
