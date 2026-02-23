import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { closeDialog } from "@/store/dialogSlice";
import { ExInput } from "@/extra/Input";
import Button from "@/extra/Button";
import { createBanner, updateBanner } from "@/store/bannerSlice";
import { baseURL } from "@/utils/config";

const BannerDialog = () => {
    const { dialogueData } = useSelector((state: RootStore) => state.dialogue);
    const dispatch = useAppDispatch();

    const [mongoId, setMongoId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (dialogueData) {
            setMongoId(dialogueData._id || "");
            setTitle(dialogueData.title || "");
            setLink(dialogueData.link || "");
            // Show existing image as preview
            if (dialogueData.image) {
                const imgPath = dialogueData.image.startsWith("http")
                    ? dialogueData.image
                    : `${baseURL}${dialogueData.image}`;
                setImagePreview(imgPath);
            }
        }
    }, [dialogueData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("link", link);
        if (image) {
            formData.append("image", image);
        }

        if (mongoId) {
            formData.append("bannerId", mongoId);
            dispatch(updateBanner(formData));
        } else {
            dispatch(createBanner(formData));
        }

        dispatch(closeDialog());
    };

    return (
        <div className="dialog">
            <div className="w-100">
                <div className="row justify-content-center">
                    <div className="col-xl-4 col-md-6 col-11">
                        <div className="mainDiaogBox">
                            <div className="row justify-content-between align-items-center formHead">
                                <div className="col-8">
                                    <h4 className="text-theme m0">
                                        {mongoId ? "Edit Banner" : "Add Banner"}
                                    </h4>
                                </div>
                                <div className="col-4">
                                    <div
                                        className="closeButton"
                                        onClick={() => dispatch(closeDialog())}
                                        style={{ fontSize: "20px" }}
                                    >
                                        ✖
                                    </div>
                                </div>
                            </div>

                            <form id="bannerForm" onSubmit={handleSubmit}>
                                <div className="row align-items-start formBody">
                                    {/* Title */}
                                    <div className="col-12">
                                        <ExInput
                                            type="text"
                                            id="bannerTitle"
                                            name="title"
                                            value={title}
                                            label="Title"
                                            placeholder="Banner title (optional)"
                                            onChange={(e: any) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    {/* Link */}
                                    <div className="col-12">
                                        <ExInput
                                            type="text"
                                            id="bannerLink"
                                            name="link"
                                            value={link}
                                            label="Link"
                                            placeholder="https://example.com (optional)"
                                            onChange={(e: any) => setLink(e.target.value)}
                                        />
                                    </div>

                                    {/* Image Upload */}
                                    <div className="col-12">
                                        <label
                                            className="form-label"
                                            style={{ fontWeight: 600, fontSize: "14px", color: "#555" }}
                                        >
                                            Banner Image
                                        </label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: "2px dashed #8F6DFF",
                                                borderRadius: "12px",
                                                padding: "12px",
                                                cursor: "pointer",
                                                textAlign: "center",
                                                background: "#faf8ff",
                                                minHeight: "100px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                gap: "8px",
                                            }}
                                        >
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Banner Preview"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "180px",
                                                        borderRadius: "8px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="36"
                                                        height="36"
                                                        fill="#8F6DFF"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
                                                    </svg>
                                                    <span style={{ color: "#8F6DFF", fontSize: "13px", fontWeight: 500 }}>
                                                        Click to upload image
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImage(null);
                                                    setImagePreview("");
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                                }}
                                                style={{
                                                    marginTop: "6px",
                                                    background: "none",
                                                    border: "none",
                                                    color: "#dc3545",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    padding: 0,
                                                }}
                                            >
                                                ✕ Remove image
                                            </button>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-4 d-flex justify-content-end gap-1">
                                        <Button
                                            className="text-light cancelButton"
                                            text="Cancel"
                                            type="button"
                                            onClick={() => dispatch(closeDialog())}
                                        />
                                        <Button
                                            type="submit"
                                            className="text-white m10-left submitButton"
                                            text="Submit"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerDialog;
