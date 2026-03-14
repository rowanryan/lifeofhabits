export type DataLoaderProps<TData, TError> = {
    data: TData | undefined;
    isLoading: boolean;
    error: TError;
    children: (data: TData) => React.ReactNode;
    renderError: (error: TError) => React.ReactNode;
    loader: React.ReactNode;
};

export function DataLoader<TData, TError>({
    data,
    isLoading,
    error,
    children,
    renderError,
    loader,
}: DataLoaderProps<TData, TError>) {
    console.log("DataLoader", data);

    if (isLoading) {
        return loader;
    }

    if (error) {
        return renderError(error);
    }

    if (data === undefined) {
        return null;
    }

    return children(data);
}
