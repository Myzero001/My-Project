import MasterCompanies from "@/features/ms-companies";
import {ToastProvider} from "@/components/customs/alert/ToastContext";
export default function CustomerFeature() {
    return (
        <><ToastProvider>
            <MasterCompanies />    
            </ToastProvider>
            
        </>
    );
}