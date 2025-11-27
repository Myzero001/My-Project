import ToolFeature from "@/features/tool"
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function Toolpage() {
    return (
        <ToastProvider>
            <ToolFeature />
        </ToastProvider>

    )
}
