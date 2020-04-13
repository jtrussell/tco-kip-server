export default (container, handle, options = {}) => {
    const rect = container.getBoundingClientRect();
    const initialX = rect.x;
    const initialY = rect.y;

    const initialTopStyle = container.style.top;
    const initialLeftStyle = container.style.left;
    const initialPositionStyle = container.style.position;

    container.style.position = 'absolute';
    container.style.top = `${initialY}px`;
    container.style.left = `${initialX}px`;

    options.baseOffsetX = options.baseOffsetX || 0;
    options.baseOffsetY = options.baseOffsetY || 0;

    let dragging = false;
    let offsetX;
    let offsetY;

    const handleHandlerMouseDown = (e) => {
        dragging = !dragging;

        const containerRect = container.getBoundingClientRect();
        offsetX = e.clientX - containerRect.left;
        offsetY = e.clientY - containerRect.top;
    };

    const handleMouseUp = (e) => {
        dragging = false;
    };

    const handleMouseMove = (e) => {
        if(dragging) {
            container.style.left = `${e.clientX - offsetX - options.baseOffsetX}px`;
            container.style.top = `${e.clientY - offsetY - options.baseOffsetY}px`;
        }
    };

    handle.addEventListener('mousedown', handleHandlerMouseDown);
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);

    const teardown = () => {
        container.style.position = initialPositionStyle;
        container.style.top = initialTopStyle;
        container.style.left = initialLeftStyle;

        handle.removeEventListener('mousedown', handleHandlerMouseDown);
        document.body.removeEventListener('mousemove', handleMouseMove);
        document.body.removeEventListener('mouseup', handleMouseUp);
    };

    return teardown;
};
