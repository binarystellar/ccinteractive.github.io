document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('map-container');
    const buttons = document.querySelectorAll('.action-btn');

    const mapRect = mapContainer.getBoundingClientRect();
    const draggableArea = {
        top: mapRect.top,
        left: mapRect.left,
        right: mapRect.right,
        bottom: mapRect.bottom
    };


    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const memberLi = event.currentTarget.closest('.team-member'); // Get parent li
            const memberId = memberLi.getAttribute('data-member-id'); // Get the ID
            const memberName = memberLi.querySelector('input').value || `Member ${memberId}`; // Use ID if name is empty
            const iconSrc = event.currentTarget.getAttribute('data-icon');

            spawnOrUpdateDraggable(memberId, memberName, iconSrc);
        });
    });

    function spawnOrUpdateDraggable(memberId, memberName, iconSrc) {
        let draggableContainer = document.getElementById(`draggable-container-${memberId}`);
        let isNew = false;

        if (!draggableContainer) {
            isNew = true;
            draggableContainer = document.createElement('div');
            draggableContainer.id = `draggable-container-${memberId}`;
            draggableContainer.className = 'draggable-container';
            // Set initial position styles *before* adding to DOM if possible
            draggableContainer.style.position = 'absolute'; // Ensure it's absolute
            draggableContainer.style.display = 'block'; // Make it visible immediately
            // Set a default starting position (e.g., top-left or center)
            draggableContainer.style.top = '10px'; // Example: Start near top-left
            draggableContainer.style.left = '10px'; // Example: Start near top-left
            mapContainer.appendChild(draggableContainer);
        }

        draggableContainer.innerHTML = `
            <div class="draggable">
                <img src="${iconSrc}" alt="Icon for ${memberName || memberId}">
                <span>${memberName || memberId}</span>
            </div>
        `;
        draggableContainer.style.display = 'block'; // Ensure visible if updated


        const draggableElement = draggableContainer.querySelector('.draggable');
        // Ensure the inner element doesn't interfere with container positioning initially
        draggableElement.style.position = 'relative'; // Make inner draggable relative to container

        makeElementDraggable(draggableElement, draggableContainer);
    }

    function makeElementDraggable(draggableElement, containerElement) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        draggableElement.onpointerdown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onpointerup = closeDragElement; // Use onpointer instead of onmouse, for compatibility
            document.onpointermove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
    
            // Calculate new cursor position:
            pos1 = pos3 - e.clientX; // How much the mouse moved horizontally
            pos2 = pos4 - e.clientY; // How much the mouse moved vertically
            pos3 = e.clientX;        // Update mouse X
            pos4 = e.clientY;        // Update mouse Y
    
            // Calculate new position relative to map container
            let newTop = containerElement.offsetTop - pos2;
            let newLeft = containerElement.offsetLeft - pos1;
    
            // Get map container dimensions (inside the function for accuracy)
            const mapWidth = mapContainer.offsetWidth;
            const mapHeight = mapContainer.offsetHeight;
    
            // Get draggable element dimensions
            const elemWidth = containerElement.offsetWidth;
            const elemHeight = containerElement.offsetHeight;
    
            // Constrain the element within the map container boundaries
            // Top boundary
            if (newTop < 0) {
                newTop = 0;
            }
            // Left boundary
            if (newLeft < 0) {
                newLeft = 0;
            }
            // Bottom boundary
            if (newTop + elemHeight > mapHeight) {
                newTop = mapHeight - elemHeight;
            }
            // Right boundary
            if (newLeft + elemWidth > mapWidth) {
                newLeft = mapWidth - elemWidth;
            }
    
            // Apply the constrained position (relative to mapContainer)
            containerElement.style.top = newTop + 'px';
            containerElement.style.left = newLeft + 'px';
        }

        function closeDragElement() {
            document.onpointerup = null;
            document.onpointermove = null;
        }
    }
});
