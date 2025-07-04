import React, {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { categories, type Category } from "../../data/Categories";
import axios from "axios";
import { BACKEND_URL } from "../../config/Config";
import { logoutSession } from "../../hooks/auth/SessionValidation";
import { type DialogPropsForProvider } from "../../hooks/DialogContext";
import { useNavigate } from "react-router-dom";
import { uploadProfileImage } from "../../hooks/UseProfileService";

interface Location {
    landmark: string;
    street: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
    latitude: string;
    longitude: string;
}

interface ProduceDetail {
    produceName: string;
    quantityAvailable: string;
    seasonality: string;
}

interface SellerApplicationFormData {
    businessName: string;
    businessLogoUrl: string;
    farmLocation: Location;
    description: string;
    categories: Category[];
    produceDetails: ProduceDetail[];
}

interface SellerApplicationFormProps {
    openDialog: (props: DialogPropsForProvider) => void;
    closeDialog: () => void;
}

const SellerApplicationForm: React.FC<SellerApplicationFormProps> = ({
    openDialog,
    closeDialog,
}: SellerApplicationFormProps) => {
    const [formData, setFormData] = useState<SellerApplicationFormData>({
        businessName: "",
        businessLogoUrl: "",
        farmLocation: {
            landmark: "",
            street: "",
            city: "",
            district: "",
            state: "Andhra Pradesh",
            country: "India",
            pincode: "",
            latitude: "",
            longitude: "",
        },
        description: "",
        categories: [],
        produceDetails: [
            { produceName: "", quantityAvailable: "", seasonality: "" },
        ],
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (logoFile) {
            const objectUrl = URL.createObjectURL(logoFile);
            setLogoPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setLogoPreview(null);
        }
    }, [logoFile]);

    const handleFileChange = (event: { target: { files: any[] } }) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setLogoFile(file);
        } else {
            setLogoFile(null);
            alert(
                "Please select a valid image file for your business logo (e.g., JPG, PNG, GIF)."
            );
        }
    };

    const navigate = useNavigate();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name.startsWith("farmLocation.")) {
            const field = name.split(".")[1] as keyof Location;
            setFormData((prev) => ({
                ...prev,
                farmLocation: {
                    ...prev.farmLocation,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleProduceDetailChange = (
        index: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        const updatedProduceDetails = formData.produceDetails.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setFormData((prev) => ({
            ...prev,
            produceDetails: updatedProduceDetails,
        }));
    };

    const addProduceDetail = () => {
        setFormData((prev) => ({
            ...prev,
            produceDetails: [
                ...prev.produceDetails,
                { produceName: "", quantityAvailable: "", seasonality: "" },
            ],
        }));
    };

    const removeProduceDetail = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            produceDetails: prev.produceDetails.filter((_, i) => i !== index),
        }));
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            let updatedCategories: Category[];
            if (checked) {
                //@ts-ignore
                updatedCategories = prev.categories.includes(value as Category)
                    ? prev.categories
                    : //@ts-ignore
                      [...prev.categories, value as Category];
            } else {
                updatedCategories = prev.categories.filter(
                    //@ts-ignore
                    (cat) => cat !== value
                );
            }
            return { ...prev, categories: updatedCategories };
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setIsError(false);

        const requiredFields: Array<keyof SellerApplicationFormData> = [
            "businessName",
            "description",
        ];
        const missingFields = requiredFields.filter(
            (field) => !formData[field]
        );

        const requiredLocationFields: Array<keyof Location> = [
            "street",
            "city",
            "district",
            "state",
            "country",
            "pincode",
            "latitude",
            "longitude",
        ];
        const missingLocationFields = requiredLocationFields.filter(
            (field) => !formData.farmLocation[field]
        );

        const hasEmptyProduceDetails = formData.produceDetails.some(
            (detail) => !detail.produceName || !detail.quantityAvailable
        );

        if (
            missingFields.length > 0 ||
            missingLocationFields.length > 0 ||
            formData.categories.length === 0 ||
            hasEmptyProduceDetails
        ) {
            setMessage(
                "Please fill in all required fields, including farm location, product categories, and produce details."
            );
            setIsError(true);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                openDialog({
                    title: "Invalid session!",
                    showErrorIcon: true,
                    sticky: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Okay",
                            onClick() {
                                closeDialog();
                                logoutSession();
                                navigate("/auth/login");
                            },
                        },
                    ],
                });
            }

            const uploadImage = async (file: File): Promise<string> => {
                const token = localStorage.getItem("token");
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post(
                    BACKEND_URL + "/file/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                console.log(response.data.data.url);

                if (!response.data.data.url) {
                    throw new Error("Image upload failed");
                }
                // Adjust this depending on your backend's response structure
                return response.data.data.url;
            };

            if (logoFile) {
                const url = await uploadImage(logoFile);
                console.log(url);

                formData.businessLogoUrl = url;
            }

            formData.categories = formData.categories.map((val) =>
                //@ts-ignore
                val.toUpperCase()
            );
            console.log(formData);

            let data = await axios
                .post(BACKEND_URL + "/seller/application/submit", formData, {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                })
                .then((data) => data.data);
            if (data.code === "SUCCESS") {
                openDialog({
                    title: "Application submitted successfully.",
                    showSuccessIcon: true,
                    hideCloseButton: true,
                    buttons: [
                        {
                            label: "Ok",
                            onClick() {
                                closeDialog();
                            },
                        },
                    ],
                });
                navigate("/seller");
            } else {
                setMessage(data.message);
                setIsError(true);
            }
        } catch (error: any) {
            console.error("Error submitting application:", error);
            setMessage(
                `Error submitting application: ${
                    error.message || "Something went wrong."
                }`
            );
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6 text-center">
                Become a Seller on Harvest Hub!
            </h1>
            <p className="text-lg text-gray-700 mb-8 text-center">
                Are you a farmer, producer, or local vendor passionate about
                bringing fresh, high-quality products directly to customers?
                Join Harvest Hub and connect with a community eager for locally
                sourced goods!
            </p>
            <p className="text-md text-gray-600 mb-8 text-center">
                To get started, please fill out the application below. Once
                submitted, our team will review your information, and you'll
                hear from us soon regarding the status of your application.
            </p>

            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-2xl font-semibold text-green-600 mb-6">
                    Seller Application Form
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business Information */}

                    <div>
                        <p className="text-lg font-medium text-gray-800 mb-3">
                            <strong>Tell us about your business:</strong>
                        </p>

                        <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
                            <label
                                htmlFor="businessLogoUpload"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                            >
                                Business Logo{" "}
                                <span className="text-red-500">*</span>{" "}
                                {/* Indicates it's required */}
                            </label>

                            <div
                                className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center
                           cursor-pointer hover:border-blue-500 transition-colors duration-200 overflow-hidden group"
                                onClick={() =>
                                    //@ts-ignore
                                    document
                                        .getElementById("businessLogoUpload")
                                        .click()
                                }
                            >
                                {logoPreview ? (
                                    <>
                                        <img
                                            src={logoPreview}
                                            alt="Business Logo Preview"
                                            className="absolute inset-0 w-full h-full object-contain p-2 rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <span className="text-white text-lg font-medium">
                                                Change Logo
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600">
                                            Click to upload{" "}
                                            <span className="font-medium text-blue-600">
                                                business logo
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF
                                        </p>
                                    </div>
                                )}

                                <input
                                    id="businessLogoUpload"
                                    name="businessLogo"
                                    type="file"
                                    accept="image/*"
                                    //@ts-ignore
                                    onChange={handleFileChange}
                                    required
                                    className="sr-only"
                                />
                            </div>

                            {logoFile && (
                                <p className="mt-3 text-sm text-gray-500 text-center">
                                    Selected:{" "}
                                    <span className="font-medium">
                                        {logoFile.name}
                                    </span>
                                </p>
                            )}
                        </div>

                        <label
                            htmlFor="businessName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Business Name{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="e.g., Green Acres Farm"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Business Description{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            maxLength={1000}
                            placeholder="Tell us about your farm, what you produce, your farming practices, and what makes your products unique. (Max 1000 characters)"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm resize-y"
                        ></textarea>
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-800 mb-3">
                            <strong>Where is your Farm Located?</strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            This helps us connect you with local customers and
                            understand your supply capabilities.
                        </p>

                        <label
                            htmlFor="landmark"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Landmark
                        </label>
                        <input
                            type="text"
                            id="landmark"
                            name="farmLocation.landmark"
                            value={formData.farmLocation.landmark}
                            onChange={handleInputChange}
                            placeholder="e.g., Near Old Temple"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />

                        <label
                            htmlFor="street"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            Street Address{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="street"
                            name="farmLocation.street"
                            value={formData.farmLocation.street}
                            onChange={handleInputChange}
                            placeholder="e.g., 123 Farm Road"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="farmLocation.city"
                            value={formData.farmLocation.city}
                            onChange={handleInputChange}
                            placeholder="e.g., Anytown"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="district"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            District <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="district"
                            name="farmLocation.district"
                            value={formData.farmLocation.district}
                            onChange={handleInputChange}
                            placeholder="e.g., East Godavari"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            State/Province{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="farmLocation.state"
                            value={formData.farmLocation.state}
                            onChange={handleInputChange}
                            placeholder="e.g., Andhra Pradesh"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="pincode"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            Zip/Postal Code{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="pincode"
                            name="farmLocation.pincode"
                            value={formData.farmLocation.pincode}
                            onChange={handleInputChange}
                            placeholder="e.g., 534211"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            Country <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="farmLocation.country"
                            value={formData.farmLocation.country}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="latitude"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            Latitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="latitude"
                            name="farmLocation.latitude"
                            value={formData.farmLocation.latitude}
                            onChange={handleInputChange}
                            placeholder="e.g., 17.0000"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                        <label
                            htmlFor="longitude"
                            className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                            Longitude <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="longitude"
                            name="farmLocation.longitude"
                            value={formData.farmLocation.longitude}
                            onChange={handleInputChange}
                            placeholder="e.g., 81.0000"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-800 mb-3">
                            <strong>
                                What product categories do you offer?
                            </strong>{" "}
                            <span className="text-red-500">*</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Select all categories that apply to your offerings.
                            This helps us categorize your products on Harvest
                            Hub.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={category.name
                                            .toLowerCase()
                                            .replace(/\s/g, "-")}
                                        name="categories"
                                        value={category.name}
                                        checked={formData.categories.includes(
                                            //@ts-ignore
                                            category.name as Category
                                        )}
                                        onChange={handleCategoryChange}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={category.name
                                            .toLowerCase()
                                            .replace(/\s/g, "-")}
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-800 mb-3">
                            <strong>
                                What exactly do you produce and how much?
                            </strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            List the specific products you offer, estimated
                            quantities available (e.g., "50 kg", "100 dozen"),
                            and their seasonality.
                        </p>

                        {formData.produceDetails.map((detail, index) => (
                            <div
                                key={index}
                                className="flex flex-col sm:flex-row gap-4 mb-4 items-end p-3 border border-gray-200 rounded-md bg-gray-50"
                            >
                                <div className="flex-grow">
                                    <label
                                        htmlFor={`produceName-${index}`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Produce Name{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id={`produceName-${index}`}
                                        name="produceName"
                                        value={detail.produceName}
                                        onChange={(e) =>
                                            handleProduceDetailChange(index, e)
                                        }
                                        placeholder="e.g., Tomatoes (Heirloom)"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <label
                                        htmlFor={`quantityAvailable-${index}`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Quantity Available{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id={`quantityAvailable-${index}`}
                                        name="quantityAvailable"
                                        value={detail.quantityAvailable}
                                        onChange={(e) =>
                                            handleProduceDetailChange(index, e)
                                        }
                                        placeholder="e.g., 200 kg/week"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <label
                                        htmlFor={`seasonality-${index}`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Seasonality
                                    </label>
                                    <input
                                        type="text"
                                        id={`seasonality-${index}`}
                                        name="seasonality"
                                        value={detail.seasonality}
                                        onChange={(e) =>
                                            handleProduceDetailChange(index, e)
                                        }
                                        placeholder="e.g., Summer (June-Aug)"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                {formData.produceDetails.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeProduceDetail(index)
                                        }
                                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        aria-label="Remove produce detail"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addProduceDetail}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                        >
                            Add More Produce
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 pt-4">
                        By clicking "Submit Application", you agree to our{" "}
                        <a href="#" className="text-green-600 hover:underline">
                            Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-green-600 hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading
                                ? "bg-green-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        }`}
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>

                    {message && (
                        <div
                            className={`mt-4 p-3 rounded-md text-sm ${
                                isError
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                        >
                            {message}
                        </div>
                    )}
                </form>
            </div>

            <p className="text-md text-gray-600 mt-8 text-center">
                We look forward to reviewing your application and potentially
                welcoming you to the Harvest Hub family!
            </p>
        </div>
    );
};

export default SellerApplicationForm;
