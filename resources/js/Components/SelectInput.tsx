import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

export default forwardRef(function SelectInput(
    {
        className = "",
        isFocused = false,
        options = {},
        ...props
    }: InputHTMLAttributes<HTMLSelectElement> & {
        isFocused?: boolean;
        options?: Record<string | number, string | number>;
    },
    ref
) {
    const localRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                className
            }
            ref={localRef}
        >
            {Object.entries(options).map(([key, value]) => (
                <option key={key} value={key} hidden={key === ""}>
                    {value}
                </option>
            ))}
        </select>
    );
});
