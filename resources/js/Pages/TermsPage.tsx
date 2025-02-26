import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

import Layout from "@/Components/Layout";
import { Head } from "@inertiajs/react";
import { componentRenderers } from "@/lib/utils";

import "./md/md-styles.css";

export default function TermsPage({ app_name }: { app_name: string }) {
    const [text, setText] = useState("");
    useEffect(() => {
        // @ts-ignore
        import("./md/terms.md").then((md) => {
            fetch(md.default)
                .then((response) => response.text())
                .then((data) => setText(data));
        });
    }, []);
    return (
        <>
            <Head title="Terms and Conditions" />
            <Layout app_name={app_name}>
                <div className="container mx-auto px-4 py-8">
                    <div className="markdown-body px-6 py-8 shadow-lg rounded-lg">
                        <ReactMarkdown components={componentRenderers}>
                            {text}
                        </ReactMarkdown>
                    </div>
                </div>
            </Layout>
        </>
    );
}
