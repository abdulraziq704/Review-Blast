const TermsOfService = () => {
    return (
        <div className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Terms of Service</h1>

                <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
                    <p className="text-sm">Last Updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                        <p>By accessing or using ReviewBlast, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">2. Use Responsibilities</h2>
                        <p>You are responsible for ensuring that you have the necessary consent from your customers before uploading their contact information and sending messages via our platform. You must comply with all local anti-spam and telecommunications laws.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">3. Limitation of Liability</h2>
                        <p>ReviewBlast is provided "as is". We are not liable for any damages arising out of your use of the service or any third-party services (like Twilio or Google Reviews).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Modifications</h2>
                        <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
