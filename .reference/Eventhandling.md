## Best Practices for Event Handling

1. **Use event delegation:** Attach a single event listener to a parent (like the todo list <ul>), and handle events for all children inside that handler.

2. **Use descriptive handler function names:** Makes your code easier to read and debug.

3. **Avoid inline JavaScript:**  Always use addEventListener in your JS code, not in HTML attributes.

4. **Remove event listeners wwhen not needed:** Preents memory leaks in larger apps.

5. **Ensure accessibility:** Make sure the app is usable with keyboard and assistive tech.

## Why do we Abstract Event Handling?

- **Separation of concerns:** Keep event logic out of your rendering and state code, making your app easier to maintain.

- **Efficiency:** Sets your up for the best practices like event delegation, so you don't need to add a separate event listener to every todo item.

- **Scalability:** Makes it easy to add, remove, or change event handling logic as your app grows.

