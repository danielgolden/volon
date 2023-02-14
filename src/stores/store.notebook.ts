import { defineStore } from "pinia";
import { Note, getIndexOfNoteById } from "../lib/utils";
import { useGenericStateStore } from "../stores/store.genericState";

export const useNotebookStore = defineStore("notebook", {
  state: () => {
    return {
      notes: [
        new Note(
          "# Welcome to Volón ✌🏽\n\nVolón is a minimal, plain-text notes app with a focus on [Markdown](https://www.markdownguide.org/getting-started/). In Volón, your notes are stored on *your* device. If you'd prefer to sync your notes across devices, you can log in. Helpful features:\n\n- **Markdown preview** (`⌘ + Shift + P` to show/hide)\n- **Multiple cursors** (`⌘ + click`)\n- **Smart link pasting**: Any link you paste over selected text will be auto-formatted as a markdown link.\n- **Search/create bar** (`⌘ + K`): Search all your notes or create a new note by pressing enter after typing."
        ),
        new Note(
          "# Keyboard shortcuts ⌨️\n\nVolón is designed for keyboard input above all else, so everything you'd want to do can be done via keyboard shortcuts.\n\n### General\n- Show/hide sidebar: `⌘ + /`\n- Markdown preview: `⌘ + Shift + P`\n- Search: `⌘ + K`\n\n### Manage your notes\n- New note: `⌘ + alt + N`\n- Delete note: `⌘ + alt + Backspace`\n- Download a backup: `⌘ + Shift + s`\n\n### Text formatting\n- Bold: `⌘ + B`\n- Italicize: `⌘ + I`\n- Move line up: `Alt + Up`\n- Move line down: `Alt + Down`\n- Copy line up: `Shift + Alt + Up`\n- Copy line down: `Shift + Alt + Down`\n- Insert blank line: `⌘ + Enter` (`Ctrl + Enter` on Windows)\n- Select line: `Ctrl + L` (`Alt + L` on Windows)\n- Indent less: `⌘ + [` (Ctrl + [ on Windows)\n- Indent more: `⌘ + ]` (Ctrl + ] on Windows)\n- Delete line: `⌘ + Shift + K` (`Ctrl + Shift + K` on Windows)\n- Toggle comment: `⌘ + /` (`Ctrl + /` on Windows)\n\n\n"
        ),
      ],
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
    deleteActiveNote() {
      const genericState = useGenericStateStore();
      this.notes.splice(getIndexOfNoteById(genericState.activeNoteId)!, 1);
    },
    getNoteTitle(noteContents: string) {
      const title = noteContents
        .split(`\n`)[0]
        .replaceAll("#", "")
        .substring(0, 50);
      return title[0] === " " ? title.substring(1) : title;
    },
  },
  getters: {
    totalNotesCount: (state) => state.notes.length,
  },
});
