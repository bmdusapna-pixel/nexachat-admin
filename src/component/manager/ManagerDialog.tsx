import Button from "@/extra/Button";
import { ExInput } from "@/extra/Input";
import PasswordInput from "@/extra/PasswordInput";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { createManagerUser, updateManagerUser } from "@/store/userSlice";

import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { useSelector } from "react-redux";
import { baseURL } from "@/utils/config";
import countriesData from "@/api/countries.json";
import male from "@/assets/images/male.png";
import { toast } from "react-toastify";

interface ErrorState {
    name: string;
    email: string;
    password: string;
    mobile: string;
    country: string;
    image: string;
    countryCode: string;
}

const ManagerDialog = () => {
    const dispatch = useAppDispatch();

    const { dialogue, dialogueData } = useSelector(
        (state: RootStore) => state.dialogue
    );

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobile, setMobile] = useState("");
    const [countryCode, setCountryCode] = useState<any>("");
    const [countryOptions, setCountryOptions] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [imagePath, setImagePath] = useState<string>("");
    const [image, setImage] = useState<any>(null);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEdit = Boolean(dialogueData);

    const [error, setError] = useState<ErrorState>({
        name: "",
        email: "",
        password: "",
        mobile: "",
        country: "",
        image: "",
        countryCode: "",
    });

    // Populate fields when editing
    useEffect(() => {
        if (dialogueData) {
            setName(dialogueData.name || "");
            setEmail(dialogueData.email || "");
            setPassword(dialogueData.password || "");
            setMobile(String(dialogueData.mobile || ""));
            setCountryCode(dialogueData.countryCode || "");
            const imgPath = dialogueData.image
                ? baseURL + dialogueData.image.replace(/\\/g, "/")
                : "";
            setImagePath(imgPath);
        }
    }, [dialogueData]);

    // Load country options
    useEffect(() => {
        setLoadingCountries(true);
        try {
            const transformed = countriesData
                .filter((c) => c.name?.common && c.cca2 && c.flags?.png)
                .map((c) => ({
                    value: c.cca2,
                    label: c.name.common,
                    name: c.name.common,
                    code: c.cca2,
                    flagUrl: c.flags.png || c.flags.svg,
                    flag: c.flags.png || c.flags.svg,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

            setCountryOptions(transformed);

            if (dialogueData?.country) {
                const match = transformed.find(
                    (c: any) => c.name.toLowerCase() === dialogueData.country.toLowerCase()
                );
                setSelectedCountry(match || null);
            } else {
                const india = transformed.find((c: any) => c.name === "India");
                setSelectedCountry(india || transformed[0] || null);
            }
        } catch {
            // silently fail
        } finally {
            setLoadingCountries(false);
        }
    }, [dialogueData]);

    const CustomOption = ({ innerRef, innerProps, data }: any) => (
        <div
            ref={innerRef}
            {...innerProps}
            className="optionShow-option p-2 d-flex align-items-center"
        >
            <img
                height={24}
                width={32}
                alt={data.name}
                src={data.flagUrl}
                className="me-2"
                style={{ objectFit: "cover" }}
            />
            <span>{data.label}</span>
        </div>
    );

    const handleInputImage = (e: any) => {
        if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
            setImagePath(URL.createObjectURL(e.target.files[0]));
            setError((prev) => ({ ...prev, image: "" }));
        }
    };

    const handleSelectChange = (selected: any) => {
        setSelectedCountry(selected);
        setError((prev) => ({
            ...prev,
            country: selected ? "" : "Country is required",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Validation
            const newError: Partial<ErrorState> = {};
            if (!name) newError.name = "Name is required";
            if (!email) newError.email = "Email is required";
            else if (!email.includes("@")) newError.email = "Email must include '@'";
            if (!isEdit && !password) newError.password = "Password is required";
            if (!mobile) newError.mobile = "Mobile number is required";
            if (!countryCode) newError.countryCode = "Country code is required";
            if (!selectedCountry) newError.country = "Country is required";

            if (Object.keys(newError).length) {
                setError((prev) => ({ ...prev, ...newError }));
                setIsSubmitting(false);
                return;
            }

            setError({} as ErrorState);

            const formData = new FormData();

            if (isEdit) {
                // ── Edit flow ───────────────────────────────────────────
                // Only update password (backend updatePasswordById accepts { password })
                formData.append("password", password);

                const result = await dispatch(
                    updateManagerUser({ data: { password }, id: dialogueData!._id })
                ).unwrap();

                if (!result.status) {
                    toast.error(result.message || "Failed to update manager");
                    return;
                }
            } else {
                // ── Create flow ─────────────────────────────────────────
                formData.append("name", name.trim());
                formData.append("email", email.trim().toLowerCase());
                formData.append("password", password!);
                formData.append("mobile", mobile);
                formData.append("countryCode", countryCode);
                formData.append("country", selectedCountry!.name);
                formData.append("countryFlagImage", selectedCountry!.flag);
                if (image) formData.append("image", image);

                const result = await dispatch(createManagerUser(formData)).unwrap();
                if (!result.status) {
                    toast.error(result.message || "Failed to create manager");
                    return;
                }
            }

            dispatch(closeDialog());
        } catch (err: any) {
            toast.error(err?.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="dialog">
                <div style={{ width: "1800px" }}>
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-md-8 col-11">
                            <div className="mainDiaogBox" style={{ width: "600px" }}>
                                {/* Header */}
                                <div className="row justify-content-between align-items-center formHead">
                                    <div className="col-8">
                                        <h2 className="text-theme fs-26 m0">
                                            {isEdit ? "Edit Manager" : "Create Manager"}
                                        </h2>
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

                                {/* Form */}
                                <form className="row formFooter mt-3" onSubmit={handleSubmit}>

                                    {/* Name */}
                                    <div className="col-6">
                                        <ExInput
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={name}
                                            label="Name"
                                            placeholder="Name"
                                            disabled={isEdit}
                                            errorMessage={error.name}
                                            onChange={(e: any) => {
                                                setName(e.target.value);
                                                setError((prev) => ({ ...prev, name: e.target.value ? "" : "Name is required" }));
                                            }}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="col-6">
                                        <ExInput
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={email}
                                            label="Email"
                                            placeholder="Email"
                                            disabled={isEdit}
                                            errorMessage={error.email}
                                            onChange={(e: any) => {
                                                const v = e.target.value;
                                                setEmail(v);
                                                setError((prev) => ({
                                                    ...prev,
                                                    email: !v ? "Email is required" : !v.includes("@") ? "Email must include '@'" : "",
                                                }));
                                            }}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="col-6">
                                        <PasswordInput
                                            label={isEdit ? "New Password" : "Password"}
                                            value={password}
                                            placeholder="Password"
                                            onChange={(e: any) => {
                                                setPassword(e.target.value);
                                                setError((prev) => ({
                                                    ...prev,
                                                    password: !isEdit && !e.target.value ? "Password is required" : "",
                                                }));
                                            }}
                                            error={error.password}
                                        />
                                    </div>

                                    {/* Mobile */}
                                    <div className="col-6">
                                        <ExInput
                                            type="number"
                                            id="mobile"
                                            name="mobile"
                                            value={mobile}
                                            label="Mobile Number"
                                            placeholder="Mobile Number"
                                            disabled={isEdit}
                                            errorMessage={error.mobile}
                                            onChange={(e: any) => {
                                                setMobile(e.target.value);
                                                setError((prev) => ({ ...prev, mobile: e.target.value ? "" : "Mobile number is required" }));
                                            }}
                                        />
                                    </div>

                                    {/* Country Code */}
                                    <div className="col-6">
                                        <ExInput
                                            type="text"
                                            id="countryCode"
                                            name="countryCode"
                                            value={countryCode}
                                            label="Country Code"
                                            placeholder="+91"
                                            disabled={isEdit}
                                            errorMessage={error.countryCode}
                                            onChange={(e: any) => {
                                                setCountryCode(e.target.value);
                                                setError((prev) => ({ ...prev, countryCode: e.target.value ? "" : "Country code is required" }));
                                            }}
                                        />
                                    </div>

                                    {/* Country */}
                                    {!isEdit && (
                                        <div className="col-12 mt-2">
                                            <div className="custom-input">
                                                <label>Country</label>
                                                <ReactSelect
                                                    options={countryOptions}
                                                    value={selectedCountry}
                                                    isClearable={true}
                                                    isLoading={loadingCountries}
                                                    placeholder="Select a country..."
                                                    onChange={handleSelectChange}
                                                    className="mt-2"
                                                    classNamePrefix="react-select"
                                                    formatOptionLabel={(option: any) => (
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                height={20}
                                                                width={28}
                                                                alt={option.name}
                                                                src={option.flagUrl}
                                                                className="me-2"
                                                                style={{ objectFit: "cover" }}
                                                                onError={(e: any) => { e.target.style.display = "none"; }}
                                                            />
                                                            <span>{option.label}</span>
                                                        </div>
                                                    )}
                                                    components={{ Option: CustomOption }}
                                                    styles={{
                                                        option: (provided) => ({
                                                            ...provided,
                                                            cursor: "pointer",
                                                            "&:hover": { backgroundColor: "#f8f9fa" },
                                                        }),
                                                    }}
                                                />
                                                {error.country && (
                                                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                                                        {error.country}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Image (create only) */}
                                    {!isEdit && (
                                        <div className="col-12 mt-2">
                                            <ExInput
                                                type="file"
                                                label="Profile Image"
                                                accept="image/png, image/jpeg"
                                                errorMessage={error.image}
                                                onChange={handleInputImage}
                                            />
                                            <span className="text-danger" style={{ fontSize: "12px" }}>
                                                Accepted formats: png, jpeg
                                            </span>
                                            {imagePath && (
                                                <img
                                                    src={imagePath}
                                                    className="mt-2 rounded"
                                                    alt="preview"
                                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                    onError={(e: any) => { e.target.onerror = null; e.target.src = male.src; }}
                                                />
                                            )}
                                        </div>
                                    )}


                                    {/* Submit */}
                                    <div className="col-12 mt-3 d-flex justify-content-end gap-2">
                                        <Button
                                            type="button"
                                            className="btn btn-secondary"
                                            text="Cancel"
                                            onClick={() => dispatch(closeDialog())}
                                        />
                                        <Button
                                            type="submit"
                                            className="bg-button p-10 text-white"
                                            text={isSubmitting ? "Saving..." : isEdit ? "Update Manager" : "Create Manager"}
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagerDialog;
