import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

interface StatusBadgeProps {
  status: 'idle' | 'listening' | 'processing' | 'completed' | 'error'
  className?: string
}

type StatusBadgeBaseProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>

export function StatusBadge({
  status,
  className = '',
  variant,
  ...props
}: StatusBadgeProps & StatusBadgeBaseProps) {
  const styles: Record<StatusBadgeProps['status'], string> = {
    idle: 'bg-gray-100 text-gray-700',
    listening: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-purple-100 text-purple-700',
    error: 'bg-red-100 text-red-700',
  }

  const labels: Record<StatusBadgeProps['status'], string> = {
    idle: 'Ready',
    listening: 'Recording',
    processing: 'Processing',
    completed: 'Complete',
    error: 'Error',
  }

  return (
    <Badge
      variant={variant}
      className={cn('px-2.5', styles[status], className)}
      {...props}
    >
      <span
        className={`w-2 h-2 rounded-full mr-1.5 ${
          status === 'listening' ? 'animate-pulse bg-green-600' : ''
        }`}
      />
      {labels[status]}
    </Badge>
  )
}

export { Badge, badgeVariants }
