export default (container, handle) => {
    const rect = container.getBoundingClientRect();
    const initialX = rect.x;
    const initialY = rect.y;

    container.style.position = 'absolute';
    container.style.top = `${initialY}px`;
    container.style.left = `${initialX}px`;

    let dragging = false;
    let offsetX;
    let offsetY;

    handle.addEventListener('mousedown', (e) => {
        dragging = !dragging;

        const containerRect = container.getBoundingClientRect();
        offsetX = e.clientX - containerRect.left;
        offsetY = e.clientY - containerRect.top;
    });

    document.body.addEventListener('mouseup', (e) => {
        dragging = false;
    });

    document.body.addEventListener('mousemove', (e) => {
        if(dragging) {
            container.style.left = `${e.clientX - offsetX}px`;
            container.style.top = `${e.clientY - offsetY}px`;
        }
    });
};
