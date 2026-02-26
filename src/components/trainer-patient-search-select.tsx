import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGetDoctorPatients1 } from '@/api'

interface DoctorPatient {
  userId?: number
  id?: number
  fullName?: string
  phoneNumber?: string
}

interface TrainerPatientSearchSelectProps {
  selectedPatientId?: number
  selectedPatientName?: string
  onSelect: (patient: { id: number; fullName: string; phoneNumber?: string } | null) => void
  disabled?: boolean
}

export function TrainerPatientSearchSelect({
  selectedPatientId,
  selectedPatientName,
  onSelect,
  disabled = false,
}: TrainerPatientSearchSelectProps) {
  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<{
    id: number
    fullName: string
    phoneNumber?: string
  } | null>(() => {
    if (selectedPatientId && selectedPatientName) {
      return { id: selectedPatientId, fullName: selectedPatientName }
    }
    return null
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [inputValue])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: searchResults } = useGetDoctorPatients1(
    { query: debouncedQuery || undefined, pageable: { page: 0, size: 5 } },
    {
      query: {
        enabled: debouncedQuery.length > 0 && !disabled,
      },
    }
  )

  const patients = (searchResults?.content ?? []) as DoctorPatient[]

  const handleSelect = (patient: { id: number; fullName: string; phoneNumber?: string }) => {
    setSelectedPatient(patient)
    setInputValue('')
    setDebouncedQuery('')
    setShowDropdown(false)
    onSelect(patient)
  }

  const handleClear = () => {
    if (disabled) return
    setSelectedPatient(null)
    setInputValue('')
    setDebouncedQuery('')
    onSelect(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowDropdown(e.target.value.length > 0)
  }

  if (selectedPatient) {
    return (
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm'>
          <span className='font-medium'>{selectedPatient.fullName}</span>
          {selectedPatient.phoneNumber && (
            <span className='text-muted-foreground'>{selectedPatient.phoneNumber}</span>
          )}
          {!disabled && (
            <button
              type='button'
              onClick={handleClear}
              className='ms-1 rounded-sm opacity-70 hover:opacity-100'
            >
              <X className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (disabled) {
    return (
      <div className='flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm text-muted-foreground'>
        Không có bệnh nhân được chọn
      </div>
    )
  }

  const showResults = showDropdown && debouncedQuery.length > 0

  return (
    <div ref={containerRef} className='relative w-[280px]'>
      <div className='relative'>
        <Search className='absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Tìm kiếm bệnh nhân...'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (debouncedQuery.length > 0) setShowDropdown(true)
          }}
          className='h-9 ps-8'
          disabled={disabled}
        />
      </div>

      {showResults && (
        <div className='absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md'>
          <div className='border-b px-3 py-1.5 text-xs text-muted-foreground'>
            Hiển thị tối đa 5 kết quả
          </div>
          {patients.length === 0 ? (
            <div className='px-3 py-3 text-sm text-muted-foreground'>
              Không tìm thấy bệnh nhân
            </div>
          ) : (
            patients.map((p) => {
              const id = p.userId ?? p.id
              if (!id) return null
              return (
              <button
                key={id}
                type='button'
                className='flex w-full flex-col px-3 py-2 text-start text-sm hover:bg-accent'
                onClick={() =>
                  handleSelect({
                    id,
                    fullName: p.fullName || String(id),
                    phoneNumber: p.phoneNumber,
                  })
                }
              >
                <span className='font-medium'>{p.fullName}</span>
                {p.phoneNumber && (
                  <span className='text-xs text-muted-foreground'>{p.phoneNumber}</span>
                )}
              </button>
            )})
          )}
        </div>
      )}
    </div>
  )
}
