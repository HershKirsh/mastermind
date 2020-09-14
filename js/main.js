const htmlElements = {
    rows: document.querySelectorAll('.row'),
    colorPegs: document.querySelectorAll('.color-peg')
}

const gameElems = {
    currentRow: 0,
    placedPegCount: 0,
    colors: ['white', 'yellow', 'turquoise', 'orange', 'purple', 'pink'],
    s: [0, 0, 0, 0],
    startGame: function (btn) {
        this.activateRow();
        this.s = this.s.map(n => this.colors[Math.floor(Math.random() * 6)])
    },
    activateRow: function () {
        htmlElements.rows[this.currentRow].classList.remove('active')
        this.currentRow++;
        this.placedPegCount = 0;
        htmlElements.rows[this.currentRow].classList.add('active')
        htmlElements.rows[this.currentRow].querySelectorAll('.peg-hole').forEach(elem => {
            elem.addEventListener('dragenter', (e) => {
                if (elem.parentElement.classList.contains('active')) {
                    e.preventDefault();
                    dragElems.addPeg(e, elem);
                }
            })
            elem.addEventListener('dragover', (e) => {
                if (elem.parentElement.classList.contains('active')) {
                    e.preventDefault();
                    dragElems.keepPeg(e, elem);
                }
            })
            elem.addEventListener('dragleave', (e) => {
                if (elem.parentElement.classList.contains('active')) {
                    dragElems.removePeg(e, elem);
                }
            })
        });
    },
    markRow: function (row) {
        htmlElements.rows[row].querySelectorAll('.peg-hole').forEach((elem, i) => {
            if (!this.s.includes(elem.classList[1])) return
            if (i === this.s.indexOf(elem.classList[1])) {
                console.log(elem.classList[1] + ' - ' + this.s.indexOf(elem.classList[1]) + ' - ' + i);
                htmlElements.rows[row].querySelector('.marking-hole:not(.taken)').classList.add('white-mark', 'taken')
            } else {
                htmlElements.rows[row].querySelector('.marking-hole:not(.taken)').classList.add('red-mark', 'taken')
            }
        })
    }
}

const dragElems = {
    draggedColor: '',
    drag: function (elem) {
        dragElems.draggedColor = this.id;
    },
    endDrag: function (e, elem) {
        this.draggedColor = '';
        this.filledHole = '';
        if (gameElems.placedPegCount === 4) {
            gameElems.markRow(gameElems.currentRow)
            gameElems.activateRow();
        }
    },
    addPeg: function (e, elem) {
        if (this.draggedColor) {
            console.log(this.draggedColor);
            elem.classList.contains('filled') ? elem.classList.add('changed') : gameElems.placedPegCount++;
            this.filledHole = elem;
            elem.classList.add(this.draggedColor, 'filled');
            console.log('incremented to: ' + gameElems.placedPegCount);
        }
    },
    keepPeg: function (e, elem) {
        if (this.draggedColor) elem.classList.add(this.draggedColor);
    },
    removePeg: function (e, elem) {
        elem.classList.contains('changed') ? elem.classList.remove('changed') : gameElems.placedPegCount--;
        if (this.draggedColor && elem === this.filledHole) {
            elem.classList.remove(this.draggedColor, 'filled');
            console.log('decremented to: ' + gameElems.placedPegCount);
        }
    }
}

htmlElements.colorPegs.forEach(elem => {
    // funArray[currentRow][currentPeg].drag = dragElems.drag
    // elem.addEventListener('drag', (e) => {
    //     dragElems.drag(elem)
    // })
    elem.addEventListener('drag', dragElems.drag)
    elem.addEventListener('dragend', (e) => {
        dragElems.endDrag(e, elem)
    })
})
