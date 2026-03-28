import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { ConfirmDeleteDialog } from '../../../shared/dialogs';

type DeleteSubtaskButtonProps = {
  subtaskTitle: string;
  onDelete: () => void;
};

export const DeleteSubtaskButton = ({ subtaskTitle, onDelete }: DeleteSubtaskButtonProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
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
          p: 0.5,
          color: '#FF5757',
          fontSize: 18,
          '&:hover': {
            bgcolor: '#FFE8E8',
          },
        }}
      >
        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        title="Удалить подзадачу?"
        message={`Вы уверены, что хотите удалить подзадачу "${subtaskTitle}"?`}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
