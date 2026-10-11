export type ProductStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Address {
    street?: string;
    landmark?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
}

export interface Location extends Address {
    latitude?: number;
    longitude?: number;
}

export type Role = "USER" | "SELLER" | "ADMIN";
export type Category =
    | "FRUITS"
    | "VEGETABLES"
    | "DAIRY"
    | "GRAINS"
    | "MEAT"
    | "SEAFOOD";

export interface User {
    id: number;
    email: string;
    password?: string;
    fullName: string;
    role: Role;
    isAccountVerified: boolean;
    profilePicUrl?: string;
    bio?: string;
    phone?: string;
    dob?: string;
    address?: Address;
    createdAt?: string;
    updatedAt?: string;

    // seller-specific
    businessName?: string;
    description?: string;
    businessLogoUrl?: string;
    products?: Product[];
    sellingCategories?: Category[];
    farmLocation?: Location;
    notifications?: Notification[];
    rating?: number;
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
    comment: string;
    reviewer: User;
}

export const mockUsers: User[] = [
    { id: 1, email: "john@example.com", fullName: "John Doe", role: "SELLER" },
    { id: 2, email: "jane@example.com", fullName: "Jane Smith", role: "BUYER" },
];

export const mockReviews: Review[] = [
    {
        id: 101,
        rating: 5,
        comment: "Excellent product!",
        reviewer: mockUsers[1],
    },
    { id: 102, rating: 3, comment: "Could be better.", reviewer: mockUsers[0] },
];

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        description:
            "High-quality wireless headphones with noise cancellation.",
        images: [
            "https://via.placeholder.com/150/FF0000/FFFFFF?text=Headphones",
        ],
        price: "99.99",
        stock: "50",
        badges: ["New Arrival", "Bestseller"],
        seller: mockUsers[0],
        reviews: [mockReviews[0]],
        productStatus: "APPROVED",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Ergonomic Office Chair",
        description: "Comfortable and adjustable office chair for long hours.",
        images: ["https://via.placeholder.com/150/0000FF/FFFFFF?text=Chair"],
        price: "199.99",
        stock: "20",
        badges: ["On Sale"],
        seller: mockUsers[0],
        reviews: [mockReviews[1]],
        productStatus: "PENDING",
        rating: 3.5,
    },
    {
        id: 3,
        name: "Smart Watch",
        description: "Track your fitness and receive notifications on the go.",
        images: [
            "https://via.placeholder.com/150/00FF00/000000?text=SmartWatch",
        ],
        price: "149.99",
        stock: "100",
        badges: [],
        seller: mockUsers[1],
        reviews: [],
        productStatus: "APPROVED",
        rating: undefined,
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        description:
            "Durable mechanical keyboard with customizable RGB lighting.",
        images: ["https://via.placeholder.com/150/FFFF00/000000?text=Keyboard"],
        price: "75.00",
        stock: "30",
        badges: ["Gaming"],
        seller: mockUsers[0],
        reviews: [],
        productStatus: "REJECTED",
        rating: undefined,
    },
];
