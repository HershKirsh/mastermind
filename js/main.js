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
        const match = { white: [], red: [] };
        htmlElements.rows[row].querySelectorAll('.peg-hole').forEach((elem, i) => {
            const color = elem.classList[1];
            if (!this.s.includes(color)) return
            if ((!match.white.includes(color) && !match.red.includes(color)) || (this.s.filter(x => x === color).length > (match.white.filter(x => x === color).length + match.red.filter(x => x === color).length))) {
                if (this.s[i] === color) {
                    match.white.push(color);
                } else {
                    match.red.push(color);
                }
            } else if (match.red.includes(color)) {
                if (this.s[i] === color) {
                    match.red.splice(match.red.indexOf(color), 1);
                    match.white.push(color);
                }
            }
        });
        match.white.forEach(x => {
            htmlElements.rows[row].querySelector('.marking-hole:not(.taken)').classList.add('white-mark', 'taken');
        });
        match.red.forEach(x => {
            htmlElements.rows[row].querySelector('.marking-hole:not(.taken)').classList.add('red-mark', 'taken');
        });
    }
}

const dragElems = {
    draggedColor: '',
    currentPeg: '',
    drag: function () {
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
            this.currentPeg = elem;
        }
    },
    keepPeg: function (e, elem) {
        if (this.draggedColor) elem.classList.add(this.draggedColor);
    },
    removePeg: function (e, elem) {
        elem.classList.contains('changed') ? elem.classList.remove('changed') : gameElems.placedPegCount--;
        if (this.draggedColor && elem === this.filledHole) {
            elem.classList.remove(this.draggedColor, 'filled');
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
