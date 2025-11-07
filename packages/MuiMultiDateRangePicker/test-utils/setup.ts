import { Window } from "happy-dom";

// Set up happy-dom as the DOM environment
const window = new Window();
const document = window.document;

// @ts-ignore
global.window = window;
// @ts-ignore
global.document = document;
// @ts-ignore
global.navigator = window.navigator;
// @ts-ignore
global.HTMLElement = window.HTMLElement;
// @ts-ignore
global.Element = window.Element;
// @ts-ignore
global.Event = window.Event;
// @ts-ignore
global.PointerEvent = window.PointerEvent;

// Set React testing environment flag
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
