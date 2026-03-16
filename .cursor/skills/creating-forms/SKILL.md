---
name: creating-forms
description: Create forms using react-hook-form with zod validation, Controller components, and the project's field component system. Use when building forms, adding form fields, creating input validation, or working with form submissions.
---

# Creating Forms

This skill covers how to create forms in this project using react-hook-form, zod validation, and the project's field component system.

## Required Imports

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FormField } from "@/components/FormField";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

```tsx
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fieldName: "",
        email: "",
    },
});
```

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

Common zod validators:

```tsx
const formSchema = z.object({
    required: z.string().min(1),
    email: z.string().email(),
    minLength: z.string().min(3),
    maxLength: z.string().max(100),
    number: z.coerce.number().min(0),
    optional: z.string().optional(),
    url: z.string().url(),
});
```

## Reference Implementation

See `src/app/(app)/settings/account/components/Profile.tsx` for a complete working example.
