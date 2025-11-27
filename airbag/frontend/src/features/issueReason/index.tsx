import { useEffect, useState } from "react";
import { getIssueReason } from "@/services/issueReason.service";
import { TypeIssueReasonAll } from "@/types/response/response.issueReason";
import DialogAdd from "@/features/issueReason/components/dialogAddIssueReason";
import EditIssueReason from "@/features/issueReason/components/dialogEditIssueReason";
import DeleteIssueReason from "@/features/issueReason/components/dialogDeleteIssueReason";
import DialogPaginationIssueReason from "@/features/issueReason/components/dialogPaginationIssuReason";
import { Table, Card, Flex, Box, TextField, IconButton, Button, Text } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { LuPencil } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";


import { ToastProvider } from "@/components/customs/alert/ToastContext";


const PAGE_SIZE = 12;

export default function IssueReasonFeatures() {
  const [issueReason, setIssueReason] = useState<TypeIssueReasonAll[]>([]);
  const [filteredIssueReason, setFilteredIssueReason] = useState<TypeIssueReasonAll[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialogEdit, setOpenDialogEdit] = useState<string | null>(null);
  const [openDialogDelete, setOpenDialogDelete] = useState<string | null>(null);
  const [currentIssueReasonName, setCurrentIssueReasonName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchIssueReasons = async () => {
    try {
      // @ts-ignore
      const res = await getIssueReason(1, 1000 ,"");
      if (res.success) {
        setIssueReason(res.responseObject?.data);
        setFilteredIssueReason(res.responseObject?.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };



  useEffect(() => {
    fetchIssueReasons();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredIssueReason(issueReason);
    } else {
      const filtered = issueReason.filter(item =>
        // @ts-ignore
        item.issue_fixed_reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // @ts-ignore
        item.issue_group.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIssueReason(filtered);
    }
    setCurrentPage(1);
  };

  const handleEditClick = (issueReason: TypeIssueReasonAll) => {
    setOpenDialogEdit(issueReason.issue_reason_id);
    // @ts-ignore
    setCurrentIssueReasonName(issueReason.issue_fixed_reason);
  };

  const handleDeleteClick = (issueReasonId: string) => {
    setOpenDialogDelete(issueReasonId);
    
  };

  const paginatedIssueReasons = filteredIssueReason.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <ToastProvider>
      <div className="container w-full m-auto">
        <Text size="6" weight="bold" className="text-center">
          แก้ไขสาเหตุ
        </Text>

        <Card variant="surface" className="w-full mt-2 rounded-none bg-white relative overflow-visible">
          <Flex className="w-full" direction="row" gap="2">
            <Flex direction="row" gap="2" align="center">
              <Box maxWidth="250px">
                <TextField.Root
                  size="2"
                  placeholder="ค้นหาสาเหตุ"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </Box>
              <Button
                size="2"
                className="bg-[#0DCAF0] hover:bg-[#4FDDF5] text-white"
                onClick={handleSearch}
              >
                ค้นหา
              </Button>
            </Flex>
            <DialogAdd getIssueReasonsData={fetchIssueReasons} />
          </Flex>

          <Table.Root className="border border-gray-300 mt-3 bg-[#fefffe]">
            <Table.Header className="border border-gray-300 sticky top-0 z-0">
              <Table.Row className="text-center bg-[#00337d] text-white sticky top-0 z-10">
                <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 h-7">
                  ลำดับที่
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border border-gray-300 w-3/12 h-7">
                  ประเภทสาเหตุ
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border border-gray-300 h-7">
                  สาเหตุ
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 h-7">
                  แก้ไข
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 h-7">
                  ลบ
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>


            <Table.Body>
              {paginatedIssueReasons.map((item, index) => (
                <Table.Row key={item.issue_reason_id} className="border border-gray-300 hover:bg-gray-100">
                  <Table.RowHeaderCell className="border border-gray-300 text-center w-1/12 h-10 p-2">
                    {index + 1 + (currentPage - 1) * PAGE_SIZE}
                  </Table.RowHeaderCell>
                  <Table.Cell className="border border-gray-300 w-3/12 h-10 p-2">
                    {/* @ts-ignore */}
                    {item.issue_group}
                  </Table.Cell>
                  <Table.Cell className="border border-gray-300 h-10 p-2">
                    {/* @ts-ignore */}
                    {item.issue_fixed_reason}
                  </Table.Cell>
                  <Table.Cell className="text-center border border-gray-300 w-1/12 h-10 p-2">
                    <Dialog.Root
                      open={openDialogEdit === item.issue_reason_id}
                      onOpenChange={() =>
                        setOpenDialogEdit(openDialogEdit === item.issue_reason_id ? null : item.issue_reason_id)
                      }
                    >
                      <Dialog.Trigger asChild>
                        <IconButton variant="ghost" aria-label="Edit" onClick={() => handleEditClick(item)}>
                          {/* <Pencil1Icon width="18" height="18" /> */}
                          <LuPencil style={{ fontSize: "18px" }} />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg">
                          <EditIssueReason
                            issue_reason_id={item.issue_reason_id}
                            // @ts-ignore
                            issue_fixed_reason={item.issue_fixed_reason}
                            // @ts-ignore
                            issue_group={item.issue_group}
                            onEditIssueReason={fetchIssueReasons}
                            onClose={() => setOpenDialogEdit(null)}
                          />
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </Table.Cell>
                  <Table.Cell className="text-center border border-gray-300 w-1/12  h-10 p-2">
                    <Dialog.Root
                      open={openDialogDelete === item.issue_reason_id}
                      onOpenChange={() =>
                        setOpenDialogDelete(openDialogDelete === item.issue_reason_id ? null : item.issue_reason_id)
                      }
                    >
                      <Dialog.Trigger asChild>
                        <IconButton variant="ghost" aria-label="Delete" onClick={() => handleDeleteClick(item.issue_reason_id)}>
                          {/* <TrashIcon width="18" height="18" color="red" /> */}
                          <RiDeleteBin6Line style={{ color: "red", fontSize: "18px" }} />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg">
                          <DeleteIssueReason
                            issue_reason_id={item.issue_reason_id}
                            // @ts-ignore
                            issue_fixed_reason={item.issue_fixed_reason}
                            // @ts-ignore
                            issue_group={item.issue_group}
                            onDeleteIssueReason={fetchIssueReasons}
                            onClose={() => setOpenDialogDelete(null)}
                            currentPage={currentPage}
                            goToPage={(page) => setCurrentPage(page)}
                            currentItemsCount={filteredIssueReason.length}
                          />
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>


        </Card>
        <Flex justify="center" className="m-8">

          {filteredIssueReason.length > PAGE_SIZE && (
            <DialogPaginationIssueReason
              totalItems={filteredIssueReason.length}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </Flex>

        {openDialogDelete && (
          <DeleteIssueReason
            issue_reason_id={openDialogDelete}
            issue_fixed_reason={currentIssueReasonName}
            issue_group={currentIssueReasonName}
            onDeleteIssueReason={fetchIssueReasons}
            onClose={() => setOpenDialogDelete(null)}
            currentPage={currentPage}
            goToPage={(page) => setCurrentPage(page)} 
            currentItemsCount={filteredIssueReason.length}
          />
        )}

        {openDialogEdit && (
        <EditIssueReason
          issue_reason_id={openDialogEdit}
          issue_fixed_reason={currentIssueReasonName}
          issue_group={currentIssueReasonName}
          onEditIssueReason={fetchIssueReasons}
          onClose={() => setOpenDialogEdit(null)}

        />
      )}
      </div>
    </ToastProvider>
  );
}