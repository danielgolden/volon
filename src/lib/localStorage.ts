import { store } from "../store";
import { getDefaultNotesData, randomIntFromInterval, Note } from "./utils";
import { LoremIpsum } from "lorem-ipsum";
import { createApp } from "vue";
import App from "../App.vue";
import { createPinia } from "pinia";
import { useSettingsStore } from "../stores/store.settings";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
const settings = useSettingsStore();

export const saveAllNoteDataToLocalStorage = () => {
  localStorage.setItem("volon", JSON.stringify(store.loadedData));
};

export const saveAppSettingsToLocalStorage = () => {
  const localData = localStorage.getItem("volon");
  const localDataFound = !!localData;

  if (localDataFound) {
    const localDataParsed = JSON.parse(localData);
    localDataParsed.asideActive = settings.asideActive;
    localDataParsed.markdownPreviewActive =
      store.loadedData.markdownPreviewActive;
    localDataParsed.asideActive = settings.asideActive;

    localStorage.setItem("volon", JSON.stringify(localDataParsed));
  } else {
    createNewAppSettingsInLocalStorage();
  }
};

export const createNewAppSettingsInLocalStorage = () => {
  localStorage.setItem(
    "volon",
    JSON.stringify({
      asideActive: settings.asideActive,
      markdownPreviewActive: settings.markdownPreviewActive,
    })
  );
};

export const loadAppSettingsFromLocalStorage = () => {
  const localData = localStorage.getItem("volon");
  const localDataFound = !!localData;

  if (localDataFound) {
    const localDataParsed = JSON.parse(localData);
    settings.setAsideActive(localDataParsed.asideActive);
    store.loadedData.markdownPreviewActive =
      localDataParsed.markdownPreviewActive;
  } else {
    createNewAppSettingsInLocalStorage();
  }
};

export const loadExistingLocalStorageData = () => {
  const volonData = JSON.parse(localStorage.getItem("volon")!);
  const processedVolonData = {
    ...volonData,
    notes: volonData.notes.map((note: Note) => ({
      id: note.id,
      dateCreated: new Date(note.dateCreated),
      lastModified: new Date(note.lastModified),
      content: note.content,
    })),
  };
  store.loadedData = processedVolonData;
};

export const generateLocalStorageNotesData = () => {
  localStorage.setItem("volon", JSON.stringify(getDefaultNotesData()));
};

export const intializeLocalStorageData = () => {
  const existingNotesDataFound = !!localStorage.getItem("volon");

  if (!existingNotesDataFound) {
    generateLocalStorageNotesData();
    loadExistingLocalStorageData();
  } else {
    loadExistingLocalStorageData();
  }
};

export const createSampleDataInLocalStorage = () => {
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

    store.loadedData.notes.push(newNoteData);
    saveAllNoteDataToLocalStorage();
  });
};
