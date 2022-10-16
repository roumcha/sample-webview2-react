import { useEffect, useState } from 'react';
import Note from './Note';
import { NoteInfo } from './NoteInfo';

const sampleInfo = { id: -99999, text: 'Hello!' };

export default function App() {
  const [noteInfos, setNoteInfos] = useState<NoteInfo[]>([
    sampleInfo,
  ]);

  useEffect(() => {
    window.notes = noteInfos;

    window.setNotes = (array) => {
      window.idle = false;
      setNoteInfos(array);
      return true;
    };

    window.addNote = (info) => {
      window.idle = false;
      setNoteInfos([...noteInfos, info]);
      return true;
    };

    window.addNotes = (array) => {
      window.idle = false;
      setNoteInfos([...noteInfos, ...array]);
      return true;
    };

    window.updateNote = (update) => {
      window.idle = false;

      let changed = false;
      let error = false;
      const nextState = noteInfos.map((info) => {
        if (update.id === info.id) {
          if (changed) error = true;
          changed = true;
          return update;
        }
        return info;
      });

      if (error) {
        window.idle = true;
        return false;
      }
      setNoteInfos(nextState);
      return true;
    };

    window.removeNote = (removedId) => {
      window.idle = false;

      let changed = false;
      let error = false;
      const nextState = noteInfos.filter((info) => {
        if (info.id === removedId) {
          if (changed) error = true;
          changed = true;
          return false;
        }
        return true;
      });

      if (error) {
        window.idle = true;
        return false;
      }
      setNoteInfos(nextState);
      return true;
    };

    window.idle = true;

    return () => {
      window.idle = false;
      window.notes = undefined;
      window.setNotes = (_) => false;
      window.addNotes = (_) => false;
    };
  });

  return (
    <div className="App">
      {noteInfos.map((info) => (
        <Note key={info.id} info={info} />
      ))}
    </div>
  );
}
