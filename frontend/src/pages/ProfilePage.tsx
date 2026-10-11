import { useState, useEffect, useRef, type ChangeEvent, type JSX } from "react";
import {
    FaUser,
    FaPhone,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaEdit,
    FaSave,
    FaTimes,
    FaCamera,
    FaEnvelope,
    FaInfoCircle,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import {
    fetchAndCacheUserProfile,
    getCachedUserProfile,
    updateUserProfile,
    uploadProfileImage,
} from "../hooks/UseProfileService";

const DEFAULT_PROFILE_PIC = "";

interface Address {
    landmark: string;
    street: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
}

interface UserProfile {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    bio: string;
    address: Address;
    profilePicUrl: string;
}

interface BackendUserProfile {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    bio?: string;
    address?: Address;
    profilePicUrl?: string;
}

interface ProfileHeaderProps {
    profile: UserProfile;
    editing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    uploadProgress: number;
    isUploading: boolean;
}

interface ProgressBarProps {
    progress: number;
}

interface ProfileFormProps {
    editing: boolean;
    profileData: UserProfile;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onTextAreaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface AddressFormProps {
    editing: boolean;
    address: Address;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface FormFieldProps {
    icon?: JSX.Element;
    label: string;
    name: string;
    value: string;
    editing: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    bare?: boolean;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
        null
    );
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                await fetchAndCacheUserProfile();
                const data: BackendUserProfile = getCachedUserProfile() || {};

                const initialProfile: UserProfile = {
                    fullName: data.fullName || "",
                    email: data.email || "",
                    phone: data.phoneNumber || "",
                    dob: data.dateOfBirth || "",
                    bio: data.bio || "",
                    address: data.address || {
                        landmark: "",
                        street: "",
                        city: "",
                        district: "",
                        state: "",
                        country: "",
                        pincode: "",
                    },
                    profilePicUrl: data.profilePicUrl || DEFAULT_PROFILE_PIC,
                };
                setProfile(initialProfile);
                setTempProfile(initialProfile);
            } catch (error) {
                const defaultProfile: UserProfile = {
                    fullName: "",
                    email: "",
                    phone: "",
                    dob: "",
                    bio: "",
                    address: {
                        landmark: "",
                        street: "",
                        city: "",
                        district: "",
                        state: "",
                        country: "",
                        pincode: "",
                    },
                    profilePicUrl: DEFAULT_PROFILE_PIC,
                };
                setProfile(defaultProfile);
                setTempProfile(defaultProfile);
            }
        };
        loadProfile();
    }, []);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        if (profile) {
            setTempProfile({ ...profile });
        }
        setSelectedImageFile(null);
        setUploadProgress(0);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setUploadProgress(0);

        try {
            let currentProfileData = { ...tempProfile };

            if (selectedImageFile) {
                //@ts-ignore
                const uploadedProfile: BackendUserProfile =
                    await uploadProfileImage(
                        selectedImageFile,
                        setUploadProgress
                    );
                currentProfileData = {
                    ...currentProfileData!,
                    profilePicUrl:
                        uploadedProfile.profilePicUrl || DEFAULT_PROFILE_PIC,
                };
            }

            if (!currentProfileData) {
                throw new Error(
                    "Cannot save: temporary profile data is missing."
                );
            }

            const apiPayload = {
                fullName: currentProfileData.fullName,
                profilePicUrl: currentProfileData.profilePicUrl,
                phoneNumber: currentProfileData.phone,
                dateOfBirth: currentProfileData.dob,
                bio: currentProfileData.bio,
                address: currentProfileData.address,
            };

            //@ts-ignore
            const finalUpdatedBackendProfile: BackendUserProfile =
                await updateUserProfile(apiPayload);

            const newProfileState: UserProfile = {
                fullName: finalUpdatedBackendProfile.fullName || "",
                email: finalUpdatedBackendProfile.email || "",
                phone: finalUpdatedBackendProfile.phoneNumber || "",
                dob: finalUpdatedBackendProfile.dateOfBirth || "",
                bio: finalUpdatedBackendProfile.bio || "",
                address: finalUpdatedBackendProfile.address || {
                    landmark: "",
                    street: "",
                    city: "",
                    district: "",
                    state: "",
                    country: "",
                    pincode: "",
                },
                profilePicUrl:
                    finalUpdatedBackendProfile.profilePicUrl ||
                    DEFAULT_PROFILE_PIC,
            };

            setProfile(newProfileState);
            setTempProfile(newProfileState);
            setSelectedImageFile(null);
        } catch (error) {
        } finally {
            setIsSaving(false);
            setUploadProgress(0);
            setEditing(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const keys = name.split(".");
        if (tempProfile) {
            if (keys.length > 1 && keys[0] === "address") {
                setTempProfile((prev) => {
                    if (!prev) return null;
                    const addressCopy = { ...prev.address, [keys[1]]: value };
                    return { ...prev, address: addressCopy };
                });
            } else {
                setTempProfile((prev) => {
                    if (!prev) return null;
                    return { ...prev, [name]: value };
                });
            }
        }
    };

    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (tempProfile) {
            setTempProfile((prev) => {
                if (!prev) return null;
                return { ...prev, [name]: value };
            });
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        profilePicUrl: reader.result as string,
                    };
                });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!profile || !tempProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <CgSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
                <ProfileHeader
                    profile={tempProfile}
                    editing={editing}
                    isSaving={isSaving}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onFileChange={handleFileChange}
                    //@ts-ignore
                    fileInputRef={fileInputRef}
                    uploadProgress={uploadProgress}
                    isUploading={!!selectedImageFile}
                />
                <ProfileForm
                    editing={editing}
                    profileData={tempProfile}
                    onChange={handleChange}
                    onTextAreaChange={handleTextAreaChange}
                />
            </div>
        </div>
    );
}

