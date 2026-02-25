import type { FieldError as ReactHookFormFieldError } from "react-hook-form";
import { Field, FieldContent, FieldError, FieldLabel } from "./ui/field";

export type FormFieldProps = React.ComponentProps<typeof Field> & {
    children: React.ReactNode;
    label?: string;
    isInvalid?: boolean;
    error?: ReactHookFormFieldError;
};

export function FormField({
    label,
    isInvalid,
    error,
    children,
    ...props
}: FormFieldProps) {
    return (
        <Field data-invalid={isInvalid} {...props}>
            <FieldLabel>{label}</FieldLabel>
            <FieldContent>
                {children}
                {isInvalid && <FieldError errors={[error]} />}
            </FieldContent>
        </Field>
    );
}
