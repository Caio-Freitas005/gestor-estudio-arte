import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

function DeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  content,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="!rounded-2xl !p-2">
      <DialogTitle className="!font-black !text-gray-800">{title}</DialogTitle>
      <DialogContent>
        <Typography className="text-gray-600">{content}</Typography>
      </DialogContent>
      <DialogActions className="!pb-4 !px-6">
        <Button onClick={onClose} className="!text-gray-500 !font-bold">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="!bg-red-50 !text-red-600 !font-bold !rounded-lg hover:!bg-red-100"
        >
          Sim, Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
