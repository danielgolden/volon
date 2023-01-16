import { store } from "../store";
import { getDefaultNotesData } from "./utils";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eejwunlqqnquiuzfvolh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVland1bmxxcW5xdWl1emZ2b2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM3OTE0MzksImV4cCI6MTk4OTM2NzQzOX0.11Y0jRYyhAxmmuTLYf38bmxLNoo6SZjP1tQQcC9tmhE";
const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });
  debugger;
  return data;
};

export const signout = async () => {
  const { error } = await supabase.auth.signOut();
  store.session = null;
  return error;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
  }
  store.session = data.session;
};

export const loadNotesFromDB = async () => {
  const { data, error } = await supabase.from("notes").select();

  return data;
};

export const updateNoteInDB = async (noteToUpdate: Note) => {
  const { error } = await supabase
    .from("notes")
    .update({
      created_at: noteToUpdate.dateCreated,
      modified_at: noteToUpdate.lastModified,
      content: noteToUpdate.content,
    })
    .eq("id", noteToUpdate.id);
};

export const createNoteInDB = async (noteToUpdate: Note) => {
  const { error } = await supabase.from("notes").insert({
    id: noteToUpdate.id,
    created_at: noteToUpdate.dateCreated,
    modified_at: noteToUpdate.lastModified,
    content: noteToUpdate.content,
    user_id: store.session.user.id,
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

export const loadExistingDBData = async () => {
  let dbNotes = await loadNotesFromDB();

  if (dbNotes === null) {
    console.error("No notes data loaded was from the database");
    return;
  }

  // Successfully retreived data, but the none was found for this user
  // Populate it with the starter notes
  if (dbNotes.length === 0) {
    const note1 = getDefaultNotesData().notes[0];
    const note2 = getDefaultNotesData().notes[1];
    await createNoteInDB(note1);
    await createNoteInDB(note2);

    dbNotes = await loadNotesFromDB();
  }

  // Format the database data to fit our expected data structure
  store.loadedData.notes = dbNotes!.map(
    (note): Note => ({
      id: note.id,
      content: note.content,
      dateCreated: new Date(note.created_at),
      lastModified: new Date(note.modified_at),
    })
  );
};