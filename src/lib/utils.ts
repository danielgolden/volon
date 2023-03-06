import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import {
  saveAllNoteDataToLocalStorage,
  intializeLocalStorageData,
} from "./localStorage";
import {
  loadExistingDBData,
  deleteNoteInDB,
  updateNoteInDB,
  createNoteInDB,
} from "./supabase";
import { nextTick } from "vue";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { useGenericStateStore } from "../stores/store.genericState";
import { useSettingsStore } from "../stores/store.settings";
import { useNotebookStore } from "../stores/store.notebook";
import { useUiStateStore } from "../stores/store.ui";

export class Note {
  id: string | null;
  content: string;
  dateCreated: Date;
  lastModified: Date;

  constructor(content?: string) {
    const currentDate = new Date();

    this.id = uuidv4();
    this.content = content ?? "";
    this.dateCreated = currentDate;
    this.lastModified = currentDate;
  }
}

export const saveCurrentNoteChange = (currentContent: string) => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const currentNote = notebook.getNoteById(genericState.activeNoteId);

  currentNote.content = currentContent;
  currentNote.lastModified = new Date();

  if (genericState.userIsLoggedIn) {
    updateNoteInDB(currentNote);
  } else {
    saveAllNoteDataToLocalStorage();
  }
};

export const createNewNote = (contents: string = "") => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const newNoteData = new Note(contents);

  genericState.activeNoteId = newNoteData.id;
  genericState.activeNoteContents = contents;

  notebook.notes.push(newNoteData);

  if (genericState.userIsLoggedIn) {
    createNoteInDB(newNoteData);
  } else {
    saveAllNoteDataToLocalStorage();
  }
};

export const sortNotesByModificationDate = (notes: Note[]): Note[] => {
  const sortedNotes = notes.sort((currentNote, nextNote) => {
    return nextNote.lastModified.getTime() - currentNote.lastModified.getTime();
  });

  return sortedNotes;
};

export const sortNotesByCreationDate = (notes: Note[]): Note[] => {
  const sortedNotes = notes.sort((currentNote, nextNote) => {
    return nextNote.dateCreated.getTime() - currentNote.dateCreated.getTime();
  });

  return sortedNotes;
};

export const getIndexOfNoteById = (id: string | null, noteList?: Note[]) => {
  const notebook = useNotebookStore();
  const defaultNoteList = notebook.notes;

  if (!id) return null;

  const result = (noteList ?? defaultNoteList).findIndex(
    (note) => note.id === id
  );

  return result;
};

export const saveDeletedNoteForUndo = () => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const activeNote = notebook.getNoteById(genericState.activeNoteId);
  const alreadyDeletedNotes = localStorage.getItem("volonDeletedNotes");
  const currentActiveNoteId = genericState.activeNoteId;
  let saveDuration = 8000;
  let deletedNotes = alreadyDeletedNotes
    ? JSON.parse(alreadyDeletedNotes)
    : <Note[]>[];

  deletedNotes.push(activeNote);
  localStorage.setItem("volonDeletedNotes", JSON.stringify(deletedNotes));

  // Remove saved note after delay
  setTimeout(() => {
    const arrayWithoutDeletedNote = <Note[]>(
      JSON.parse(localStorage.getItem("volonDeletedNotes")!).filter(
        (note: Note) => note.id !== currentActiveNoteId
      )
    );

    localStorage.setItem(
      "volonDeletedNotes",
      JSON.stringify(arrayWithoutDeletedNote)
    );
  }, saveDuration);
};

export const undoDeleteNote = (noteId: string) => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const alreadyDeletedNotes = localStorage.getItem("volonDeletedNotes");

  if (alreadyDeletedNotes) {
    const rawNoteToRestore = JSON.parse(alreadyDeletedNotes).find(
      (note: Note) => note.id === noteId
    );
    const noteToRestore = {
      id: rawNoteToRestore.id,
      dateCreated: new Date(rawNoteToRestore.dateCreated),
      lastModified: new Date(rawNoteToRestore.lastModified),
      content: rawNoteToRestore.content,
    };

    notebook.notes.push(noteToRestore);

    if (genericState.userIsLoggedIn) {
      createNoteInDB(noteToRestore);
    } else {
      saveAllNoteDataToLocalStorage();
    }
  }
};

