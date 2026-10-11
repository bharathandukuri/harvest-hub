import React, { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../hooks/DialogContext";
import { logoutSession } from "../../hooks/auth/SessionValidation";
import { BACKEND_URL } from "../../config/Config";

interface Review {
    id: string;
    by: string;
    rating: number;
    title: string;
    description: string;
    images: string[];
}

interface WriteReviewFormProps {
    onSubmit: (review: Omit<Review, "id" | "by">) => void;
}

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const navigate = useNavigate();
    const { openDialog, closeDialog } = useDialog();

    const uploadImage = async (file: File): Promise<string> => {
        const token = localStorage.getItem("token");
        if (!token) {
            openDialog({
                title: "Unauthorized",
                showErrorIcon: true,
                errorMessage: "You are not logged in. Please log in to upload.",
                buttons: [
                    {
                        label: "Login",
                        variant: "primary",
                        onClick: () => {
                            closeDialog();
                            logoutSession();
                            navigate("/auth/login");
                        },
                    },
                ],
            });
            throw new Error("No token found.");
        }

        const imageData = new FormData();
        imageData.append("file", file);

        const response = await axios.post(
            `${BACKEND_URL}/file/upload`,
            imageData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data.data.url;
    };

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setIsSubmitting(true);
            setSubmitMessage("Uploading images...");

            try {
                const uploadedImageUrls: string[] = [];
                for (const file of filesArray) {
                    const url = await uploadImage(file);
                    uploadedImageUrls.push(url);
                }

                setImageFiles((prev) => [...prev, ...filesArray]);
                setImagePreviews((prev) => [...prev, ...uploadedImageUrls]);
                setSubmitMessage("Images uploaded successfully!");
            } catch (error) {
                console.error("Error uploading images:", error);
                setSubmitMessage("Failed to upload images.");
            } finally {
                setIsSubmitting(false);
                setTimeout(() => setSubmitMessage(""), 3000);
            }
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageFiles((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        setImagePreviews((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

        if (rating === 0 || title.trim() === "" || description.trim() === "") {
            setSubmitMessage(
                "Please fill in all required fields (Rating, Title, Description)."
            );
            setIsSubmitting(false);
            return;
        }

        const newReview: Omit<Review, "id" | "by"> = {
            rating,
            title,
            description,
            images: imagePreviews,
        };

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            onSubmit(newReview);

            setRating(0);
            setTitle("");
            setDescription("");
            setImageFiles([]);
            setImagePreviews([]);
            setSubmitMessage("Your review has been submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitMessage("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(""), 5000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">
                    Your Rating: <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`cursor-pointer w-7 h-7 transition-colors duration-200 ${
                                star <= rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                            }`}
                            onClick={() => handleRatingChange(star)}
                        />
                    ))}
                </div>
                {rating === 0 && (
                    <p className="text-red-500 text-sm mt-1">
                        Please select a rating.
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="reviewTitle"
                    className="block text-lg font-medium text-gray-800 mb-2"
                >
                    Review Title: <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="reviewTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Summarize your experience"
                    required
                />
            </div>

            <div>
                <label
                    htmlFor="reviewDescription"
                    className="block text-lg font-medium text-gray-800 mb-2"
                >
                    Detailed Review: <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="reviewDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base resize-y"
                    placeholder="Share more details about your experience with this product..."
                    required
                ></textarea>
            </div>

            <div>
                <label
                    htmlFor="reviewImages"
                    className="block text-lg font-medium text-gray-800 mb-2"
                >
                    Add Images (Optional):
                </label>
                <input
                    type="file"
                    id="reviewImages"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
                {imagePreviews.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative w-28 h-28">
                                <img
                                    src={src}
                                    alt={`Review upload preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
                                    aria-label={`Remove image ${index + 1}`}
                                >
                                    <FaTimes className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting Review..." : "Submit Review"}
            </button>

            {submitMessage && (
                <p
                    className={`mt-4 text-center text-base font-medium ${
                        submitMessage.includes("successfully")
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {submitMessage}
                </p>
            )}
        </form>
    );
};

export default WriteReviewForm;