function ProfileHeader({
    profile,
    editing,
    isSaving,
    onEdit,
    onSave,
    onCancel,
    onFileChange,
    fileInputRef,
    uploadProgress,
    isUploading,
}: ProfileHeaderProps) {
    const saveButtonText = isSaving
        ? isUploading && uploadProgress < 100
            ? "Uploading..."
            : "Saving..."
        : "Save";

    return (
        <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                    {profile.profilePicUrl === "" ? (
                        <span>
                            <FaUser className="w-24 h-24 rounded-full object-cover ring-4 bg-gray-400 text-gray-700 ring-gra-800" />
                        </span>
                    ) : (
                        <img
                            src={profile.profilePicUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
                        />
                    )}
                    {editing && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-transform duration-200 ease-in-out hover:scale-110"
                            aria-label="Change profile picture"
                        >
                            <FaCamera />
                        </button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="text-center sm:text-left flex-grow">
                    <h1 className="text-3xl font-bold text-slate-800">
                        {profile.fullName || "Your Name"}
                    </h1>
                    <p className="text-md text-slate-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                        <FaEnvelope />{" "}
                        {profile.email || localStorage.getItem("email")}
                    </p>
                </div>

                <div className="flex flex-col items-center w-full sm:w-auto">
                    <div className="flex gap-3 mt-4 sm:mt-0">
                        {!editing ? (
                            <button
                                onClick={onEdit}
                                className="px-5 py-2 bg-blue-600 text-white rounded-full flex items-center gap-2 hover:bg-blue-700 font-semibold"
                            >
                                <FaEdit /> Edit
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onCancel}
                                    className="px-5 py-2 bg-slate-200 text-slate-700 rounded-full flex items-center gap-2 hover:bg-slate-300 font-semibold"
                                >
                                    <FaTimes /> Cancel
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="px-5 py-2 w-32 justify-center bg-green-600 text-white rounded-full flex items-center gap-2 hover:bg-green-700 disabled:bg-green-400 font-semibold"
                                >
                                    {isSaving ? (
                                        <CgSpinner className="animate-spin" />
                                    ) : (
                                        <FaSave />
                                    )}
                                    {saveButtonText}
                                </button>
                            </>
                        )}
                    </div>
                    {isSaving && uploadProgress > 0 && (
                        <div className="w-full sm:w-48 mt-3">
                            <ProgressBar progress={uploadProgress} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}

function ProfileForm({
    editing,
    profileData,
    onChange,
    onTextAreaChange,
}: ProfileFormProps) {
    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                    icon={<FaUser />}
                    label="Full Name"
                    name="fullName"
                    value={profileData.fullName}
                    editing={editing}
                    onChange={onChange}
                />
                <FormField
                    icon={<FaPhone />}
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    editing={editing}
                    onChange={onChange}
                    type="tel"
                />
                <FormField
                    icon={<FaCalendarAlt />}
                    label="Date of Birth"
                    name="dob"
                    value={profileData.dob}
                    editing={editing}
                    onChange={onChange}
                    type="date"
                />
            </div>

            <div className="border-t border-slate-200 pt-6">
                <TextAreaField
                    icon={<FaInfoCircle />}
                    label="Bio"
                    name="bio"
                    value={profileData.bio}
                    editing={editing}
                    onChange={onTextAreaChange}
                    rows={4}
                />
            </div>

            <AddressForm
                editing={editing}
                address={profileData.address}
                onChange={onChange}
            />
        </div>
    );
}

function AddressForm({ editing, address, onChange }: AddressFormProps) {
    const addressFields = [
        "landmark",
        "street",
        "city",
        "district",
        "state",
        "country",
        "pincode",
    ];
    const fullAddress = [
        address?.street,
        address?.landmark,
        address?.city,
        address?.district,
        address?.state,
        address?.pincode,
        address?.country,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" /> Address
            </h3>
            {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {addressFields.map((field) => (
                        <FormField
                            key={field}
                            label={
                                field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            name={`address.${field}`}
                            value={address?.[field as keyof Address] || ""}
                            editing={editing}
                            onChange={onChange}
                            bare
                        />
                    ))}
                </div>
            ) : (
                <p className="text-slate-800 text-md ml-8">
                    {fullAddress || "No address provided."}
                </p>
            )}
        </div>
    );
}

function FormField({
    icon,
    label,
    name,
    value,
    editing,
    onChange,
    type = "text",
    bare = false,
}: FormFieldProps) {
    return (
        <div className={`flex items-start gap-4 ${bare ? "pt-2" : ""}`}>
            {!bare && <div className="text-blue-500 text-xl mt-2">{icon}</div>}
            <div className="flex-1">
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-slate-500"
                >
                    {label}
                </label>
                {editing ? (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <p className="text-slate-800 font-semibold mt-1 text-md">
                        {value || "Not Provided"}
                    </p>
                )}
            </div>
        </div>
    );
}

interface TextAreaFieldProps {
    icon?: JSX.Element;
    label: string;
    name: string;
    value: string;
    editing: boolean;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    bare?: boolean;
}

function TextAreaField({
    icon,
    label,
    name,
    value,
    editing,
    onChange,
    rows = 4,
    bare = false,
}: TextAreaFieldProps) {
    return (
        <div className={`flex items-start gap-4 ${bare ? "pt-2" : ""}`}>
            {!bare && <div className="text-blue-500 text-xl mt-2">{icon}</div>}
            <div className="flex-1">
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-slate-500"
                >
                    {label}
                </label>
                {editing ? (
                    <textarea
                        id={name}
                        name={name}
                        rows={rows}
                        value={value}
                        onChange={onChange}
                        className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                ) : (
                    <p className="text-slate-800 mt-1 text-md whitespace-pre-wrap">
                        {value || "Not Provided"}
                    </p>
                )}
            </div>
        </div>
    );
}
