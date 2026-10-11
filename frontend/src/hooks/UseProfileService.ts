import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import { BACKEND_URL } from "../config/Config";

export interface Location {
    landmark: string;
    street: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
}

export interface UserProfile {
    email: string;
    fullName: string;
    profilePicUrl: string;
    phoneNumber: string;
    dateOfBirth: string;
    location: Location;
}

export async function fetchAndCacheUserProfile(): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await axios.get(`${BACKEND_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data?.data) {
            localStorage.setItem(
                "userProfile",
                JSON.stringify(response.data.data)
            );
        }
        console.log(response.data.data);
    } catch (err) {
        console.error("Failed to fetch profile", err);
    }
}

export function getCachedUserProfile(): UserProfile | null {
    const data = localStorage.getItem("userProfile");
    return data ? JSON.parse(data) : null;
}

export async function updateUserProfile(
    profile: Partial<UserProfile>
): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
        const response = await axios.put(`${BACKEND_URL}/profile`, profile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data?.data) {
            localStorage.setItem(
                "userProfile",
                JSON.stringify(response.data.data)
            );
        }
    } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
    }
}

export async function uploadProfileImage(
    file: File,
    onProgress?: (percent: number) => void
): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(
            `${BACKEND_URL}/file/upload`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress?.(percent);
                    }
                },
            }
        );

        console.log("Uploaded successfully:", response.data);
        console.log(response.data?.data?.url);

        if (response.data?.data?.url) {
            const imageUrl = response.data.data.url;

            await axios.put(`${BACKEND_URL}/profile/image`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    url: imageUrl,
                },
            });

            const profile = getCachedUserProfile();
            if (profile) {
                profile.profilePicUrl = imageUrl;
                localStorage.setItem("userProfile", JSON.stringify(profile));
            }
        }
    } catch (error) {
        console.error("Failed to upload profile image:", error);
        throw error;
    }
}
