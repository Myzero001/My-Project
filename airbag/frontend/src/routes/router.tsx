import HomePage from "@/pages/home";
import MasterIssueReasonPage from "@/pages/ms-issue-reason";
// import MainLayout from "@/components/layouts/layout.main";
import { 
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
import { getAuthStatus } from "@/services/auth.service";
import Error404 from "@/components/layouts/layout.error404";
import Toolpage from "@/pages/tool";
import MasterGroupRepair from "@/pages/ms-group-repair";
import BrandModelPage from "@/pages/ms-brandmodel";

import Mastercolor from "@/pages/ms-color";
import MasterCustomer from "@/pages/ms-customer";
import Create from "../features/ms-customer/components/Dailogedi_delete";
import MasterPosition from "@/pages/ms-position";
import BrandPage from "@/pages/ms-brand";
import LoginPage from "@/pages/login";
import MasterSupplier from "@/pages/ms-supplier";
// import CreateMasterSupplier from "../features/ms-supplier/components/createMSSupplier";
import CreateMasterSupplier from "@/features/ms-supplier/components/indexForm";
import VisitingCustomer from "@/features/visiting-customer";
// import VisitingCustomerCreate from "@/features/visiting-customer/components/create-visiting-customer";
import VisitingCustomerCreate from "@/features/visiting-customer/components/indexForm";

import ResponsiblePersonFeature from "@/pages/responsiblePerson";
import MasterRepair from "@/pages/ms-repair";
import MasterCompanies from "@/pages/ms-companies";
import QuotationCreatePage from "@/pages/quotation/create";
import QuotationPage from "@/features/quotation/containers/quatation-management-page";
import LatePayment from "@/features/late-payment";
import CalendarPage from "@/features/calendar";

import ApproveQuotationCreatePage from "@/pages/ms-approve/create";
import ApproveQuotationPage from "@/features/ms-approve/containers/approve-quotation-management-page";
import JobFeature from "@/features/jobs/index";

import GetSupplierPage from "@/pages/get-supplier";
import CreateGetSupplierPage from "@/features/get-supplier/components/indexForm";
import SendForAClaimPage from "@/pages/send-for-a-claim";
import CreateSendForAClaimPage from "@/features/send-for-a-claim/components/indexForm";
import ReceiveAClaimPage from "@/pages/receive-a-claim";
import CreateReceiveAClaimPage from "@/features/receive-a-claim/components/indexForm";
import RepairReceiptPage from "@/pages/ms-repair-receipt";
import RepairReceiptCreatePage from "@/pages/ms-repair-receipt/create";

import Register from "@/pages/register";
import Create_eidit_user from "@/features/register/component/Create_eidit_user";
import MasterToolingReasonPage from "@/pages/ms-tooling-reason";
import BarcodeFeature from "@/features/__barcode";

import MasterClearByFeature from "@/features/ms-clear-by";
import DeliverySchedulePage from "@/pages/delivery-schedule";
import DeliveryScheduleCreatePage from "@/pages/delivery-schedule/create";

import SupplierDeliveryNotePage from "@/pages/supplier-delivery-note";
import SupplierDeliveryNoteCreatePage from "@/pages/supplier-delivery-note/create";
import SupplierDeliveryNoteAddListPage from "@/pages/supplier-delivery-note/add-supplier-delivery-list";
import SupplierDeliveryNoteListPage from "@/pages/supplier-delivery-note/supplier-delivery-list";
import SupplierDeliveryNoteMenuPage from "@/pages/supplier-delivery-note/supplier-delivery-menu";
import PaymentPage from "@/pages/ms-payment";
import PaymentCreatePage from "@/pages/ms-payment/create";
import CalendarRemoval from "@/features/appointment-calendar-removal";
import SupplierRepairReceiptPage from "@/pages/supplier-repair-receipt";
import SupplierRepairReceiptFormPage from "@/pages/supplier-repair-receipt/SupplierRepairReceiptForm";
import DeliveryScheduleCreatePagePDFPage from "@/features/delivery-schedule/containers/create-PDF-page";
import QuotationCreatePagePDF from "@/features/quotation/containers/quatation-PDF-page";
import MainLayout from "@/components/layouts/layout";
import Edituser from "@/features/register/component/Edit_user";
import ApproveEditPaymentPage from "@/pages/ms-approve-edit-payment";
import ApproveEditPaymentCreatePage from "@/features/ms-approve-edit-payment/containers/approve-edit-payment-create-page";
import Editprofile from "@/pages/ms-companies/edit/index";
import DashboardQuotationCustomerPage from "@/pages/dashboardQuotationCustomer";
import DashboardDebtorPage from "@/pages/dashboardDebtor";
import DashboardMissingDebtorsPage from "@/pages/dashboardMissingDebtor";
import SearchRegisterPage from "@/pages/search-register";

const homePageLoader = async () => {
  try {
    const authResponse = await getAuthStatus();
    if (authResponse.statusCode === 200 && authResponse.message === "User authenticated successfully") {
      const roleName = authResponse.responseObject.role_name;
      if (roleName === 'Admin' || roleName === "Owner" || roleName === "Manager" || roleName === "Technician") {
        return redirect("/dashboardQuotationCustomer");
      } else if (roleName === "Sale") {
        return redirect("/quotation");
      } else if (roleName === "Account") {
        return redirect("/ms-customer");
      } else if (roleName === "User-ซ่อม" || roleName === "User-ถอด/ประกอบ" || roleName === "User-Box") {
        return redirect("/ms-repair-receipt");
      } else {
        return null;
      }
    } else {
      return redirect('/login');
    }
  } catch (error) {
    console.error("Auth check failed, redirecting to login:", error);
    return redirect('/login');
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    // element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homePageLoader,
      },
      {
        path: "/ms-tool",
        element: <Toolpage />,
      },
      {
        path: "/ms-issue-reason",
        element: <MasterIssueReasonPage />,
      },
      {
        path: "/ms-group-repair",
        element: <MasterGroupRepair />,
      },
      {
        path: "/ms-color",
        element: <Mastercolor />,
      },
      {
        path: "/ms-customer",
        element: <MasterCustomer />,
      },
      {
        path: "/ms-position",
        element: <MasterPosition />,
      },
      {
        path: "/ms-brand",
        element: <BrandPage />,
      },
      {
        path: "/ms-repair",
        element: <MasterRepair />,
      },
      {
        path: "/ms-customer/create",
        element: <Create />,
      },
      {
        path: "/ms-brandmodel",
        element: <BrandModelPage />,
      },
      {
        path: "/ms-companies",
        element: <MasterCompanies />,
      },
      {
        path: "/ms-supplier",
        element: <MasterSupplier />,
      },
      {
        path: "/ms-supplier/create",
        element: <CreateMasterSupplier />,
      },
      {
        path: "/quotation",
        element: <QuotationPage />,
      },
      {
        path: "/quotation/:quotationId",
        element: <QuotationCreatePage />,
      },
      {
        path: "/approve-quotation",
        element: <ApproveQuotationPage />,
      },
      {
        path: "/approve-quotation/:quotationId",
        element: <ApproveQuotationCreatePage />,
      },
      {
        path: "/responsible-person",
        element: <ResponsiblePersonFeature />,
      },
      {
        path: "/visiting-customers",
        element: <VisitingCustomer />,
      },
      {
        path: "/visiting-customers/create",
        element: <VisitingCustomerCreate />,
      },
      {
        path: "/job",
        element: <JobFeature />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/late-payment",
        element: <LatePayment />,
      },
      {
        path: "/ms-repair-receipt",
        element: <RepairReceiptPage />,
      },
      {
        path: "/get-supplier",
        element: <GetSupplierPage />,
      },
      {
        path: "/get-supplier/create/:supplier_repair_receipt_id/:supplier_delivery_note_id",
        element: <CreateGetSupplierPage />,
      },
      {
        path: "/send-for-a-claim",
        element: <SendForAClaimPage />,
      },
      {
        path: "/send-for-a-claim/create",
        element: <CreateSendForAClaimPage />,
      },
      {
        path: "/receive-a-claim",
        element: <ReceiveAClaimPage />,
      },
      {
        path: "/receive-a-claim/create/:receiveForAClaimId/:sendForAClaimId",
        element: <CreateReceiveAClaimPage />,
      },
      {
        path: "/ms-repair-receipt/:repairReceiptId",
        element: <RepairReceiptCreatePage />,
      },
      {
        path: "/ms-tooling-reason",
        element: <MasterToolingReasonPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/clearby",
        element: <MasterClearByFeature />,
      },
      {
        path: "/create/user",
        element: <Create_eidit_user />,
      },
      {
        path: "/barcode",
        element: <BarcodeFeature />,
      },
      {
        path: "/supplier-delivery-note",
        element: <SupplierDeliveryNotePage />,
      },
      {
        path: "/supplier-delivery-note/create",
        element: <SupplierDeliveryNoteCreatePage />,
      },
      {
        path: "/supplier-delivery-note/add-list",
        element: <SupplierDeliveryNoteAddListPage />,
      },
      {
        path: "/supplier-delivery-note/list",
        element: <SupplierDeliveryNoteListPage />,
      },
      {
        path: "/supplier-delivery-note/menu",
        element: <SupplierDeliveryNoteMenuPage />,
      },
      {
        path: "/delivery-schedule",
        element: <DeliverySchedulePage />,
      },
      {
        path: "/delivery-schedule/:deliveryScheduleId",
        element: <DeliveryScheduleCreatePage />,
      },
      {
        path: "/ms-payment",
        element: <PaymentPage />,
      },
      {
        path: "/ms-payment/:paymentId",
        element: <PaymentCreatePage />,
      },
      {
        path: "/calendar-removal",
        element: <CalendarRemoval />,
      },
      {
        path: "/supplier-delivery-note/:sndId",
        element: <SupplierDeliveryNoteMenuPage />,
      },
      {
        path: "/supplier-repair-receipt",
        element: <SupplierRepairReceiptPage />,
      },
      {
        path: "/supplier-repair-receipt-form/:id",
        element: <SupplierRepairReceiptFormPage />,
      },
      {
        path: "/edit/user",
        element: <Edituser />,
      },
      {
        path: "/ms-approve-edit-payment",
        element: <ApproveEditPaymentPage />,
      },
      {
        path: "/ms-approve-edit-payment/:paymentEditsId",
        element: <ApproveEditPaymentCreatePage />,
      },
      {
        path: "/eidit/companies/:company_id",
        element: <Editprofile />
      },
      {
        path: "/dashboardQuotationCustomer",
        element: <DashboardQuotationCustomerPage />
      },
      {
        path: "/dashboardDebtor",
        element: <DashboardDebtorPage />
      },
      {
        path: "/dashboardMissingDebtor",
        element: <DashboardMissingDebtorsPage />
      },
      {
        path: "/search-register",
        element: <SearchRegisterPage/>
      }
    ],
  },
  {
    path: "/delivery-schedule-pdf",
    element: <DeliveryScheduleCreatePagePDFPage />,
  },
  {
    path: "/quotation-pdf",
    element: <QuotationCreatePagePDF />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
