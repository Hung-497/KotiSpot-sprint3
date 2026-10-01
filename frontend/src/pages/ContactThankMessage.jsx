const ContactThankMessage = () => {
    return (
        <div className="min-h-screen bg-[#f8faf9] px-6 py-12 dark:bg-[radial-gradient(circle_at_top_left,#123343_0%,#081a26_28%,#06141e_65%,#04111a_100%)]">

            <div className="mx-auto max-w-xl">

                <div
                    className=" rounded-2xl border border-gray-300 bg-white px-10 py-8 text-center shadow-sm dark:border-[#2c806c]/60 dark:bg-[#0b2233]/70 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.30)]">
                    <div
                        className=" mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#eef6f2] text-xl text-[#17634f] dark:bg-[#55d4aa]dark:text-[#06241d]dark:shadow-[0_0_25px_rgba(85,212,170,0.35)]">
                        ✓
                    </div>

                    <h1 className="text-lg font-semibold text-[#08243f] dark:text-white">
                        Message sent!
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-[#a7b4be]">
                        Thank you for your message. We'll get back to you as soon as possible.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ContactThankMessage;