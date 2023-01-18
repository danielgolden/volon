import { store } from "../store";
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

export const getDefaultNotesData = (): LoadedNotesData => {
  return {
    asideActive: true,
    markdownPreviewActive: true,
    notes: [
      new Note(
        `# Welcome to Volón\n\nVolón supports Markdown and has preview built in. Just press \`Command + Shift + p\` to preview your note in Markdown.*\n\nThanks for trying out Volón, a minimal notes app based on [nvALT] designed around the use of [Markdown]. There are 3 main sections in \nVolón where you create, search, and choose your notes:\n\n- **Search/Create bar**: type into this bar to search the names and contents of every note you've created! To create a note, just press enter after typing into the bar, and a note will be with your text as the title.\n- **Notes List**: All of your notes live here, ordered by date last modified.\n- **Editor**: This is where you write and update your notes (it's where you're reading this).\n\n---\n\n\n### Feedback\nI'd love to hear your ideas for how Volón can be improved, or if you find some bugs! Feel free to get in touch via [Twitter](https://twitter.com/DanGolden1) or submit an issue on  [GitHub](https://github.com/danielgolden/volon).\n\nVolón is based on [nvALT](http://brettterpstra.com/projects/nvalt/), which is based on [Notational Velocity](http://notational.net/).\n\n[nvAlt]: http://brettterpstra.com/projects/nvalt/\n[Markdown]: https://guides.github.com/features/mastering-markdown/`
      ),
      new Note(
        `# How to do other stuff in Volón\n\nVolón's window was designed for keyboard input above all else, and that's why it doesn't have any buttons (mostly). Everything you'd want to do is handled by keyboard shortcuts. The beauty of this is you won't need to take your hands off of the keyboard to to create and mange your notes (or really anything).\n\n### Keyboard Shortcuts\n*(On Windows \"Ctrl\" should be used instead of \"⌘\")*\n- \`⌘ + K\`: Move focus and the cursor the the search/create bar\n- \`Up and Down arrows\`: Navigate through your notes.\n- \`⌘ + Shift + P\`: Markdown Preview\n- \`⌘ + I\`: View note info (word, character count, and more)\n\n\n `
      ),
    ],
  };
};

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
  const currentNote = getNoteById(genericState.activeNoteId);
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
  const newNoteData = new Note(contents);

  genericState.activeNoteId = newNoteData.id;
  genericState.activeNoteContents = contents;
  store.loadedData.notes.push(newNoteData);

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

export const getIndexOfNoteById = (
  id: string | null,
  noteList: Note[] = store.loadedData.notes
) => {
  if (!id) return null;
  const genericState = useGenericStateStore();

  return noteList.findIndex((note) => note.id === genericState.activeNoteId);
};

export const deleteActiveNote = () => {
  const genericState = useGenericStateStore();
  const indexOfActiveNote = getIndexOfNoteById(genericState.activeNoteId);

  if (indexOfActiveNote === null) {
    throw new Error(`No note with the ID ${genericState.activeNoteId} found.`);
  }

  if (genericState.userIsLoggedIn) {
    deleteNoteInDB(getNoteById(genericState.activeNoteId));
    store.loadedData.notes.splice(indexOfActiveNote, 1);
  } else {
    store.loadedData.notes.splice(indexOfActiveNote, 1);
    saveAllNoteDataToLocalStorage();
  }
};

export const clearActiveNoteState = () => {
  const genericState = useGenericStateStore();
  genericState.activeNoteId = null;
  genericState.activeNoteContents = "";
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
  genericState.activeNoteContents = getNoteById(
    genericState.activeNoteId
  ).content;
};

export const navigateToPreviousNote = (noteList: Note[]) => {
  navigateToNoteByRelativeIndex(noteList, -1);
};

export const navigateToNextNote = (noteList: Note[]) => {
  navigateToNoteByRelativeIndex(noteList, 1);
};

// TODO: Make this work again now that we're not using loadedData to save data
export const downloadBackupOfData = () => {
  const dataToSave = store.loadedData;
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
