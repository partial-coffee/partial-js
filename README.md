Partial.js
==========

Partial.js is a lightweight JavaScript library designed to simplify handling partial updates and event-driven interactions in web applications. It provides a declarative approach to dynamic content rendering, state management, and AJAX requests, along with support for Server-Sent Events (SSE).

Features
--------

*   **Declarative Attribute-Based API:** Define behaviors directly in HTML using custom attributes like x-get, x-post, x-target, and more.
*   **Server-Sent Events (SSE):** Seamlessly handle real-time updates.
*   **Infinite Scroll:** Built-in support for infinite scrolling functionality.
*   **Customizable Hooks and Middleware:** Add pre- and post-action hooks and middleware for request handling.
*   **Content Swapping Options:** Flexible swapping mechanisms such as outerHTML and innerHTML.
*   **Automatic Event Handling:** Automatically scans and initializes elements with Partial.js attributes.
*   **Error Handling:** Customizable error handling with user-defined callbacks.


Installation
------------

### Using npm:

```bash
npm install partial-js
```

### Using a CDN:

```html
<script src="https://cdn.jsdelivr.net/partial-coffee/partial-js"></script>
```

Usage
-----

### Basic Example

Add the library to your project and use custom attributes to define dynamic behavior:

```html 
<div id="content" x-get="/api/content" x-target="#content">Load Content</div>
<script>
  const partial = new Partial();
</script>
```

### Server-Sent Events (SSE)

```javascript
<div x-sse="/api/stream">Listening for updates...</div>
<script>
  const partial = new Partial();
</script>
```

### Infinite Scroll

```html
<div x-infinite-scroll x-get="/api/items" x-target="#items">
  <div id="items">Initial content</div>
</div>
<script>
  const partial = new Partial();
</script>
```

Configuration
-------------

When initializing a Partial instance, you can pass an options object to customize behavior:

```javascript
const partial = new Partial({
  defaultSwapOption: 'innerHTML', // Default content swap method
  onError: (error) => console.error(error), // Error handling callback
  csrfToken: () => document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
  autoFocus: true, // Automatically focus on updated elements
  debounceTime: 300, // Debounce time for event handlers
});
```

Attributes
----------

### Actions

*   x-get: Perform a GET request.
*   x-post: Perform a POST request.
*   x-put: Perform a PUT request.
*   x-delete: Perform a DELETE request.
*   x-patch: Perform a PATCH request.


### Targeting and Behavior

*   x-target: CSS selector of the element to update.
*   x-trigger: Event to trigger the action (e.g., click, submit).
*   x-debounce: Debounce time in milliseconds.
*   x-swap: Content swap method (outerHTML or innerHTML).
*   x-sse: URL for Server-Sent Events.
*   x-infinite-scroll: Enable infinite scroll.


### Additional Attributes

*   x-params: JSON string of additional parameters.
*   x-indicator: Selector for a loading indicator element.
*   x-confirm: Confirmation message before performing the action.
*   x-loading-class: Class to apply during loading.
*   x-retry: Number of retries for failed requests.


Hooks and Middleware
--------------------

### Hooks

Hooks allow you to execute custom code at various stages of an action.

```javascript
partial.addHook('beforeRequest', (context) => {
  console.log('Before request:', context);
});

partial.addHook('afterResponse', (context) => {
  console.log('After response:', context);
});
```

Available hooks:

*   onAction
*   beforeRequest
*   afterResponse
*   afterSettle
*   beforeSettle


### Middleware

Middleware can be added to modify or augment requests:

```javascript
partial.use(async (requestParams, next) => {
  console.log('Middleware:', requestParams);
  return await next();
});
```

Error Handling
--------------

Custom error handling can be implemented via the onError callback:

```javascript
const partial = new Partial({
  onError: (error, element) => {
    console.error('Error:', error);
    element.innerHTML = `<div class="error">${error.message}</div>`;
  },
});
```

API Reference
-------------

### Constructor

```javascript
new Partial(options: PartialOptions);
```

### Options

| Option            | Type     | Description                                                                  |
|-------------------|----------|------------------------------------------------------------------------------|
| defaultSwapOption | string   | Default content swap method (outerHTML or innerHTML).                        |
| onError           | Function | Error handling callback.                                                     |
| csrfToken         | Function | Function to retrieve the CSRF token.                                         |
| autoFocus         | boolean  | Automatically focus on updated elements.                                     |
| debounceTime      | number   | Debounce time for event handlers.                                            |


### Methods

#### addHook(hookName: string, callback: Function): void

Registers a hook.

#### use(middleware: Function): void

Adds middleware.

#### dispatchEvent(eventName: string, eventData: any): void

Dispatches a custom event.

#### refresh(container: HTMLElement): void

Rescans a container for Partial.js elements.

License
-------

This project is licensed under the MIT License.

For more details, visit the [GitHub repository](https://github.com/partial-coffee/partial-js).