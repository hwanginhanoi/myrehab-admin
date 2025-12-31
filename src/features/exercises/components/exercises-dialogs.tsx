import { ExercisesActionDialog } from './exercises-action-dialog'
import { useExercises } from './exercises-provider'

export function ExercisesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExercises()
  return (
    <>
      <ExercisesActionDialog
        key='exercise-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        mode='add'
      />

      {currentRow && (
        <>
          <ExercisesActionDialog
            key={`exercise-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            mode='edit'
          />

          <ExercisesActionDialog
            key={`exercise-view-${currentRow.id}`}
            open={open === 'view'}
            onOpenChange={() => {
              setOpen('view')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            mode='view'
          />
        </>
      )}
    </>
  )
}
