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
  const genericState = useGenericStateStore();
  const defaultNoteList = notebook.notes;

  if (!id) return null;

  const result = (noteList ?? defaultNoteList).findIndex(
    (note) => note.id === id
  );

  return result;
};

export const deleteActiveNote = () => {
  const genericState = useGenericStateStore();
  const notebook = useNotebookStore();
  const indexOfActiveNote = getIndexOfNoteById(genericState.activeNoteId);

  if (indexOfActiveNote === null) {
    throw new Error(`No note with the ID ${genericState.activeNoteId} found.`);
  }

  if (genericState.userIsLoggedIn) {
    deleteNoteInDB(notebook.getNoteById(genericState.activeNoteId));
    notebook.deleteActiveNote();
  } else {
    notebook.deleteActiveNote();
    saveAllNoteDataToLocalStorage();
  }
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
  const genericState = useGenericStateStore();
  const elementRefs = useElementRefsStore();
  genericState.toggleCommandPaletteActive();

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
