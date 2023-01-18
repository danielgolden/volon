import { defineStore } from "pinia";

export const useNotebookStore = defineStore("notebook", {
  state: () => {
    return {
      notes: [] as Note[],
    };
  },
  actions: {
    getNotesByContent(content: string): Note[] {
      const matchedNotes = this.notes.filter((note) => {
        return note.content.toLowerCase().includes(content.toLowerCase());
      });

      return matchedNotes;
    },
    getNoteById(noteId: string | null) {
      if (noteId === null) throw new Error("noteId parameter must not be null");

      const matchedNote = this.notes.find((note) => note.id === noteId);
      if (!matchedNote) {
        throw new Error("No matching note found");
      }
      return matchedNote;
    },
    deleteNoteAtIndex(noteIndex: number) {
      this.notes.splice(noteIndex, 1);
    },
  },
  getters: {
    totalNotesCount: (state) => state.notes.length,
  },
});
