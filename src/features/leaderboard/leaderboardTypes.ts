export interface Entry {
  id: string;       // from doc.id
  name: string;     // from doc.data().name
  score: number;    // from doc.data().score
  song: string;     // from doc.data().song
}