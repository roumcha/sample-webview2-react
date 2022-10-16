import { NoteInfo } from './NoteInfo';

export default function Note(props: { info: NoteInfo }) {
  return <p>{props.info.text}</p>;
}
