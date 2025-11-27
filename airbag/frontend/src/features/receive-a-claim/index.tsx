import { useEffect, useState } from "react";
import MasterTableFeature from "@/components/customs/display/master.main.component";
import DialogComponent from "@/components/customs/dialog/dialog.main.component";
import { useToast } from "@/components/customs/alert/toast.main.component";
import MasterSelectComponent from "@/components/customs/select/select.main.component";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useReceiveAClaim } from "@/hooks/useReceiveAClaim";
import { 
  createReceiveForAClaim, 
  deleteReceiveForAClaim, 
  updateReceiveForAClaim,
  getSendForClaimDocs,
} from "@/services/receive-for-a-claim.service";
import { ResponsePayloadItem } from "@/types/response/response.receive-for-a-claim";
import { ReceiveForAClaimSelectItem } from "@/types/response/response.receive-for-a-claim";
import { useSendForACalimClaimSelect } from "@/hooks/useSelect";

type dataTableType = {
    className: string;
    cells: {
        value: any;
        className: string;
    }[];
    data: ResponsePayloadItem;
}[];

export default function ReceiveAClaimFeature() {
    const navigate = useNavigate();
  
    const [searchText, setSearchText] = useState("");
    const [data, setData] = useState<dataTableType>([]);
  
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ResponsePayloadItem | null>(null);
  
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
    const { showToast } = useToast();
  
    const [searchReceiveAClaim, setSearchReceiveAClaim] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";
    const pageSize = searchParams.get("pageSize") ?? "25";
    const [searchTextDebouce, setSearchTextDebouce] = useState("");
    
    const { data: receiveAClaimData, refetch: refetchReceiveAClaim } = useReceiveAClaim({
      page: page,
      pageSize: pageSize,
      searchText: searchTextDebouce,
    });
  
    useEffect(() => {
      if (receiveAClaimData?.responseObject?.data) {
        const formattedData = receiveAClaimData.responseObject.data.map((item: ResponsePayloadItem, index: number) => ({
          className: "",
          cells: [
            { value: item.receive_for_a_claim_doc, className: "text-center" },
            { value: item.send_for_a_claim.send_for_a_claim_doc, className: "text-center" },
            { 
              value: item.send_for_a_claim.supplier_repair_receipt.supplier_delivery_note.supplier_delivery_note_doc || "-", 
              className: "text-center" 
            },
            { 
              value: item.send_for_a_claim.supplier_repair_receipt.receipt_doc || "-", 
              className: "text-center" 
            },
            { value: item.master_supplier?.supplier_code, className: "text-center" },
            { 
              value: item.claim_date || "-", 
              className: "text-center" 
            },
          ],
          data: item,
        }));
        setData(formattedData);
      }
    }, [receiveAClaimData]);
  
    useEffect(() => {
      if (searchText === "") {
        setSearchTextDebouce("");
        setSearchParams({ page: "1", pageSize: pageSize });
        refetchReceiveAClaim();
      }
    }, [searchText]);
  
    const handleSearch = () => {
      searchParams.set("pageSize", pageSize ?? "25");
      searchParams.set("page", "1");
      setSearchParams({ page: "1", pageSize: pageSize });
      if (searchText) {
        setSearchTextDebouce(searchText);
      }
      refetchReceiveAClaim();
    };
  
    const headers = [
      { label: "เลขที่ใบรับเคลม", colSpan: 1, className: "w-2/12" },
      { label: "เลขที่ใบส่งเคลม", colSpan: 1, className: "w-2/12" },
      { label: "เลขที่ใบรับซ่อมซับพลายเออร์", colSpan: 1, className: "w-2/12" },
      { label: "เลขที่ใบส่งซับพลายเออร์", colSpan: 1, className: "w-2/12" },
      { label: "ชื่อร้านค้า", colSpan: 1, className: "w-w/12"},
      { label: "วันที่รับเคลม", colSpan: 1, className: "w-2/12" },
      { label: "แก้ไข", colSpan: 1, className: "min-w-14" },
    ];
  
    // Dialog management functions
    const handleCreateOpen = () => {
      setIsCreateDialogOpen(true);
    };
    
    const handleDeleteOpen = (item: ResponsePayloadItem) => {
      setSelectedItem(item);
      setIsDeleteDialogOpen(true);
    };
  
    const handleCreateClose = () => {
      setIsCreateDialogOpen(false);
    };
      
    const handleDeleteClose = () => {
      setIsDeleteDialogOpen(false);
    };
  
    const handleClickToNavigate = () => {
      navigate(`/receive-a-claim/create`);
    };
  
    const handleEditItem = (item: ResponsePayloadItem) => {
        // ใช้ค่า ID จาก item ที่ได้รับ
        const receiveForAClaimId = item.receive_for_a_claim_id;
        const sendForAClaimId = item.send_for_a_claim?.send_for_a_claim_id;
        
        // สร้าง URL ที่ถูกต้องด้วย ID ที่ได้รับ
        navigate(`/receive-a-claim/create/${receiveForAClaimId}/${sendForAClaimId}`, { 
          state: { 
            receive_for_a_claim_doc: item.receive_for_a_claim_doc,
            receive_for_a_claim_id: receiveForAClaimId,
            send_for_a_claim_id: sendForAClaimId
          } 
        });
      };
  
    // Dialog confirmation handlers
    const handleConfirm = async () => {
      // ตรวจสอบว่าได้เลือก send_for_a_claim_id หรือไม่
      if (!selectedOption) {
        showToast("กรุณาเลือกใบส่งเคลม", false);
        return;
      }
    
      try {
        // เรียกใช้ฟังก์ชัน createReceiveForAClaim โดยส่ง send_for_a_claim_id
        const response = await createReceiveForAClaim(selectedOption);
    
        if (response.statusCode === 201) {
          showToast("สร้างใบรับเคลมเรียบร้อยแล้ว", true);
          setIsCreateDialogOpen(false);
          
          // ดึงข้อมูลที่สร้างขึ้นมาจาก response
          const createdItem = response.responseObject;
          
          // เรียกใช้ฟังก์ชัน handleEditItem โดยส่งข้อมูลที่ได้จากการสร้าง
          if (createdItem) {
            // สร้าง object ที่มีโครงสร้างเหมือน ResponsePayloadItem เพื่อส่งไปยัง handleEditItem
            const newItem = {
              receive_for_a_claim_id: createdItem.receive_for_a_claim_id,
              receive_for_a_claim_doc: createdItem.receive_for_a_claim_doc,
              send_for_a_claim: {
                send_for_a_claim_id: selectedOption,
                send_for_a_claim_doc: '' // ถ้าต้องการใช้ค่านี้ คุณต้องเก็บไว้ตอนที่เลือกจาก dropdown
              }
            } as ResponsePayloadItem;
            
            handleEditItem(newItem);
          } else {
            // ถ้าไม่มีข้อมูลที่สร้าง ให้ refetch ข้อมูลใหม่
            refetchReceiveAClaim();
          }
          
          // ล้างค่า selectedOption หลังจากสร้างสำเร็จ
          setSelectedOption(null);
        } else {
          showToast("ไม่สามารถสร้างใบรับเคลมได้", false);
        }
      } catch (error) {
        console.error("Error creating receive for a claim:", error);
        showToast("ไม่สามารถสร้างใบรับเคลมได้", false);
      }
    };

    const handleDeleteConfirm = async () => {
      if (!selectedItem) {
        showToast("กรุณาระบุรายการใบรับเคลมที่ต้องการลบ", false);
        return;
      }
  
      try {
        const response = await deleteReceiveForAClaim(selectedItem.receive_for_a_claim_doc);
  
        if (response.statusCode === 200) {
          showToast("ลบรายการใบรับเคลมเรียบร้อยแล้ว", true);
          setIsDeleteDialogOpen(false);
          refetchReceiveAClaim();
        } else {
          showToast("ไม่สามารถลบรายการใบรับเคลมได้", false);
        }
      } catch (error) {
        showToast("ไม่สามารถลบรายการใบรับเคลมได้", false);
      }
    };

    const { data: dataReceiveAClaim, refetch: refetchSelectReceiveAClaim } = useSendForACalimClaimSelect({
      searchText: searchReceiveAClaim,
    });

  const fetchDataReceiveAClaimDropdown = async () => {
    const receiveAClaimList = dataReceiveAClaim?.responseObject?.data ?? [];
    return {
      responseObject: receiveAClaimList.map((item: ReceiveForAClaimSelectItem) => ({
        send_for_a_claim_id: item.send_for_a_claim_id,
        send_for_a_claim_doc: item.send_for_a_claim_doc,
      })),
    };
  };

  const handleReceiveAClaimSearch = (searchText: string) => {
    setSearchReceiveAClaim(searchText);
    refetchSelectReceiveAClaim();
  };
  
    return (
      <div>
        <MasterTableFeature
          title="ใบรับเคลม"
          titleBtnName="สร้างใบรับเคลม"
          inputs={[
            {
              id: "search_input",
              value: searchText,
              size: "3",
              placeholder: "ค้นหา ใบรับเคลม ใบส่งเคลม ใบรับซ่อมซับพลายเออร์ ใบส่งซับพลายเออร์ ร้านค้า",
              onChange: setSearchText,
              onAction: handleSearch,
            },
          ]}
          onSearch={handleSearch}
          headers={headers}
          rowData={data}
          totalData={receiveAClaimData?.responseObject?.totalCount || 0}
          onEdit={handleEditItem}
          onPopCreate={handleCreateOpen}
        />
  
        {/* สร้าง */}
        <DialogComponent
          isOpen={isCreateDialogOpen}
          onClose={handleCreateClose}
          title="สร้างใบรับเคลม"
          onConfirm={handleConfirm}
          confirmText="บันทึกข้อมูล"
          cancelText="ยกเลิก"
        >
          <div className="flex flex-col gap-3 items-left">
            <MasterSelectComponent
              onChange={(option) => {
                const value = option ? String(option.value) : null;
                setSelectedOption(value);
              }}
              fetchDataFromGetAPI={fetchDataReceiveAClaimDropdown}
              onInputChange={handleReceiveAClaimSearch}
              valueKey="send_for_a_claim_id"
              labelKey="send_for_a_claim_doc"
              placeholder="กรุณาเลือก..."
              isClearable={true}
              label="เลือกใบส่งเคลม"
              labelOrientation="horizontal"
              classNameLabel="min-w-[100px] flex justify-end text-center"
              classNameSelect="w-[220px]"
            />
          </div>
        </DialogComponent>
  
        {/* ลบ */}
        <DialogComponent
          isOpen={isDeleteDialogOpen}
          onClose={handleDeleteClose}
          title="ยืนยันการลบ"
          onConfirm={handleDeleteConfirm}
          confirmText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้? <br />
            เลขที่ใบรับเคลม : <span className="text-red-500">{selectedItem?.receive_for_a_claim_doc} </span></p>
        </DialogComponent>
      </div>
    );
  }