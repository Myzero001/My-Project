import { useNavigate } from "react-router-dom";

    export const useRoleRedirect = () => {
    const navigate = useNavigate();

    const redirectToRoleHomePage = (roleName?: string) => {
        if (!roleName) {
        navigate("/login");
        return;
        }

        if (
        roleName === "Admin" ||
        roleName === "Owner" ||
        roleName === "Manager" ||
        roleName === "Technician"
        ) {
        navigate("/dashboardQuotationCustomer");
        } else if (roleName === "Sale") {
        navigate("/quotation");
        } else if (roleName === "Account") {
        navigate("/ms-customer");
        } else if (
        roleName === "User-ซ่อม" ||
        roleName === "User-ถอด/ประกอบ" ||
        roleName === "User-Box"
        ) {
        navigate("/ms-repair-receipt");
        } else {
        navigate("/");
        }
    };
    return { redirectToRoleHomePage };
};