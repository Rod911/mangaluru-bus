export default function FaqSection() {
    const faqs = [
        {
            question:
                "What types of buses does MangaluruBus provide information for?",
            answer: "MangaluruBus provides comprehensive route information for all types of public buses in Mangalore city, including local city buses, express services, and KSRTC buses connecting to surrounding areas.",
        },
        {
            question:
                "Do you provide information for routes without direct connections?",
            answer: "Yes! Our specialty is providing complete journey information even when direct routes aren't available. We'll show you which connecting buses to take to reach your destination.",
        },
        {
            question: "How frequently is the route information updated?",
            answer: "We regularly update our database to reflect any changes in bus routes, ensuring you always have access to the most current information available.",
        },
        {
            question: "Can I find information about bus stops along a route?",
            answer: "Yes, when you select a specific route, we provide information about all major stops along that route to help you plan your journey better.",
        },
        {
            question: "What can I do if I find an issue with the information provided?",
            answer: "If you come across any issues with the information on this website, please report them to us from the 'Report Issue' page. We value your feedback and will address any concerns you may have.",
        },
    ] as { question: string; answer: string }[];

    return (
        <div className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-semibold mb-6">
                Frequently Asked Questions
            </h2>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                        <h3 className="text-xl font-medium mb-2">
                            {faq.question}
                        </h3>
                        <p className="text-gray-700">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
