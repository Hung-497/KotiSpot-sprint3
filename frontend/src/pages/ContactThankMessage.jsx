const ContactThankMessage = () => {
    return (
        <div className="min-h-screen bg-[#f8faf9] px-6 py-12">

            <div className="mx-auto max-w-xl">

                <div
                    className="
                        rounded-2xl
                        border border-gray-300
                        bg-white
                        px-10 py-8
                        text-center
                        shadow-sm
                    "
                >
                    <div
                        className="
                            mx-auto mb-4
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full
                            bg-[#eef6f2]
                            text-xl
                            text-[#17634f]
                        "
                    >
                        ✓
                    </div>

                    <h1 className="text-lg font-semibold text-[#08243f]">
                        Message sent!
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        Thank you for your message. We'll get back to you as soon as possible.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ContactThankMessage;