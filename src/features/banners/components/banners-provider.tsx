import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { BannerResponse } from '@/api'

export type DraftBanner = {
  title: { [key: string]: string }
  imageUrl: string
  status: string
}

type BannerDialogType = 'add' | 'edit' | 'view' | 'archive'

type BannersContextType = {
  open: BannerDialogType | null
  setOpen: (str: BannerDialogType | null) => void
  currentRow: BannerResponse | null
  setCurrentRow: React.Dispatch<React.SetStateAction<BannerResponse | null>>
  draftBanner: DraftBanner | null
  setDraftBanner: React.Dispatch<React.SetStateAction<DraftBanner | null>>
}

const BannersContext = React.createContext<BannersContextType | null>(null)

export function BannersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<BannerDialogType>(null)
  const [currentRow, setCurrentRow] = useState<BannerResponse | null>(null)
  const [draftBanner, setDraftBanner] = useState<DraftBanner | null>(null)

  return (
    <BannersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        draftBanner,
        setDraftBanner,
      }}
    >
      {children}
    </BannersContext>
  )
}

export const useBanners = () => {
  const bannersContext = React.useContext(BannersContext)

  if (!bannersContext) {
    throw new Error('useBanners has to be used within <BannersProvider>')
  }

  return bannersContext
}
