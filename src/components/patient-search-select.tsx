import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  useSearchUsersByName,
  useSearchMyPatients,
  useGetUserById,
  type UserResponse,
  type MyPatientResponse,
} from '@/api'
import { useAuthStore } from '@/stores/auth-store'

interface PatientSearchSelectProps {
  selectedPatientId?: number
  onSelect: (
    patient: { id: number; fullName: string; phoneNumber?: string } | null
  ) => void
}

export function PatientSearchSelect({
  selectedPatientId,
  onSelect,
}: PatientSearchSelectProps) {
  const { userType } = useAuthStore()
  const isDoctor = userType === 'DOCTOR'

  const [inputValue, setInputValue] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [manuallySelected, setManuallySelected] = useState<{
    id: number
    fullName: string
    phoneNumber?: string
  } | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset manual selection when the external prop changes
  const [prevPatientId, setPrevPatientId] = useState(selectedPatientId)
  if (prevPatientId !== selectedPatientId) {
    setPrevPatientId(selectedPatientId)
    if (manuallySelected) {
      setManuallySelected(null)
    }
  }

  // Fetch user by ID to restore selection on load
  const { data: userById } = useGetUserById(selectedPatientId ?? 0, {
    query: {
      enabled: !!selectedPatientId,
    },
  })

  // Derive selected patient from manual selection or fetched user data
  const selectedPatient = useMemo(() => {
    if (manuallySelected) return manuallySelected
    if (!selectedPatientId) return null
    if (userById) {
      return {
        id: selectedPatientId,
        fullName: userById.fullName || String(selectedPatientId),
        phoneNumber: userById.phoneNumber,
      }
    }
    return null
  }, [manuallySelected, selectedPatientId, userById])

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
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Admin/SUPER_ADMIN search
  const { data: adminResults = [] } = useSearchUsersByName(
    { query: debouncedQuery || undefined },
    {
      query: {
        enabled: !isDoctor && debouncedQuery.length > 0,
      },
    }
  )

  // Doctor search
  const { data: doctorResults = [] } = useSearchMyPatients(
    { query: debouncedQuery || undefined },
    {
      query: {
        enabled: isDoctor && debouncedQuery.length > 0,
      },
    }
  )

  const handleSelect = (patient: {
    id: number
    fullName: string
    phoneNumber?: string
  }) => {
    setManuallySelected(patient)
    setInputValue('')
    setDebouncedQuery('')
    setShowDropdown(false)
    onSelect(patient)
  }

  const handleClear = () => {
    setManuallySelected(null)
    setInputValue('')
    setDebouncedQuery('')
    onSelect(null)
  }

  const handleInputFocus = () => {
    if (debouncedQuery.length > 0) {
      setShowDropdown(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setShowDropdown(e.target.value.length > 0)
  }

  if (selectedPatient) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1.5 text-sm">
          <span className="font-medium">{selectedPatient.fullName}</span>
          {selectedPatient.phoneNumber && (
            <span className="text-muted-foreground">
              {selectedPatient.phoneNumber}
            </span>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="ms-1 rounded-sm opacity-70 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  const showResults = showDropdown && debouncedQuery.length > 0

  return (
    <div ref={containerRef} className="relative w-[280px]">
      <div className="relative">
        <Search className="absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bệnh nhân..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="h-9 ps-8"
        />
      </div>

      {showResults && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="border-b px-3 py-1.5 text-xs text-muted-foreground">
            Hiển thị tối đa 5 kết quả
          </div>
          {isDoctor ? (
            (doctorResults as MyPatientResponse[]).length === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">
                Không tìm thấy bệnh nhân
              </div>
            ) : (
              (doctorResults as MyPatientResponse[]).map((p) => (
                <button
                  key={p.userId}
                  type="button"
                  className="flex w-full flex-col px-3 py-2 text-start text-sm hover:bg-accent"
                  onClick={() =>
                    handleSelect({
                      id: p.userId!,
                      fullName: p.fullName || String(p.userId),
                      phoneNumber: p.phoneNumber,
                    })
                  }
                >
                  <span className="font-medium">{p.fullName}</span>
                  {p.phoneNumber && (
                    <span className="text-xs text-muted-foreground">
                      {p.phoneNumber}
                    </span>
                  )}
                </button>
              ))
            )
          ) : (adminResults as UserResponse[]).length === 0 ? (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              Không tìm thấy bệnh nhân
            </div>
          ) : (
            (adminResults as UserResponse[]).map((u) => (
              <button
                key={u.id}
                type="button"
                className="flex w-full flex-col px-3 py-2 text-start text-sm hover:bg-accent"
                onClick={() =>
                  handleSelect({
                    id: u.id!,
                    fullName: u.fullName || String(u.id),
                    phoneNumber: u.phoneNumber,
                  })
                }
              >
                <span className="font-medium">{u.fullName}</span>
                {u.phoneNumber && (
                  <span className="text-xs text-muted-foreground">
                    {u.phoneNumber}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
