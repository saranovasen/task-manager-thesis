import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { deleteProject } from '../../../entities/project';
import { ConfirmDeleteDialog } from '../../../shared/dialogs';

type DeleteProjectButtonProps = {
  projectId: string;
  projectTitle: string;
  onDelete: () => void;
};

export const DeleteProjectButton = ({ projectId, projectTitle, onDelete }: DeleteProjectButtonProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    deleteProject(projectId);
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
        title="Удалить проект?"
        message={`Вы уверены, что хотите удалить проект "${projectTitle}"? Это действие невозможно отменить.`}
        confirmButtonText="Удалить"
        cancelButtonText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