export const deleteActiveNote = () => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const uiState = useUiStateStore();
  const currentActiveNoteId = genericState.activeNoteId;
  const indexOfActiveNote = getIndexOfNoteById(genericState.activeNoteId);

  if (indexOfActiveNote === null) {
    throw new Error(`No note with the ID ${genericState.activeNoteId} found.`);
  }

  saveDeletedNoteForUndo();

  if (genericState.userIsLoggedIn) {
    deleteNoteInDB(notebook.getNoteById(genericState.activeNoteId));
    notebook.deleteActiveNote();
  } else {
    notebook.deleteActiveNote();
    saveAllNoteDataToLocalStorage();
  }

  uiState.addToast({
    title: "Note deleted",
    action: () => undoDeleteNote(currentActiveNoteId!),
    actionLabel: "Undo",
  });
};

export const setWindowDimensions = () => {
  const doc = document.documentElement;

  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
  doc.style.setProperty("--doc-width", `${window.innerWidth}px`);
};

export const navigateToNoteByRelativeIndex = (
  noteList: Note[],
  relativeIndex: number
) => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const indexOfActiveNote = getIndexOfNoteById(
    genericState.activeNoteId,
    noteList
  );
  const indexOfLastItemInNoteList = noteList.length - 1;
  const noteIsFirstInList = indexOfActiveNote === 0;
  const noteIsLastInList = indexOfActiveNote === indexOfLastItemInNoteList;

  if (noteIsFirstInList && relativeIndex < 0) return;
  if (noteIsLastInList && relativeIndex > 0) return;
  if (indexOfActiveNote === null) return;

  genericState.activeNoteId = noteList[indexOfActiveNote + relativeIndex].id;
  genericState.activeNoteContents = notebook.getNoteById(
    genericState.activeNoteId
  ).content;
};

export const navigateToPreviousNote = (noteList: Note[]) => {
  navigateToNoteByRelativeIndex(noteList, -1);
};

export const navigateToNextNote = (noteList: Note[]) => {
  navigateToNoteByRelativeIndex(noteList, 1);
};

export const downloadBackupOfData = () => {
  const settings = useSettingsStore();
  const notebook = useNotebookStore();
  const uiState = useUiStateStore();
  const dataToSave = {
    asideActive: settings.asideActive,
    markdownPreviewActive: settings.markdownPreviewActive,
    notes: notebook.notes,
  };
  const hiddenDownloadLink = document.createElement("a");
  hiddenDownloadLink.href =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(dataToSave));
  hiddenDownloadLink.target = "_blank";
  hiddenDownloadLink.download = `Volón Notes Backup (${format(
    new Date(),
    "MM/dd/yyyy"
  )}).json`;
  hiddenDownloadLink.click();

  uiState.addToast({
    title: "Backup downloaded",
  });
};

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const loadNotesData = async () => {
  const genericState = useGenericStateStore();
  if (genericState.userIsLoggedIn) {
    await loadExistingDBData();
  } else {
    intializeLocalStorageData();
  }
};

export const displayCommandPalette = () => {
  const elementRefs = useElementRefsStore();
  const uiState = useUiStateStore();
  uiState.toggleCommandPaletteActive();

  nextTick(() => {
    elementRefs.commandPaletteSearchInput?.focus();
  });
};

export const processUrlParams = (testParams?: string) => {
  // testParams is only used for testing this function

  const notebook = useNotebookStore();
  const genericState = useGenericStateStore();
  const urlParamsString = window.location.search;
  const urlParams = new URLSearchParams(testParams ?? urlParamsString);

  if (urlParams.has("noteId")) {
    const requestedNote = notebook.getNoteById(urlParams.get("noteId"));
    genericState.activeNoteId = requestedNote.id;
    genericState.activeNoteContents = requestedNote.content;
  }

  if (urlParams.has("search")) {
    genericState.noteListCurrentQuery = urlParams.get("search")!;
    genericState.urlHasSearch = true;
  }
};

export const setUrlParams = (desiredUrlParams: { [key: string]: any }) => {
  const urlParams = new URLSearchParams(desiredUrlParams);

  // Clear any existing urlParams
  history.replaceState(null, "", `${location.origin}?${urlParams}`);
};

export const copyNoteUrlToClipboard = async () => {
  const genericState = useGenericStateStore();
  const uiState = useUiStateStore();

  try {
    await navigator.clipboard.writeText(
      `${location.origin}?noteId=${genericState.activeNoteId}`
    );
    uiState.addToast({
      title: "Link copied to clipboard",
      icon: "check",
      iconColor: "#88d8aa",
    });
  } catch (err) {
    console.error("Failed to copy note URL to clipboard", err);
  }
};
