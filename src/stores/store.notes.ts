import { defineStore } from "pinia";
import { saveAllNoteDataToLocalStorage } from "../lib/localStorage";
import { createNoteInDB } from "../lib/supabase";
import { Note } from "../lib/utils";
import { useGenericStateStore } from "./store.genericState";
const genericState = useGenericStateStore();

export const useNotesStore = defineStore("notes", {
  state: () => {
    return {
      all: [] as Note[],
    };
  },
  actions: {
    getNotesByContent(content: string): Note[] {
      const matchedNotes = this.all.filter((note) => {
        return note.content.toLowerCase().includes(content.toLowerCase());
      });

      return matchedNotes;
    },
    getNoteById(noteId: string | null) {
      if (noteId === null) throw new Error("noteId parameter must not be null");

      const matchedNote = this.all.find((note) => note.id === noteId);
      if (!matchedNote) {
        throw new Error("No matching note found");
      }
      return matchedNote;
    },
    deleteNoteAtIndex(noteIndex: number) {
      this.all.splice(noteIndex, 1);
    },
  },
  getters: {
    totalNotesCount: (state) => state.all.length,
  },
});
