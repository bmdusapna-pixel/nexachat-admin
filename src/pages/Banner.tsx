import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import { openDialog, closeDialog } from "@/store/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@/store/store";
import { useEffect, useState } from "react";
import TrashIcon from "@/assets/images/delete.svg";
import EditIcon from "@/assets/images/edit.svg";
import ToggleSwitch from "@/extra/TogggleSwitch";
import CommonDialog from "@/utils/CommonDialog";
import {
    getBanners,
    deleteBanner,
    updateBannerStatus,
} from "@/store/bannerSlice";
import BannerDialog from "@/component/banner/BannerDialog";
import { baseURL } from "@/utils/config";

const Banner = () => {
    const dispatch = useDispatch();

    const { dialogue, dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );
    const { banners, total, isSkeleton } = useSelector(
        (state: RootStore) => state.banner
    );

    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getBanners({ start: page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    const handleChangePage = (_event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event, 10));
        setPage(1);
    };

    const handleDelete = (id: string) => {
        setSelectedId(id);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (selectedId) {
            dispatch(deleteBanner(selectedId));
            setShowDeleteDialog(false);
        }
    };

    const bannerTable = [
        {
            Header: "No",
            Cell: ({ index }: { index: any }) => (
                <span>{(page - 1) * rowsPerPage + parseInt(index) + 1}</span>
            ),
        },
        {
            Header: "Image",
            Cell: ({ row }: { row: any }) => {
                console.log("row", row)
                const src = `https://api.nexachats.com/${row.image}`
                return src ? (
                    <img
                        src={src}
                        alt="Banner"
                        style={{
                            width: "90px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #e5e7eb",
                        }}
                    />
                ) : (
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "90px",
                            height: "50px",
                            background: "#f3f4f6",
                            borderRadius: "6px",
                            color: "#9ca3af",
                            fontSize: "11px",
                        }}
                    >
                        No Image
                    </span>
                );
            },
        },
        {
            Header: "Title",
            Cell: ({ row }: { row: any }) => (
                <span className="fw-normal">{row?.title || "-"}</span>
            ),
        },
        {
            Header: "Link",
            Cell: ({ row }: { row: any }) =>
                row?.link ? (
                    <a
                        href={row.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#8F6DFF",
                            fontSize: "13px",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                        }}
                    >
                        {row.link}
                    </a>
                ) : (
                    <span>-</span>
                ),
        },
        {
            Header: "Active",
            body: "isActive",
            Cell: ({ row }: { row: any }) => (
                <ToggleSwitch
                    value={row?.isActive}
                    onClick={() => dispatch(updateBannerStatus(row?._id))}
                />
            ),
        },
        {
            Header: "Action",
            Cell: ({ row }: { row: any }) => (
                <div className="d-flex justify-content-center gap-2">
                    <button
                        style={{
                            backgroundColor: "#CFF3FF",
                            borderRadius: "8px",
                            padding: "8px",
                            border: "none",
                        }}
                        onClick={() =>
                            dispatch(openDialog({ type: "banner", data: row }))
                        }
                    >
                        <img src={EditIcon.src} alt="Edit" width={22} height={22} />
                    </button>
                    <button
                        style={{
                            backgroundColor: "#FFE7E7",
                            borderRadius: "8px",
                            padding: "8px",
                            border: "none",
                        }}
                        onClick={() => handleDelete(row?._id)}
                    >
                        <img src={TrashIcon.src} alt="Delete" width={22} height={22} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            {dialogue && dialogueType === "banner" && <BannerDialog />}

            <CommonDialog
                open={showDeleteDialog}
                onCancel={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                text={"Delete"}
            />

            {/* Header */}
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div className="dashboardHeader primeHeader p-0">
                        <h4 style={{ margin: 0, fontWeight: 600 }}>Banners</h4>
                    </div>
                    <Button
                        className="text-white submitButton"
                        text="+ Add Banner"
                        type="button"
                        onClick={() => dispatch(openDialog({ type: "banner" }))}
                    />
                </div>
            </div>

            {/* Table */}
            <div>
                <Table
                    data={banners}
                    mapData={bannerTable}
                    PerPage={rowsPerPage}
                    Page={page}
                    type={"server"}
                />
                <Pagination
                    type={"server"}
                    serverPage={page}
                    setServerPage={setPage}
                    serverPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    totalData={total}
                />
            </div>
        </>
    );
};

Banner.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};

export default Banner;
