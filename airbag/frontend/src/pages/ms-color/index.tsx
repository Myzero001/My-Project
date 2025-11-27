import MasterColor from "@/features/ms-color"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
        <MasterColor/>
        </ToastProvider>
    )
}
