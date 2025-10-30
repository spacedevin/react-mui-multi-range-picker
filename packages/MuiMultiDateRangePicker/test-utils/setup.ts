import { Window } from 'happy-dom';

// Set up happy-dom as the DOM environment
const window = new Window();
const document = window.document;

// @ts-expect-error
global.window = window;
// @ts-expect-error
global.document = document;
// @ts-expect-error
global.navigator = window.navigator;
// @ts-expect-error
global.HTMLElement = window.HTMLElement;
// @ts-expect-error
global.Element = window.Element;
// @ts-expect-error
global.Event = window.Event;
// @ts-expect-error
global.PointerEvent = window.PointerEvent;

// Set React testing environment flag
// @ts-expect-error
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
