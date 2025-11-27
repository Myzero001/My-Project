import VisitingCustomer from "@/features/visiting-customer";
import { ToastProvider } from "@/components/customs/alert/ToastContext";

export default function VisitingCustomerFeature() {
    return (
        <>
            <ToastProvider>
                <VisitingCustomer />
            </ToastProvider>
        </>
    );
}