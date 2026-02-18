'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CustomExercise } from './course-assignment-screen'

type ExerciseCustomizationDialogProps = {
  exercise: CustomExercise | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updates: Partial<CustomExercise>) => void
}

export function ExerciseCustomizationDialog({
  exercise,
  open,
  onOpenChange,
  onSave,
}: ExerciseCustomizationDialogProps) {
  const [customRepetitions, setCustomRepetitions] = useState<number | undefined>(exercise?.customRepetitions)
  const [customSets, setCustomSets] = useState<number | undefined>(exercise?.customSets)
  const [prevExercise, setPrevExercise] = useState(exercise)

  if (prevExercise !== exercise) {
    setPrevExercise(exercise)
    setCustomRepetitions(exercise?.customRepetitions)
    setCustomSets(exercise?.customSets)
  }

  const handleSave = () => {
    onSave({
      customRepetitions: customRepetitions && customRepetitions > 0 ? customRepetitions : undefined,
      customSets: customSets && customSets > 0 ? customSets : undefined,
    })
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!exercise) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Tùy chỉnh bài tập</DialogTitle>
          <DialogDescription>{exercise.exerciseTitle}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='repetitions'>Số lần lặp</Label>
            <Input
              id='repetitions'
              type='number'
              min='0'
              placeholder='Nhập số lần lặp (tùy chọn)'
              value={customRepetitions ?? ''}
              onChange={(e) =>
                setCustomRepetitions(e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <p className='text-xs text-muted-foreground'>
              Để trống nếu không muốn chỉ định số lần lặp cụ thể
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='sets'>Số set</Label>
            <Input
              id='sets'
              type='number'
              min='0'
              placeholder='Nhập số set (tùy chọn)'
              value={customSets ?? ''}
              onChange={(e) => setCustomSets(e.target.value ? Number(e.target.value) : undefined)}
            />
            <p className='text-xs text-muted-foreground'>
              Để trống nếu không muốn chỉ định số set cụ thể
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
