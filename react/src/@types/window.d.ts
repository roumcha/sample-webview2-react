import { NoteInfo } from '../NoteInfo';

declare global {
  interface Window {
    idle: boolean | undefined;
    notes: NoteInfo[] | undefined;
    setNotes(newState: NoteInfo[]): boolean;
    addNote(newNotes: NoteInfo): boolean;
    addNotes(newNotes: NoteInfo[]): boolean;
    updateNote(newNotes: NoteInfo): boolean;
    removeNote(ids: number): boolean;
  }
}
