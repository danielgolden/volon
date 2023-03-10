import { createClient } from "@supabase/supabase-js";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";
import { useUiStateStore } from "../stores/store.ui";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGitHub = async () => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });
  return data;
};

export const signInWithGoogle = async () => {
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  return data;
};

export const signout = async () => {
  const genericState = useGenericStateStore();
  const uiState = useUiStateStore();
  const { error } = await supabase.auth.signOut();
  genericState.session = null;

  uiState.addToast({
    title: "Logged out",
  });

  return error;
};

export const getSession = async () => {
  const genericState = useGenericStateStore();

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
  }
  genericState.session = data.session;
};

export const loadNotesFromDB = async () => {
  const { data } = await supabase.from("notes").select();

  return data;
};

export const updateNoteInDB = async (noteToUpdate: Note) => {
  await supabase
    .from("notes")
    .update({
      created_at: noteToUpdate.dateCreated,
      modified_at: noteToUpdate.lastModified,
      content: noteToUpdate.content,
    })
    .eq("id", noteToUpdate.id);
};

export const createNoteInDB = async (noteToUpdate: Note) => {
  const genericState = useGenericStateStore();
  const { error } = await supabase.from("notes").insert({
    id: noteToUpdate.id,
    created_at: noteToUpdate.dateCreated,
    modified_at: noteToUpdate.lastModified,
    content: noteToUpdate.content,
    user_id: genericState.session.user.id,
  });

  return error;
};

export const deleteNoteInDB = async (noteToDelete: Note) => {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteToDelete.id);

  return error;
};

export const deleteAllUserNotes = async () => {
  const genericState = useGenericStateStore();
  const userID = genericState.session.user.id;

  const { error } = await supabase.from("notes").delete().eq("user_id", userID);

  return error;
};

export const loadExistingDBData = async () => {
  const notebook = useNotebookStore();
  let dbNotes = await loadNotesFromDB();

  if (dbNotes === null) {
    console.error("No notes data loaded was from the database");
    return;
  }

  // Successfully retreived data, but the none was found for this user
  // Populate it with the starter notes
  if (dbNotes.length === 0) {
    const note1 = notebook.notes[0];
    const note2 = notebook.notes[1];
    await createNoteInDB(note1);
    await createNoteInDB(note2);

    dbNotes = await loadNotesFromDB();
  }

  // Format the database data to fit our expected data structure
  notebook.notes = dbNotes!.map(
    (note): Note => ({
      id: note.id,
      content: note.content,
      dateCreated: new Date(note.created_at),
      lastModified: new Date(note.modified_at),
    })
  );
};

export const sendLocalNotesToDB = async () => {
  const notebook = useNotebookStore();
  const uiState = useUiStateStore();
  const localNotesData = JSON.parse(localStorage.getItem("volon")!).notes;

  // Gather local notes that aren't in the DB
  const localNotesNotInDB = localNotesData.filter(
    (localNote: Note) =>
      !notebook.notes.some((notebookNote) => notebookNote.id === localNote.id)
  );

  // Push them to the db
  localNotesNotInDB.forEach((note: Note) => createNoteInDB(note));

  // Notify the user
  if (localNotesNotInDB.length > 0) {
    const localNoteCount = localNotesNotInDB.length;

    uiState.addToast({
      title: `Imported ${localNoteCount} local note${
        localNoteCount > 1 ? "s" : ""
      }`,
    });
  } else {
    uiState.addToast({
      title: "No new local notes found",
      description: "0 notes were imported",
    });
  }
};
