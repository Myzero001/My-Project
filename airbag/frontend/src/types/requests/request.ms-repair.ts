export type PayLoadCreateRepair = {
    master_repair_name: string;
    master_group_repair_id: string;
};
//
export type PayLoadUpdateRepair = {
    master_repair_id: string;
    master_repair_name: string;
    master_group_repair_id: string;
};

export type PayLoadDeleteRepair = {
    master_repair_id: string;
}