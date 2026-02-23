import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import image from "@/assets/images/user.png";
import { RootStore } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "@/store/dialogSlice";
import AdminFormDialog from "@/component/user/AdminFormDialog";
import { useEffect, useState } from "react";
import { deleteAdminUser, getAdminUser } from "@/store/userSlice";
import Pagination from "@/extra/Pagination";
import edit from "@/assets/images/edit.svg";
import deleteIcon from "@/assets/images/delete.svg";
import UserShimmer from "@/component/Shimmer/UserShimmer";
import Table from "@/extra/Table";

const Admin = (props: any) => {
    const { dialogue, dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );
    const dispatch = useDispatch();
    const { admins } = useSelector((state: RootStore) => state.user);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
    const payload = {
        
    };
    dispatch(getAdminUser(payload));
    }, [dispatch]);

    const handleEdit = (row: any) => {
        dispatch(openDialog({ type: "admin-form", data: row }));
    };

    const handleDelete = (row: any) => {
        dispatch(deleteAdminUser(row._id))
    }

    const userTable = [
        {
            Header: "No",
            Cell: ({ index }: { index: any }) => (
                <span> {(page - 1) * rowsPerPage + parseInt(index) + 1}</span>
            ),
        },
        {
            Header: "Name",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.name || "-"}</span>
            ),
        },
        {
            Header: "Email",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.email || "-"}</span>
            ),
        },
        {
            Header: "Role",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize fw-normal">{row?.role || "-"}</span>
            ),
        },
        {
            Header: "Created At",
            Cell: ({ row }: { row: any }) => {
                const date = new Date(row?.createdAt);
                const formattedDate = isNaN(date.getTime())
                ? "-"
                : date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                });
                return <span className="text-nowrap text-normal">{formattedDate}</span>;
            },
        },
        {
            Header: "Edit",
            Cell: ({ row }: { row: any }) => (
                <span className="">
                <button
                    style={{
                    backgroundColor: "#E1F8FF",
                    borderRadius: "10px",
                    padding: "8px",
                    }}
                    onClick={() => handleEdit(row)}
                >
                    <img
                    src={edit.src}
                    height={22}
                    width={22}
                    alt="Info-Image"
                    style={{ height: "22px", width: "22px", objectFit: "contain" }}
                    />
                </button>
                </span>
            ),
        },
        {
            Header: "Delete",
            Cell: ({ row }: { row: any }) => (
                <span className="">
                <button
                    style={{
                    backgroundColor: "#E1F8FF",
                    borderRadius: "10px",
                    padding: "8px",
                    }}
                    onClick={() => handleDelete(row)}
                >
                    <img
                    src={deleteIcon.src}
                    height={22}
                    width={22}
                    alt="Info-Image"
                    style={{ height: "22px", width: "22px", objectFit: "contain" }}
                    />
                </button>
                </span>
            ),
        },
    ]

    return (
        <div className="mainCategory">
            <Button
                className={`bg-button p-10 text-white m10-bottom `}
                bIcon={image}
                text="Create Admin"
                onClick={() => {
                  dispatch(openDialog({ type: "admin-form", data: null }));
                }}
            />

            {dialogueType === "admin-form" && <AdminFormDialog />}

            <div className="">
                <Table
                    data={admins}
                    mapData={userTable}
                    PerPage={rowsPerPage}
                    Page={page}
                    type={"server"}
                    shimmer={<UserShimmer />}
                />
                {/* <div style={{ marginTop: "40px" }}>
                    <Pagination
                        type={"server"}
                        serverPage={page}
                        setServerPage={setPage}
                        serverPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        totalData={total}
                    />
                </div> */}
            </div>
        </div>
    )
}

Admin.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Admin;