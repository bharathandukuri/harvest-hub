export interface User {
    id: string;
    fullName: string;
    email: string;
    profilePicUrl?: string;
}

export interface Review {
    id: number;
    rating: number;
    title: string;
    description: string;
    images: string[];
    by: User;
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
    rating?: number;
}

export interface ProductFormData {
    name: string;
    description: string;
    images: string[];
    price: string;
    stock: string;
    badges: string[];
}
