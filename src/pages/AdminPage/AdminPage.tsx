import { FaLeaf } from "react-icons/fa";

function AdminPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-green-900">
            <FaLeaf className="text-5xl text-green-700 mb-4" />
            <h1 className="text-3xl font-bold mb-2">
                Welcome to the Admin Panel
            </h1>
            <p className="text-lg max-w-md">
                Use the sidebar to manage users, partners, and settings. Keep
                everything running smoothly and efficiently.
            </p>
        </div>
    );
}

export default AdminPage;
