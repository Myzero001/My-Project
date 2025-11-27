import Editprofile from "@/features/ms-companies/components/eiditProfile";
import {ToastProvider} from "@/components/customs/alert/ToastContext";
export default function CustomerFeature() {
    return (
        <><ToastProvider>
            <Editprofile />    
            </ToastProvider>
            
        </>
    );
}