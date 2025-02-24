import { ImgHTMLAttributes } from "react";

export default function ApplicationLogo(
    props: ImgHTMLAttributes<HTMLImageElement>
) {
    return <img {...props} src="/images/mangaluru-bus-hw.png" />;
}
