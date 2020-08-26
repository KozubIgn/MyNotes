let toDragElem,
    pointX,
    pointY;

function drag(event) {
    let boundingClientRect;
    if (event.target.className.indexOf('title-bar') === -1) {
        return;
    }
    toDragElem = this;
    boundingClientRect = toDragElem.getBoundingClientRect();

    pointX = boundingClientRect.left - event.clientX;
    pointY = boundingClientRect.top - event.clientY;
}

function onDrag(event) {
    if (!toDragElem) {
        return;
    }
    let positionX = event.clientX + pointX;
    let positionY = event.clientY + pointY;
    if (positionX < 0) {
        positionX = 0;
    }
    if (positionY < 0) {
        positionY = 0;
    }
    toDragElem.style.transform = "translateX(" + positionX + "px) translateY(" + positionY + "px)";
}

function drop() {
    toDragElem = null;
    pointX = null;
    pointY = null;
}

function newNoteId() {
    return `${new Date().getTime()}`;
}

function createNewNote(noteId, title, content) {
    const template = document.querySelector("#note-template");
    const clone = document.importNode(template.content, true);
    clone.querySelector(".note").setAttribute("id", noteId);
    clone.querySelector(".title-bar").value = title;
    clone.querySelector(".note-content").value = content;
    return clone;
}

function deleteNote(event) {
    let elemToDelete = event.target.parentNode;
    localStorage.removeItem(`${elemToDelete.id}`);
    elemToDelete.remove();
}

function setElemInLocalStorage(element) {
    localStorage.setItem(`${element.getAttribute("id")}`, JSON.stringify({
        title: `${element.querySelector(".title-bar").value}`,
        content: `${element.querySelector(".note-content").value}`
    }));
}

function save(event) {
    let changedElement = event.target.parentNode;
    setElemInLocalStorage(changedElement);
}

function appendNewNoteToLocalStorage(noteId = newNoteId(), title = "title", content = "type here...", isElementNew = true) {
    document.querySelector('div.content').appendChild(createNewNote(noteId, title, content));
    let newElement = document.querySelector("div.content div.note:last-of-type");
    newElement.querySelector("button.deleteNote").addEventListener("click", deleteNote);
    newElement.querySelector("textarea.title-bar").addEventListener("input", save);
    newElement.querySelector("textarea.note-content").addEventListener("input", save);
    newElement.addEventListener('mousedown', drag, false);
    if (isElementNew) setElemInLocalStorage(newElement);
}

function appendDefaultNote() {
    appendNewNoteToLocalStorage();
}

function loadNotes() {
    let index = 0;
    let noteId;
    while (noteId = localStorage.key(index)) {
        let storedNote = JSON.parse(localStorage.getItem(noteId));
        appendNewNoteToLocalStorage(noteId, storedNote.title, storedNote.content, false)
        index++;
    }
}

function main() {
    loadNotes();
    document.querySelector("button.newNote").addEventListener("click", appendDefaultNote);
}
document.addEventListener('mousemove', onDrag, false);
document.addEventListener('mouseup', drop, false);

main();
