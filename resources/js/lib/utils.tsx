import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function LinkRenderer(props: any) {
    return (
        <a
            href={props.href}
            target={props.href.startsWith("http") ? "_blank" : "_self"}
            rel="noreferrer"
        >
            {props.children}
        </a>
    );
}

function flatten(text: string, child: any): any {
    return typeof child === "string"
        ? text + child
        : React.Children.toArray(child.props.children).reduce(flatten, text);
}

export function HeadingRenderer(props: any) {
    var children = React.Children.toArray(props.children);
    var text = children.reduce(flatten, "");
    var slug = text.toLowerCase().replace(/\W/g, "");
    return React.createElement(
        props.node.tagName,
        { id: slug },
        props.children
    );
}

export const componentRenderers = {
    a: LinkRenderer,
    h1: HeadingRenderer,
    h2: HeadingRenderer,
    h3: HeadingRenderer,
    h4: HeadingRenderer,
    h5: HeadingRenderer,
    h6: HeadingRenderer,
};
