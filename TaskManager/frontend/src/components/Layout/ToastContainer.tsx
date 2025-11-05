import type { FC } from "react";
import { useToast } from "../../hooks/useToast";

const ToastContainer: FC = () => {
    const { toasts, removeToast } = useToast();

    const getToastClass = (type: string) => {
        switch (type) {
            case "success":
                return "toast-success";
            case "error":
                return "toast-error";
            case "warning":
                return "toast-warning";
            case "info":
                return "toast-info";
            default:
                return "toast-info";
        }
    };

    if (toasts.length === 0) return null;

    return (
        <>
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast ${getToastClass(toast.type)}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <div className="toast message">{toast.message}</div>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ToastContainer;
