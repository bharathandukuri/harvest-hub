import { useState } from "react";
import ProductUploadApplications from "./upload/ProductUploadApplications";
import ProductEditApplications from "./edit/ProductEditApplications.tsx";
import ProductDeleteApplications from "./delete/ProductDeleteApplications.tsx";

function ProductApplications() {
    const [activeTab, setActiveTab] = useState("upload"); // State to manage which tab is active

    const renderContent = () => {
        switch (activeTab) {
            case "upload":
                return <ProductUploadApplications />;
            case "edit":
                return <ProductEditApplications />;
            case "delete":
                return <ProductDeleteApplications />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    marginBottom: "20px",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <button
                    style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor:
                            activeTab === "upload" ? "#eee" : "transparent",
                        borderBottom:
                            activeTab === "upload" ? "2px solid blue" : "none",
                        fontWeight: activeTab === "upload" ? "bold" : "normal",
                    }}
                    onClick={() => setActiveTab("upload")}
                >
                    Upload
                </button>
                <button
                    style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor:
                            activeTab === "edit" ? "#eee" : "transparent",
                        borderBottom:
                            activeTab === "edit" ? "2px solid blue" : "none",
                        fontWeight: activeTab === "edit" ? "bold" : "normal",
                    }}
                    onClick={() => setActiveTab("edit")}
                >
                    Edit
                </button>
                <button
                    style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor:
                            activeTab === "delete" ? "#eee" : "transparent",
                        borderBottom:
                            activeTab === "delete" ? "2px solid blue" : "none",
                        fontWeight: activeTab === "delete" ? "bold" : "normal",
                    }}
                    onClick={() => setActiveTab("delete")}
                >
                    Delete
                </button>
            </div>

            <div
                style={{
                    padding: "20px",
                    border: "1px solid #eee",
                    borderRadius: "5px",
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
}

export default ProductApplications;
