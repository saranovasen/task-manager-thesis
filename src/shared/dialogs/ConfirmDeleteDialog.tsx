import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDeleteDialog = ({
  open,
  title,
  message,
  confirmButtonText = 'Удалить',
  cancelButtonText = 'Отмена',
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, color: '#232360', fontSize: 18, fontWeight: 600 }}>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: '#6F7F99', fontSize: 14 }}>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5 }}>
        <Button
          onClick={onCancel}
          variant="contained"
          sx={{
            minWidth: 100,
            height: 39,
            borderRadius: 2.5,
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
            bgcolor: '#E4E2F7',
            color: '#5051F9',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#DCD9F4',
              boxShadow: 'none',
            },
          }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            minWidth: 100,
            height: 39,
            borderRadius: 2.5,
            textTransform: 'none',
            fontSize: 14,
            fontWeight: 600,
            bgcolor: '#FF5757',
            color: '#FFFFFF',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#E74545',
              boxShadow: 'none',
            },
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
