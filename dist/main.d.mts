type AcceptedFunction = (logLevel: logLevel, message: string, ...others: unknown[]) => void;
export type logLevel = "log" | "warn" | "error";
interface NotifOptions {
    /** If this is true, it means it will never close unless manually closed */
    displayTime?: number | true;
    flash?: boolean;
    log?: boolean;
    skipQueue?: boolean;
}
/**
 * @param func A custom function that is called when showNotif is called. This is optional
 * Type: (logLevel: string, message: string, error: unknown) => void
 * @returns the showNotif function
 * @example export const showNotif = initNotif(logToConsole);
 */
export default function initNotif(func?: AcceptedFunction): typeof showNotif;
/**
 * Logs and queues the notification, or immediately shows it if avalible
 * @param logType log, warn or error. If it is a error the notif will flash
 * @param userMessage The message that will be shown to the user on the notification
 * @param devMessage The message that will be logged in console and saved, if null, it will be the same as userMessage
 */
declare function showNotif(logType: logLevel, userMessage: string | null, devMessage?: string | null, options?: NotifOptions, err?: unknown): void;
export {};
