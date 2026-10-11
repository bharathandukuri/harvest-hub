import React, { useState } from "react";
import { type User } from "./UsersPage";
import UserListItemDetails from "./UserListItemDetails";
import UserListItemEditForm from "./UserListItemEditForm";
import { useDialog } from "../../../hooks/DialogContext";

interface UserListItemProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onDelete: (userId: number) => void;
}

function UserListItem({ user, onSave, onDelete }: UserListItemProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [editing, setEditing] = useState(false);
    const { openDialog, closeDialog } = useDialog();

    const handleSave = (updatedUser: User) => {
        onSave(updatedUser);
        setEditing(false);
        setShowDetails(false);
    };

    const handleCancelEdit = () => {
        setEditing(false);
    };

    const handleToggleDetails = () => {
        setShowDetails((prev) => !prev);
        setEditing(false);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
        setShowDetails(false);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        openDialog({
            title: "Delete User",
            description: `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`,
            sticky: true,
            hideCloseButton: true,
            buttons: [
                {
                    label: "Cancel",
                    variant: "secondary",
                    onClick() {
                        closeDialog();
                    },
                },
                {
                    label: "Delete",
                    variant: "danger",
                    onClick() {
                        closeDialog();
                        onDelete(user.id);
                    },
                },
            ],
        });
    };
    // Function to get a distinct color for each role
    const getRoleColorClass = (role: User["role"]) => {
        switch (role) {
            case "ADMIN":
                return "text-purple-700 bg-purple-100";
            case "SELLER":
                return "text-green-700 bg-green-100";
            case "USER": // Assuming 'BUYER' is the default user role
                return "text-blue-700 bg-blue-100";
            default:
                return "text-gray-700 bg-gray-100";
        }
    };

    return (
        <li className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden border border-gray-100">
            <div
                className={`flex items-center px-6 py-4 cursor-pointer ${
                    editing ? "bg-blue-50" : "bg-white" // Slight background change when editing
                }`}
                onClick={handleToggleDetails}
            >
                <div className="flex-grow">
                    <p className="font-extrabold text-xl text-gray-900 leading-tight">
                        {user.fullName}
                    </p>
                    <p className="text-md font-medium flex items-center">
                        <span className="text-blue-700 mr-2">{user.email}</span>
                        {/* Display role as a badge */}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColorClass(
                                user.role
                            )}`}
                        >
                            {user.role}
                        </span>
                    </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                    {!editing && (
                        <>
                            <button
                                onClick={handleEditClick}
                                className="text-indigo-600 hover:text-indigo-800 font-semibold py-2 px-3 rounded-lg hover:bg-indigo-50 transition duration-200"
                                aria-label={`Edit ${user.fullName}`}
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="text-red-600 hover:text-red-800 font-semibold py-2 px-3 rounded-lg hover:bg-red-50 transition duration-200"
                                aria-label={`Delete ${user.fullName}`}
                            >
                                Delete
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleToggleDetails}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition duration-200"
                        aria-label={
                            showDetails ? "Collapse details" : "Expand details"
                        }
                    >
                        <svg
                            className={`w-6 h-6 transform transition-transform duration-300 ${
                                showDetails ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>

            {editing ? (
                <UserListItemEditForm
                    user={user}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                />
            ) : showDetails ? (
                <UserListItemDetails user={user} />
            ) : null}
        </li>
    );
}

export default UserListItem;
