import './ClassDisplay.css'

export default function ClassDisplay({ selected }) {
  const lis = selected.map(x => {
    const key = x.name +", " + x.location + ", " + x.room;
    return <li key={key}>{x.name}</li>
  });
  return (
  <div>
    <h1>Classes</h1>
    <ul className="class-display">
      {lis}
    </ul>
  </div>
  );
}