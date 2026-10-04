import { useCallback, useState } from "react"

export interface UseDisclosureReturn {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

/**
 * Kontrol open/close untuk modal, drawer, popover, dll.
 * Callback dibungkus `useCallback` agar referensinya stabil.
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen((previous) => !previous), [])

  return { isOpen, onOpen, onClose, onToggle }
}
