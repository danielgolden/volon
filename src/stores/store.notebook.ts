import { defineStore } from "pinia";
import { Note, getIndexOfNoteById } from "../lib/utils";
import { useGenericStateStore } from "../stores/store.genericState";

export const useNotebookStore = defineStore("notebook", {
  state: () => {
    return {
      notes: [
        new Note(
          `# Welcome to Volón\n\nVolón supports Markdown and has preview built in. Just press \`Command + Shift + p\` to preview your note in Markdown.*\n\nThanks for trying out Volón, a minimal notes app based on [nvALT] designed around the use of [Markdown]. There are 3 main sections in \nVolón where you create, search, and choose your notes:\n\n- **Search/Create bar**: type into this bar to search the names and contents of every note you've created! To create a note, just press enter after typing into the bar, and a note will be with your text as the title.\n- **Notes List**: All of your notes live here, ordered by date last modified.\n- **Editor**: This is where you write and update your notes (it's where you're reading this).\n\n---\n\n\n### Feedback\nI'd love to hear your ideas for how Volón can be improved, or if you find some bugs! Feel free to get in touch via [Twitter](https://twitter.com/DanGolden1) or submit an issue on  [GitHub](https://github.com/danielgolden/volon).\n\nVolón is based on [nvALT](http://brettterpstra.com/projects/nvalt/), which is based on [Notational Velocity](http://notational.net/).\n\n[nvAlt]: http://brettterpstra.com/projects/nvalt/\n[Markdown]: https://guides.github.com/features/mastering-markdown/`
        ),
        new Note(
          `# How to do other stuff in Volón\n\nVolón's window was designed for keyboard input above all else, and that's why it doesn't have any buttons (mostly). Everything you'd want to do is handled by keyboard shortcuts. The beauty of this is you won't need to take your hands off of the keyboard to to create and mange your notes (or really anything).\n\n### Keyboard Shortcuts\n*(On Windows \"Ctrl\" should be used instead of \"⌘\")*\n- \`⌘ + K\`: Move focus and the cursor the the search/create bar\n- \`Up and Down arrows\`: Navigate through your notes.\n- \`⌘ + Shift + P\`: Markdown Preview\n- \`⌘ + I\`: View note info (word, character count, and more)\n\n\n `
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
  },
  getters: {
    totalNotesCount: (state) => state.notes.length,
  },
});
