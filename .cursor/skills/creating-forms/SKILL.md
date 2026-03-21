---
name: creating-forms
description: Create forms using react-hook-form with zod validation, Controller components, and the project's field component system. Use when building forms, adding form fields, creating input validation, or working with form submissions.
---

# Creating Forms

This skill covers how to create forms in this project using react-hook-form, zod validation, and the project's field component system.

## Required Imports

```tsx
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FormField } from "@/components/FormField";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useZodResolver } from "@/hooks/use-zod-error-map";
```

## Form Setup Pattern

### 1. Define the Schema

Use zod to define the form schema outside the component:

```tsx
const formSchema = z.object({
    fieldName: z.string().min(1),
    email: z.string().email(),
    // Add more fields as needed
});
```

### 2. Initialize useForm Hook

Use the `useZodResolver` hook to get a resolver with translated error messages:

```tsx
const resolver = useZodResolver<z.infer<typeof formSchema>>(formSchema);

const form = useForm<z.infer<typeof formSchema>>({
    resolver,
    defaultValues: {
        fieldName: "",
        email: "",
    },
});
```

**Important**: Always pass the form type as a generic parameter to `useZodResolver<FormType>(schema)` to ensure proper type inference.

### 3. Create Submit Handler

```tsx
const onSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
        // Handle form submission
    },
    [/* dependencies */],
);
```

## Form Structure

Forms use a specific component hierarchy:

```
<form>
  └── <FieldSet>
        └── <FieldGroup>
              └── <Controller>
                    └── <FormField>
                          └── <Input> (or other input component)
```

### Complete Form Example

```tsx
<form
    id="my-form"
    onSubmit={form.handleSubmit(onSubmit)}
>
    <FieldSet>
        <FieldGroup>
            <Controller
                control={form.control}
                name="fieldName"
                render={({ field, fieldState }) => (
                    <FormField
                        label="Field Label"
                        isInvalid={fieldState.invalid}
                        error={fieldState.error}
                    >
                        <Input
                            aria-invalid={fieldState.invalid}
                            placeholder="Placeholder text"
                            {...field}
                        />
                    </FormField>
                )}
            />
        </FieldGroup>
    </FieldSet>
</form>
```

## Key Patterns

### Form ID and External Submit Button

When the submit button is outside the form (e.g., in a CardFooter), use the `form` attribute:

```tsx
<form id="my-form" onSubmit={form.handleSubmit(onSubmit)}>
    {/* form fields */}
</form>

{/* Button outside the form */}
<Button type="submit" form="my-form" disabled={!form.formState.isDirty}>
    Save
</Button>
```

### Controller Pattern

Always use `Controller` from react-hook-form to wrap form fields:

```tsx
<Controller
    control={form.control}
    name="fieldName"
    render={({ field, fieldState }) => (
        <FormField
            label="Label"
            isInvalid={fieldState.invalid}
            error={fieldState.error}
        >
            <Input
                aria-invalid={fieldState.invalid}
                placeholder="Placeholder"
                {...field}
            />
        </FormField>
    )}
/>
```

The `field` object contains: `value`, `onChange`, `onBlur`, `name`, `ref`
The `fieldState` object contains: `invalid`, `error`, `isDirty`, `isTouched`

### FormField Props

The `FormField` component accepts:
- `label`: Field label text
- `isInvalid`: Boolean from `fieldState.invalid`
- `error`: Error object from `fieldState.error`
- `children`: The input component

### Resetting Form with External Data

When populating form with data (e.g., from API):

```tsx
useEffect(() => {
    if (data) {
        form.reset({
            fieldName: data.fieldName ?? "",
            email: data.email ?? "",
        });
    }
}, [data, form.reset]);
```

## Component Reference

| Component | Purpose | Import |
|-----------|---------|--------|
| `FieldSet` | Groups related fields, provides spacing | `@/components/ui/field` |
| `FieldGroup` | Groups fields within a fieldset | `@/components/ui/field` |
| `FormField` | Wraps input with label and error display | `@/components/FormField` |
| `Field` | Base field component (used by FormField) | `@/components/ui/field` |
| `FieldLabel` | Label component | `@/components/ui/field` |
| `FieldError` | Error display component | `@/components/ui/field` |
| `FieldDescription` | Description text below field | `@/components/ui/field` |

## Validation Examples

Common zod validators (no hardcoded error messages needed - they come from translations):

```tsx
const formSchema = z.object({
    required: z.string().min(1),
    email: z.email(),
    minLength: z.string().min(3),
    maxLength: z.string().max(100),
    number: z.coerce.number().min(0),
    optional: z.string().optional(),
    url: z.url(),
});
```

## Translated Validation Errors

This project uses a custom `useZodResolver` hook that automatically translates zod validation errors using next-intl. Error messages are defined in `messages/en.json` under the `Validation` key.

### How It Works

1. **Error Map**: `src/lib/zod-error-map.ts` maps zod error codes to translation keys
2. **Hook**: `src/hooks/use-zod-error-map.ts` provides `useZodResolver` which creates a resolver with translated errors
3. **Translations**: `messages/en.json` contains the `Validation` section with all error messages

### Adding New Error Messages

If you need a custom error message, add it to `messages/en.json`:

```json
{
    "Validation": {
        "customError": "Your custom error message"
    }
}
```

Then handle it in `src/lib/zod-error-map.ts`.

### Available Translation Keys

| Key | Message | Used For |
|-----|---------|----------|
| `required` | This field is required | Missing required fields |
| `stringEmpty` | Cannot be empty | `z.string().min(1)` |
| `stringMin` | Must be at least {min} characters | `z.string().min(n)` |
| `stringMax` | Must be at most {max} characters | `z.string().max(n)` |
| `invalidEmail` | Invalid email address | `z.email()` |
| `invalidUrl` | Invalid URL | `z.url()` |
| `numberMin` | Must be at least {min} | `z.number().min(n)` |
| `numberMax` | Must be at most {max} | `z.number().max(n)` |

## Reference Implementation

See `src/app/(app)/settings/account/components/Profile.tsx` for a complete working example.
