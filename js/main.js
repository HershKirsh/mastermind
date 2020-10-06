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
        dragElems.activateColors();
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
                    dragElems.removePeg(elem);
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
                    match.red.push(color);
                } else {
                    match.white.push(color);
                }
            } else if (match.white.includes(color)) {
                if (this.s[i] === color) {
                    match.white.splice(match.red.indexOf(color), 1);
                    match.red.push(color);
                }
            }
        });
        match.red.forEach(x => {
            htmlElements.rows[row].querySelector('.marking-hole:not(.taken)').classList.add('red-mark', 'taken');
        });
        match.white.forEach(x => {
            htmlElements.rows[row].querySelector('.marking-hole:not(.taken)').classList.add('white-mark', 'taken');
        });
    }
}

const dragElems = {
    draggedColor: '',
    activateColors: function () {
        htmlElements.colorPegs.forEach(elem => {
            elem.draggable = true;
            elem.addEventListener('drag', dragElems.drag)
            elem.addEventListener('dragend', (e) => {
                dragElems.endDrag(e, elem)
            })
        })
    },
    drag: function () {
        dragElems.draggedColor = this.id;
    },
    addPeg: function (e, elem) {
        if (this.draggedColor && !elem.classList.contains('filled')) {
            elem.classList.add(this.draggedColor);
            gameElems.placedPegCount++;
            this.filledHole = elem;
        }
    },
    keepPeg: function (e, elem) {
        if (this.draggedColor && !elem.classList.contains('filled')) elem.classList.add(this.draggedColor);
    },
    removePeg: function (elem, removing) {
        if (elem.parentElement.classList.contains('active') && ((this.draggedColor && elem === this.filledHole) || removing)) {
            elem.classList = 'peg-hole';
            this.filledHole = '';
            gameElems.placedPegCount--;
        }
    },
    endDrag: function (e, elem) {
        if (this.filledHole) {
            this.filledHole.classList.add('filled');
            const thisPeg = this.filledHole;
            this.filledHole.addEventListener('click', () => this.removePeg(thisPeg, true))
            this.draggedColor = '';
            this.filledHole = '';
            if (gameElems.placedPegCount === 4) {
                gameElems.markRow(gameElems.currentRow)
                gameElems.activateRow();
            }
        }
    },
}
