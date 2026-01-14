import * as React from 'react'
import type { ConfirmDialogProps } from '../components/feedback/ConfirmDialog'

/**
 * Hook for managing confirm dialog state
 */
export function useConfirmDialog(): {
  isOpen: boolean
  config: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'> | null
  confirm: (
    config: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>
  ) => Promise<boolean>
  close: () => void
  onConfirm?: () => void
  onCancel?: () => void
} {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<Omit<
    ConfirmDialogProps,
    'isOpen' | 'onConfirm' | 'onCancel'
  > | null>(null)
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null)

  const confirm = React.useCallback(
    (dialogConfig: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>) => {
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve
        setConfig(dialogConfig)
        setIsOpen(true)
      })
    },
    []
  )

  const close = React.useCallback(() => {
    setIsOpen(false)
    setConfig(null)
    if (resolveRef.current) {
      resolveRef.current(false)
      resolveRef.current = null
    }
  }, [])

  const handleConfirm = React.useCallback(() => {
    setIsOpen(false)
    setConfig(null)
    if (resolveRef.current) {
      resolveRef.current(true)
      resolveRef.current = null
    }
  }, [])

  return {
    isOpen,
    config,
    confirm,
    close,
    onConfirm: handleConfirm,
    onCancel: close
  }
}
