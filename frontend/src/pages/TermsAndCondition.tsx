import React from "react";
import {
    FaHandshake,
    FaFileContract,
    FaShoppingCart,
    FaDollarSign,
    FaShieldAlt,
    FaInfoCircle,
    FaSeedling,
    FaTruckLoading,
} from "react-icons/fa"; // Importing icons

const TermsAndConditions: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto my-12 p-8 bg-white shadow-xl rounded-lg font-sans">
            <div className="text-center mb-10">
                <FaFileContract className="mx-auto text-green-600 text-6xl mb-4" />
                <h1 className="text-5xl font-extrabold text-green-700 mb-4">
                    Harvest Hub Partner Terms & Conditions
                </h1>
                <p className="text-xl text-gray-700">
                    Last Updated: June 30, 2025
                </p>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Welcome to Harvest Hub! These Terms and Conditions ("Terms")
                govern your use of the Harvest Hub platform as a farmer partner.
                By applying to and participating in the Harvest Hub partnership
                program, you ("Partner," "Farmer," "You") agree to be bound by
                these Terms, our Privacy Policy, and any other policies or
                guidelines referenced herein. Please read them carefully.
            </p>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center">
                <FaHandshake className="mr-3 text-4xl" /> 1. Partnership
                Agreement
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                These Terms constitute a binding agreement between Harvest Hub
                ("We," "Us," "Our") and the Partner. By registering as a
                Partner, you agree to uphold the standards of quality,
                freshness, and service expected by Harvest Hub and its
                customers. We reserve the right to approve or reject any
                partnership application at our sole discretion. Continuous
                adherence to these terms is required to maintain partnership
                status.
            </p>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaSeedling className="mr-3 text-4xl" /> 2. Product Standards
                and Listings
            </h2>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-6 space-y-3 leading-relaxed">
                <li>
                    <strong>Quality & Freshness:</strong> All products supplied
                    by the Partner must meet Harvest Hub's stringent quality and
                    freshness standards, as outlined in our Partner Guidelines
                    (provided separately upon approval). Products must be free
                    from defects, pests, and damage, and must be safe for
                    consumption.
                </li>
                <li>
                    <strong>Accurate Representation:</strong> Partners are
                    responsible for accurately describing their products,
                    including origin, certifications (e.g., organic), growing
                    methods, ingredients (for processed goods), and any
                    allergens. Misrepresentation may lead to immediate
                    termination of the partnership.
                </li>
                <li>
                    <strong>Inventory & Availability:</strong> Partners must
                    accurately manage their inventory and communicate product
                    availability, including any seasonal changes or unforeseen
                    shortages, through their dedicated Partner Dashboard.
                </li>
                <li>
                    <strong>Pricing:</strong> Partners will set their product
                    pricing. Harvest Hub reserves the right to review and
                    discuss pricing to ensure competitiveness and fairness for
                    both partners and consumers.
                </li>
            </ul>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaTruckLoading className="mr-3 text-4xl" /> 3. Order
                Fulfillment & Logistics
            </h2>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-6 space-y-3 leading-relaxed">
                <li>
                    <strong>Order Processing:</strong> Partners are responsible
                    for timely processing of all orders received through the
                    Harvest Hub platform, ensuring products are prepared
                    according to order specifications.
                </li>
                <li>
                    <strong>Packaging:</strong> Products must be packed securely
                    and appropriately for transport to maintain freshness and
                    prevent damage, adhering to any specific Harvest Hub
                    packaging guidelines.
                </li>
                <li>
                    <strong>Delivery/Pickup:</strong> Partners must adhere to
                    the agreed-upon delivery or pickup schedule and method
                    (e.g., delivery to Harvest Hub warehouse, customer direct
                    shipping, or Harvest Hub pickup). Timeliness is critical for
                    customer satisfaction.
                </li>
                <li>
                    <strong>Returns & Refunds:</strong> Policies regarding
                    returns, refunds, and damaged goods will be managed
                    according to Harvest Hub's standard customer policies.
                    Partners agree to cooperate in resolving any customer
                    complaints related to product quality or delivery issues.
                </li>
            </ul>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaDollarSign className="mr-3 text-4xl" /> 4. Payments and Fees
            </h2>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-6 space-y-3 leading-relaxed">
                <li>
                    <strong>Commission Structure:</strong> Harvest Hub will
                    deduct a predetermined commission from each sale made
                    through the platform. The exact commission rates will be
                    provided in a separate agreement upon partnership approval.
                </li>
                <li>
                    <strong>Payouts:</strong> Payments to Partners will be
                    processed on a [Weekly/Bi-weekly/Monthly] basis, net of
                    Harvest Hub's commission and any applicable charges (e.g.,
                    delivery fees if Harvest Hub handles logistics).
                </li>
                <li>
                    <strong>Payment Information:</strong> Partners must provide
                    accurate and up-to-date banking information for payouts.
                    Harvest Hub is not responsible for delays or issues arising
                    from incorrect payment details.
                </li>
            </ul>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaShieldAlt className="mr-3 text-4xl" /> 5. Intellectual
                Property & Data
            </h2>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-6 space-y-3 leading-relaxed">
                <li>
                    <strong>Content Ownership:</strong> Partners retain
                    ownership of their farm's branding, logos, and original
                    product descriptions provided to Harvest Hub. You grant
                    Harvest Hub a non-exclusive, worldwide, royalty-free license
                    to use, reproduce, and display your content for the purpose
                    of operating and promoting the Harvest Hub platform.
                </li>
                <li>
                    <strong>Data Privacy:</strong> Both Harvest Hub and Partners
                    agree to comply with all applicable data protection laws.
                    Partner data collected by Harvest Hub will be handled
                    according to our Privacy Policy.
                </li>
                <li>
                    <strong>Dashboard Access:</strong> Access to the Partner
                    Dashboard is strictly for the Partner's authorized
                    representatives. Partners are responsible for maintaining
                    the confidentiality of their login credentials.
                </li>
            </ul>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaInfoCircle className="mr-3 text-4xl" /> 6. Disclaimer of
                Warranties; Limitation of Liability
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Harvest Hub provides its platform "as is" and "as available"
                without any warranties, express or implied, including but not
                limited to implied warranties of merchantability, fitness for a
                particular purpose, or non-infringement. We do not guarantee
                that the platform will be uninterrupted, error-free, or secure.
                In no event shall Harvest Hub be liable for any indirect,
                incidental, special, consequential, or punitive damages arising
                out of or related to your partnership or use of the platform.
            </p>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaFileContract className="mr-3 text-4xl" /> 7. Termination
            </h2>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-6 space-y-3 leading-relaxed">
                <li>
                    Either party may terminate this partnership agreement with
                    [X days'] written notice.
                </li>
                <li>
                    Harvest Hub may terminate the partnership immediately if a
                    Partner breaches these Terms, including but not limited to
                    consistent failure to meet quality standards,
                    non-fulfillment of orders, or engaging in fraudulent
                    activity.
                </li>
                <li>
                    Upon termination, the Partner's access to the dashboard will
                    be revoked, and outstanding payments will be settled
                    according to the agreed payout schedule.
                </li>
            </ul>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaShoppingCart className="mr-3 text-4xl" /> 8. Governing Law
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of [Your State/Province, India], without regard to
                its conflict of law principles. Any disputes arising under these
                Terms shall be resolved in the courts located in [Your City,
                State/Province, India].
            </p>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaInfoCircle className="mr-3 text-4xl" /> 9. Changes to Terms
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Harvest Hub reserves the right to modify these Terms at any
                time. We will notify Partners of any significant changes via
                email or through the Partner Dashboard. Continued participation
                after such modifications constitutes your acceptance of the new
                Terms.
            </p>

            <h2 className="text-3xl font-bold text-green-600 mb-6 flex items-center mt-10">
                <FaHandshake className="mr-3 text-4xl" /> 10. Contact Us
            </h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                If you have any questions about these Terms, please contact us
                at{" "}
                <a
                    href="mailto:support@harvesthub.com"
                    className="text-blue-600 hover:underline"
                >
                    support@harvesthub.com
                </a>
                .
            </p>

            <div className="text-center text-gray-600 text-sm mt-10 pt-6 border-t border-gray-200">
                &copy; {new Date().getFullYear()} Harvest Hub. All rights
                reserved.
            </div>
        </div>
    );
};

export default TermsAndConditions;
