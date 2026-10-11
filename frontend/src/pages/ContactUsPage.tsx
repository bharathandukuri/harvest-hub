import { useState } from "react";
import { FaEnvelope, FaUser, FaPhone, FaStore } from "react-icons/fa";

function ContactUsPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        storeName: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        // TODO: Replace with your backend endpoint
        setTimeout(() => {
            setLoading(false);
            setSuccess(
                "Your application has been submitted! We'll contact you soon."
            );
            setForm({
                name: "",
                email: "",
                phone: "",
                storeName: "",
                message: "",
            });
        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg border-2 border-gray-200 rounded-2xl shadow-2xl p-10 bg-white/80 backdrop-blur flex flex-col gap-4"
            >
                <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center flex items-center gap-2">
                    <FaStore className="text-green-500" /> Become a Partner
                </h1>
                <span className="text-gray-600 mb-4 text-center">
                    Want to sell your products on Harvest Hub? Fill out the form
                    below and our team will reach out to you.
                </span>
                {success && (
                    <div className="text-green-600 text-center font-semibold">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-center font-semibold">
                        {error}
                    </div>
                )}
                <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:border-green-500 w-full">
                    <span className="pl-3 pr-2 text-green-400">
                        <FaUser />
                    </span>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        className="flex-1 p-3 outline-none bg-transparent"
                        required
                    />
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:border-green-500 w-full">
                    <span className="pl-3 pr-2 text-green-400">
                        <FaEnvelope />
                    </span>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="flex-1 p-3 outline-none bg-transparent"
                        required
                    />
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:border-green-500 w-full">
                    <span className="pl-3 pr-2 text-green-400">
                        <FaPhone />
                    </span>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="flex-1 p-3 outline-none bg-transparent"
                        required
                    />
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:border-green-500 w-full">
                    <span className="pl-3 pr-2 text-green-400">
                        <FaStore />
                    </span>
                    <input
                        type="text"
                        name="storeName"
                        placeholder="Store/Farm Name"
                        value={form.storeName}
                        onChange={handleChange}
                        className="flex-1 p-3 outline-none bg-transparent"
                        required
                    />
                </div>
                <textarea
                    name="message"
                    placeholder="Tell us about your products, farm, or anything else you'd like us to know."
                    value={form.message}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg p-3 bg-white focus:border-green-500 min-h-[100px] resize-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow transition-colors ${
                        loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Submitting..." : "Apply to Become a Partner"}
                </button>
            </form>
        </div>
    );
}

export default ContactUsPage;
