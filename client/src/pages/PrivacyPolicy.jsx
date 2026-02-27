const PrivacyPolicy = () => {
    return (
        <div className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>

                <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
                    <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account, such as your name, email address, and business details. We also process customer contact information (names and phone numbers) that you upload solely for the purpose of sending review requests.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
                        <p>Your information is used to provide, maintain, and improve our services, including sending automated messages via Twilio as configured by you. We do not sell or share your customer data with third parties for their own marketing purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your personal information and the data you upload. However, no method of transmission over the internet is 100% secure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Your Rights</h2>
                        <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
