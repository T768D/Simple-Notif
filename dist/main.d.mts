type AcceptedFunction = (logLevel: logLevel, message: string, ...others: unknown[]) => unknown;
export type logLevel = "log" | "warn" | "error";
interface NotifOptions {
    /**
     * Number in milliseconds for when the display will change.
     * Defaults to 5000ms
     * If this is true, it means it will never close unless manually closed
    */
    displayTime?: number | true;
    /** Whether or not the display will flash red */
    flash?: boolean;
    /**
     * Whether or not the notif is logged to console. By default this is true
     * It uses the logType to log a item to the console, eg if logType is warn, itll be console.warn()
    */
    log?: boolean;
    /**
     * Whether the item should be immediately displayed
     * The item previously displayed will be put back into the front of the queue
     */
    skipQueue?: boolean;
}
/**
 * @param func A custom function that is called when showNotif is called. This is optional
 * @returns the showNotif function
 * @example export const showNotif = initNotif(logToConsole);
 */
export default function initNotif(func?: AcceptedFunction): typeof showNotif;
/**
 * Logs and queues the notification, or immediately shows it if avalible
 * @param logType log, warn or error. If it is a error the notif will flash
 * @param userMessage The message that will be shown to the user on the notification
 * @param devMessage The message that will be logged in console and saved, if null, it will be the same as userMessage
 * @param options Options for this function. See {@linkcode NotifOptions} for more detail
 * @param err Meant for the error object, can be used for anything you want to be logged to console
 */
declare function showNotif(logType: logLevel, userMessage: string | null, devMessage?: string | null, options?: NotifOptions, err?: unknown): void;
export {};
