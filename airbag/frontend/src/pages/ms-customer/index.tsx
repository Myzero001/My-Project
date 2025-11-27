import MasterCustomer from "@/features/ms-customer";
import { ToastProvider } from "@/components/customs/alert/ToastContext";
export default function CustomerFeature() {
    return (
        <>
           
            <ToastProvider>
            <MasterCustomer />
            </ToastProvider>
        </>
    );
}