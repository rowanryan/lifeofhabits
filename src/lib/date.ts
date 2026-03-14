export function getPartOfDay(time: string | null): string | null {
    if (!time) return null;

    const hourString = time.split(":")[0];
    if (!hourString) return null;

    const hour = parseInt(hourString, 10);

    if (hour >= 5 && hour < 12) return "morning";

    if (hour >= 12 && hour < 17) return "afternoon";

    if (hour >= 17 && hour < 21) return "evening";

    return "night";
}
