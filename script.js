document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('map-container');
    const buttons = document.querySelectorAll('.action-btn');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const memberName = event.currentTarget.parentNode.querySelector('input').value;
            const iconSrc = event.currentTarget.getAttribute('data-icon');
            const memberId = event.currentTarget.parentNode.querySelector('input').placeholder;

            spawnOrUpdateDraggable(memberId, memberName, iconSrc);
        });
    });

    function spawnOrUpdateDraggable(memberId, memberName, iconSrc) {
        let draggableContainer = document.getElementById(`draggable-container-${memberId}`);
        
        if (!draggableContainer) {
            draggableContainer = document.createElement('div');
            draggableContainer.id = `draggable-container-${memberId}`;
            draggableContainer.className = 'draggable-container';
            mapContainer.appendChild(draggableContainer);
        }

        draggableContainer.innerHTML = `
            <div class="draggable">
                <img src="${iconSrc}" alt="Icon">
                <span>${memberName}</span>
            </div>
        `;
        draggableContainer.style.display = 'block';
        draggableContainer.style.top = '50%';
        draggableContainer.style.left = '50%';

        const draggableElement = draggableContainer.querySelector('.draggable');
        makeElementDraggable(draggableElement, draggableContainer);
    }

    function makeElementDraggable(draggableElement, containerElement) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        draggableElement.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const mapRect = mapContainer.getBoundingClientRect();
            const elemRect = containerElement.getBoundingClientRect();

            let newTop = elemRect.top - pos2;
            let newLeft = elemRect.left - pos1;

            if (newTop < mapRect.top) newTop = mapRect.top;
            if (newLeft < mapRect.left) newLeft = mapRect.left;
            if (newTop + elemRect.height > mapRect.bottom) newTop = mapRect.bottom - elemRect.height;
            if (newLeft + elemRect.width > mapRect.right) newLeft = mapRect.right - elemRect.width;
            
            containerElement.style.top = (newTop - mapRect.top) + 'px';
            containerElement.style.left = (newLeft - mapRect.left) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
