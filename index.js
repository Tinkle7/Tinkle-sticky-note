document.onmousedown = clearMenus; //Clear menus when the mouse is clicked to the side
window.addEventListener("load", loadNotes); //  load notes that are in local storage
if ("onvisibilitychange" in document)
  document.addEventListener("visibilitychange", storeNotes);
else window.addEventListener("pagehide", storeNotes);

let notesCount = 0; //give a unique id to each note

// creates a new note and adds it to the document.
function addNote(title = "", content = "", color = "") {
  console.log("Add button pressed");

  //Create note container
  let note = document.createElement("div");
  note.onmousedown = selectNote;
  note.ontouchstart = selectNote;
  note.className = "note";
  note.style.backgroundColor = color;

  //Create text input for note title
  let titleInput = document.createElement("textarea");
  titleInput.placeholder = "Title";
  titleInput.className = "note-title";
  titleInput.onkeydown = keyDown;
  titleInput.value = title;
  note.appendChild(titleInput);

  //Create text box for the content of the note
  let textBox = document.createElement("textarea");
  textBox.placeholder = "Write your note here";
  textBox.className = "note-content";
  textBox.onkeydown = keyDown;
  textBox.value = content;
  note.appendChild(textBox);

  //Create the option button for the note
  let optionButton = document.createElement("button");
  optionButton.className = "option-button";
  optionButton.textContent = "...";
  optionButton.onmousedown = noteMenu;
  optionButton.ontouchstart = noteMenu;
  note.appendChild(optionButton);

  note.id = ++notesCount;

  document.body.appendChild(note); //Add the note to the document

  titleInput.focus(); //Set focus to the title of the new note
}

let selectedNote = null;

// selectNote sets the selected note to the one the user clicks on.
function selectNote() {
  selectedNote = this;
}

// keyDown checks the overflow of note text boxes when a key is pressed.
function keyDown() {
  checkOverflow(this);
}

//noteMenu creates the note options menu.
function noteMenu() {
  console.log("option button pressed");

  let menus = document.getElementsByClassName("note-menu"); // Get all menus

  for (let i = 0; i < menus.length; i++) {
    menus[i].remove();
  }

  let noteMenu = document.createElement("div");
  noteMenu.className = "note-menu";

  let colors = [
    "#FFFFFF",
    "#CBD2D6",
    "#FAF1DB",
    "#FDE9D9",
    "#F9DCD5",
    "#E9C46A",
  ];

  // Create different color buttons
  colors.forEach((color) => {
    let colorOption = document.createElement("button");
    colorOption.className = "color-option";
    colorOption.style.backgroundColor = color;
    colorOption.onmousedown = setColor;
    colorOption.ontouchstart = setColor;
    noteMenu.appendChild(colorOption);
  });

  // Create a delete button
  let deleteButton = document.createElement("div");
  deleteButton.className = "delete-note";
  deleteButton.onmousedown = () => {
    setTimeout(deleteNote.bind(deleteButton), 155);
  };
  let deleteText = document.createElement("p");
  deleteText.textContent = "Delete";
  deleteText.className = "delete-text";
  deleteButton.appendChild(deleteText);
  noteMenu.appendChild(deleteButton);

  this.parentNode.appendChild(noteMenu); // Add the menu to the note
}

// setColor sets the color of a note to the color of the button pressed.
function setColor() {
  console.log("color button pressed");

  let note = this.parentNode.parentNode;
  let newColor = this.style.backgroundColor;

  note.style.backgroundColor = newColor;
}

/**
 clearMenus clears all menus that the mouse is not hovering over.
 * @param {MouseEvent} event
 */
function clearMenus(event) {
  console.log("Clear menus");
  console.log("ClientX: " + event.clientX);
  console.log("ClientY: " + event.clientY);

  let noteMenus = document.getElementsByClassName("note-menu"); // Get all menus

  for (let i = 0; i < noteMenus.length; i++) {
    let rect = noteMenus[i].getBoundingClientRect();

    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      if (noteMenus[i].id == "active") {
        noteMenus[i].remove();
      } else {
        noteMenus[i].id = "active";
      }
    }
  }
}

// deleteNote deletes a note whose delete button was pressed
function deleteNote() {
  let thisNote = this.parentNode.parentNode;

  let notes = document.getElementsByClassName("note");
  let oldRects = new Map(); // Initialize an array for the old note positions

  // Collect all the current note positions
  for (let i = 0; i < notes.length; i++) {
    let rect = notes[i].getBoundingClientRect();
    oldRects.set(notes[i].id, rect);
  }

  thisNote.remove();
}

/**
 * @typedef Note
 * @type {object}
 * @property {string} title
 * @property {string} content
 * @property {string} color
 */
class Note {
  constructor(title = "", content = "", color = "") {
    this.title = title;
    this.content = content;
    this.color = color;
  }
}

/**
 * store in local storage
 *
 * @returns {void}
 */
function storeNotes() {
  /**
   * @type {HTMLDivElement[]}
   */
  const noteElements = Array.from(document.getElementsByClassName("note"));
  console.log(noteElements);

  /**
   * @type {Note[]}
   */
  const noteObjects = [];

  noteElements.forEach((note) => {
    noteObjects.push(
      new Note(
        note.children[0].value, // Title
        note.children[1].value, // Content
        note.style.backgroundColor
      )
    );
  });

  console.log(noteObjects);

  localStorage.setItem("notes", JSON.stringify(noteObjects));
}

/**
 * loadNotes gets the notes stored in localStorage,
 * if there are any, and adds them to the document.
 *
 * @returns {void}
 */
function loadNotes() {
  const data = localStorage.getItem("notes");

  if (data === null) return;

  /**
   * @type Note[]
   */
  const noteObjects = JSON.parse(data);

  noteObjects.forEach((note) => {
    addNote(note.title, note.content, note.color);
  });
}
