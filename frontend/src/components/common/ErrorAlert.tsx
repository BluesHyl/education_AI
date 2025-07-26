import { useState, useEffect } from 'react';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ErrorAlertProps {
  message: string;
  title?: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
  autoHideDuration?: number;
}

const ErrorAlert = ({
  message,
  title,
  severity = 'error',
  onClose,
  autoHideDuration,
}: ErrorAlertProps) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          setTimeout(onClose, 300); // 等待动画结束后调用onClose
        }
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      setTimeout(onClose, 300); // 等待动画结束后调用onClose
    }
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default ErrorAlert;