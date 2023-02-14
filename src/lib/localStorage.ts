import { randomIntFromInterval, Note } from "./utils";
import { LoremIpsum } from "lorem-ipsum";
import { useSettingsStore } from "../stores/store.settings";
import { useNotebookStore } from "../stores/store.notebook";

export const saveAllNoteDataToLocalStorage = () => {
  const notebook = useNotebookStore();
  const settings = useSettingsStore();
  localStorage.setItem(
    "volon",
    JSON.stringify({
      asideActive: settings.asideActive,
      markdownPreviewActive: settings.markdownPreviewActive,
      notes: notebook.notes,
    })
  );
};

export const saveAppSettingsToLocalStorage = () => {
  const settings = useSettingsStore();
  const localData = localStorage.getItem("volon");
  const localDataFound = !!localData;

  if (localDataFound) {
    const localDataParsed = JSON.parse(localData);
    localDataParsed.asideActive = settings.asideActive;
    localDataParsed.markdownPreviewActive = settings.markdownPreviewActive;
    localDataParsed.theme = settings.theme;
    localDataParsed.noteOrderPreference = settings.noteOrderPreference;
    localDataParsed.notePreviewContents = settings.notePreviewContents;

    localStorage.setItem("volon", JSON.stringify(localDataParsed));
  } else {
    createNewAppSettingsInLocalStorage();
  }
};

export const createNewAppSettingsInLocalStorage = () => {
  const settings = useSettingsStore();
  localStorage.setItem(
    "volon",
    JSON.stringify({
      asideActive: settings.asideActive,
      markdownPreviewActive: settings.markdownPreviewActive,
      theme: settings.theme,
      noteOrderPreference: settings.noteOrderPreference,
      notePreviewContents: settings.notePreviewContents,
    })
  );
};

export const loadAppSettingsFromLocalStorage = () => {
  const settings = useSettingsStore();
  const localData = localStorage.getItem("volon");
  const localDataFound = !!localData;

  if (localDataFound) {
    const localDataParsed = JSON.parse(localData);
    settings.asideActive = localDataParsed.asideActive;
    settings.theme = localDataParsed.theme ?? "system";
    settings.markdownPreviewActive = localDataParsed.markdownPreviewActive;
    settings.noteOrderPreference = localDataParsed.noteOrderPreference;
    settings.notePreviewContents =
      localDataParsed.notePreviewContents ?? "noteBody";
  } else {
    createNewAppSettingsInLocalStorage();
  }
};

export const loadExistingLocalStorageData = () => {
  const settings = useSettingsStore();
  const notebook = useNotebookStore();
  const volonData = JSON.parse(localStorage.getItem("volon")!);

  settings.asideActive = volonData.asideActive ?? settings.asideActive;
  settings.markdownPreviewActive =
    volonData.markdownPreviewActive ?? settings.markdownPreviewActive;

  notebook.notes = volonData.notes.map((note: Note) => ({
    id: note.id,
    dateCreated: new Date(note.dateCreated),
    lastModified: new Date(note.lastModified),
    content: note.content,
  }));
};

export const generateLocalStorageNotesData = () => {
  const settings = useSettingsStore();
  const notebook = useNotebookStore();

  localStorage.setItem(
    "volon",
    JSON.stringify({
      asideActive: settings.asideActive,
      markdownPreviewActive: settings.markdownPreviewActive,
      notes: notebook.notes,
    })
  );
};

export const intializeLocalStorageData = () => {
  const existingNotesDataFound = !!localStorage.getItem("volon");

  if (!existingNotesDataFound) {
    generateLocalStorageNotesData();
    loadExistingLocalStorageData();
  } else {
    loadExistingLocalStorageData();
  }

  localStorage.removeItem("volonDeletedNotes");
};

export const createSampleDataInLocalStorage = () => {
  const notebook = useNotebookStore();
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 5,
      min: 3,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  [...Array(50)].map(() => {
    const title = lorem.generateWords(randomIntFromInterval(2, 6));
    const bodyContent = lorem.generateParagraphs(randomIntFromInterval(1, 5));
    const noteContent = `# ${
      title.charAt(0).toUpperCase() + title.slice(1)
    } \n\n ${bodyContent}`;

    const newNoteData = new Note(noteContent);

    notebook.notes.push(newNoteData);
    saveAllNoteDataToLocalStorage();
  });
};

export const deleteAllNotes = () => {
  const localData = localStorage.getItem("volon");
  const localDataFound = !!localData;

  if (!localDataFound) return;

  const localDataParsed = JSON.parse(localStorage.getItem("volon")!);
  localDataParsed.notes = [];

  localStorage.setItem("volon", JSON.stringify(localDataParsed));
};
