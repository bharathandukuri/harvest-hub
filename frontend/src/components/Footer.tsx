import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaLeaf,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="w-full bg-green-800 text-white py-8 mt-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-8">
                {/* Brand Info */}
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="text-3xl font-extrabold flex items-center gap-2 text-green-200">
                        <FaLeaf className="text-green-300" />
                        <span>Harvest Hub</span>
                    </div>
                    <p className="text-sm text-green-100 text-center md:text-left max-w-xs">
                        Your trusted source for fresh, quality produce delivered
                        right to your door.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-sm text-center md:text-left">
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-green-200 mb-1">
                            Company
                        </h4>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            About Us
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Our Mission
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Blog
                        </a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-green-200 mb-1">
                            Support
                        </h4>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            FAQ
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Shipping & Returns
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Privacy Policy
                        </a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-green-200 mb-1">
                            Products
                        </h4>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Fruits
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Vegetables
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Organic
                        </a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-green-200 mb-1">
                            Connect
                        </h4>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Contact Us
                        </a>
                        <a
                            href="#"
                            className="hover:underline hover:text-green-50 transition-colors"
                        >
                            Careers
                        </a>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="flex flex-col items-center md:items-end gap-4 mt-4 md:mt-0">
                    <div className="flex gap-5 text-2xl">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="hover:text-green-300 transition-colors"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="#"
                            aria-label="Twitter"
                            className="hover:text-green-300 transition-colors"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="hover:text-green-300 transition-colors"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="hover:text-green-300 transition-colors"
                        >
                            <FaLinkedin />
                        </a>
                    </div>
                    <div className="text-xs text-green-200 text-center md:text-right">
                        &copy; {new Date().getFullYear()} Harvest Hub. All
                        rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
