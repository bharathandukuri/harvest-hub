export interface Address {
    street?: string;
    landmark?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

export type Role = "ADMIN" | "USER" | "PARTNER";

export interface User {
    id: number;
    fullName: string;
    email: string;
    password?: string;
    role: Role;
    accountVerified: boolean;
    profilePicUrl?: string;
    bio?: string;
    phone?: string;
    dob?: string;
    location?: Address;
    createdAt: string;
    updatedAt: string;
}

interface Review {
    by: User;
    rating: number;
    title: string;
    description: string;
    images: string[];
}

interface Seller {
    id: string;
    business: string;
    rating: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    images: string[]; //URL's
    price: string;
    stock: string;
    badges: string[];
    rating: number;
    seller: Seller;
    reviews: Review[];
}

function ProductListItem() {
    return <div>ProductListItem</div>;
}
export default ProductListItem;
