import './ClassDisplay.css'

export default function ClassDisplay({ selected }) {
  const lis = selected.map(x => <li key={x.name}>{x.name}</li>)
  return (
  <div>
    <h1>Classes</h1>
    <ul className="class-display">
      {lis}
    </ul>
  </div>
  );
}