const textarea = document.querySelector("#note-text");
const editNoteBtn = document.querySelector("#edit-note");
const saveNoteBtn = document.querySelector("#save-note");
const cancelNoteBtn = document.querySelector("#cancel-note");
const deleteNoteBtn = document.querySelector("#delete-note");

let content;

editNoteBtn.addEventListener("click", handleEditNote);
saveNoteBtn.addEventListener("click", handleSaveNote);
cancelNoteBtn.addEventListener("click", handleCancelNote);
deleteNoteBtn.addEventListener("click", handleDeleteNote);

function handleEditNote() {
  content = textarea.textContent;
  toggleEditNote(true);
}

function handleSaveNote() {
  toggleEditNote(false);
}

function handleCancelNote() {
  textarea.value = content;
  toggleEditNote(false);
}

function toggleEditNote(on) {
  if (on) {
    textarea.disabled = false;
    textarea.style.webkitAppRegion = "no-drag";
    textarea.focus();
    editNoteBtn.style.display = "none";
    saveNoteBtn.style.display = "inline-block";
    cancelNoteBtn.style.display = "inline-block";
  } else {
    textarea.disabled = true;
    textarea.style.webkitAppRegion = "drag";
    textarea.blur();
    editNoteBtn.style.display = "inline-block";
    saveNoteBtn.style.display = "none";
    cancelNoteBtn.style.display = "none";
  }
}

function handleDeleteNote() {
  const ok = confirm("Are you sure you want to delete this sticky note?");

  if (ok) {
    window.electronAPI.deleteNote();
  }
}
