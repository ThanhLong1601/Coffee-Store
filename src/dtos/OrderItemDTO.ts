export type OrderItemDTO = {
    product: {
        image: string;
        name: string;
    };
    quantity: number;
    ristretto: "SMALL" | "MEDIUM" | "LARGE";
    isOnsite: boolean;
    size: "SMALL" | "MEDIUM" | "LARGE";
    time_prepare: boolean;
    prepare_time?: string | null;
}