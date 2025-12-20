type AcceptedFunction = (logLevel: logLevel, message: string, ...others: unknown[]) => void;
type NotifQueue = Parameters<typeof realShowNotif>[];
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

let logFunction: AcceptedFunction | undefined;
let showingNotif = false;
let showNextNotifTimeout: NodeJS.Timeout;
let currentNotifOptions: NotifQueue[number] | undefined;
const notifQueue: NotifQueue = [];


// not worth having whole html file for
const notifContainer = document.createElement("div");
notifContainer.id = "notifContainer";

const notif = document.createElement("div");
notif.id = "notif";

notifContainer.appendChild(notif);
document.body.appendChild(notifContainer);


/** 
 * @param func A custom function that is called when showNotif is called. This is optional
 * Type: (logLevel: string, message: string, error: unknown) => void
 * @returns the showNotif function
 * @example export const showNotif = initNotif(logToConsole);
 */
export default function initNotif(func?: AcceptedFunction) {
	if (func && typeof func !== "function")
		throw new Error("Log function in showNotif was changed to something uncallable");

	logFunction = func;

	return showNotif;
}


/**
 * Logs and queues the notification, or immediately shows it if avalible
 * @param logType log, warn or error. If it is a error the notif will flash
 * @param userMessage The message that will be shown to the user on the notification
 * @param devMessage The message that will be logged in console and saved, if null, it will be the same as userMessage
 * @param options Options for this function. See {@linkcode NotifOptions} for more detail
 * @param err Meant for the error object, can be used for anything you want to be logged to console but sent to the notif
 */
function showNotif(
	logType: logLevel,
	userMessage: string | null,
	devMessage?: string | null,
	options?: NotifOptions,
	err?: unknown
) {
	if (!userMessage && !devMessage)
		throw new Error("showNotif called but no message was passed in!");

	if (!options || options.log)
		console[logType](devMessage ?? userMessage!, err);

	if (logFunction)
		logFunction(logType, devMessage ?? userMessage!, err);

	if (options?.skipQueue) {
		// When current notif is interrupted
		if (showingNotif) {
			clearTimeout(showNextNotifTimeout);

			if (currentNotifOptions)
				notifQueue.unshift(currentNotifOptions);
		}

		realShowNotif(logType, userMessage ?? devMessage!, options);
	}

	if (!showingNotif)
		realShowNotif(logType, userMessage ?? devMessage!, options);
	else
		notifQueue.push([logType, userMessage ?? devMessage!, options]);
}


function realShowNotif(
	logType: logLevel,
	userMessage: string,
	options?: NotifOptions
) {
	showingNotif = true;

	if (options?.displayTime && options.displayTime !== true)
		showNextNotifTimeout = setTimeout(showNextNotif, options.displayTime ?? 5000);

	if (options?.flash || logType === "error")
		notif.classList.add("warning");
	else
		notif.classList.remove("warning");

	notif.textContent = userMessage;
	notifContainer.style.top = "20px";
	notif.addEventListener("click", showNextNotif);
}


function showNextNotif() {
	currentNotifOptions = notifQueue.shift();

	if (currentNotifOptions) {
		realShowNotif(...currentNotifOptions);
		return;
	}

	showingNotif = false;
	notifContainer.style.top = "-100px";
}

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
unsafeWindow.showNotif = showNotif;