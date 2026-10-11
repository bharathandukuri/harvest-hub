export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
    profilePicUrl?: string;
    bio?: string;
    phone?: string;
    dob?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    images: string[];
    price: string;
    stock: string;
    badges: string[];
    seller: User;
    reviews: Review[];
    productStatus: ProductStatus;
    rating?: number;
}

export interface Review {
    id: number;
    rating: number;
    title: string;
    description: string;
    images: string[];

    by: User;
    product?: Product;
}

export interface ProductUploadFormData {
    name: string;
    description: string;
    price: string;
    stock: number | "";
    images: File[];
    category: string;
    badges: string;
}

export interface ProductEditFormData {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: string;
    images: (string | File)[];
    badges: string;
    productStatus: ProductStatus;
}

export interface ProductEditApplicationProps {
    id: number;
    appliedBy: User;
    originalProduct: Product;
    updatedProduct: Product;
    applicationStatus: "ACCEPTED" | "REJECTED" | "PENDING";
    createdAt: string;
    updatedAt: string;
}

export interface ProductDeleteApplicationProps {
    id: number;
    appliedBy: User;
    product: Product;
    applicationStatus: "ACCEPTED" | "REJECTED" | "PENDING";
    createdAt: string;
    updatedAt: string;
}
