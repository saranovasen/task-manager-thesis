import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { deleteTask } from '../../../entities/task';
import { ConfirmDeleteDialog } from '../../../shared/dialogs';

type DeleteTaskButtonProps = {
  taskId: string;
  taskTitle: string;
  onDelete: () => void;
};

export const DeleteTaskButton = ({ taskId, taskTitle, onDelete }: DeleteTaskButtonProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    deleteTask(taskId);
    setDeleteDialogOpen(false);
    onDelete();
  };

  return (
    <>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          setDeleteDialogOpen(true);
        }}
        sx={{
          p: 0.8,
          color: '#FF5757',
          '&:hover': {
            bgcolor: '#FFE8E8',
          },
        }}
      >
        <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Удалить задачу?"
        message={`Вы уверены, что хотите удалить задачу "${taskTitle}"? Это действие невозможно отменить.`}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
