const subjectsURL = "https://classes.cornell.edu/api/2.0/config/subjects.json?roster=FA23";
const subjectsRequest = new Request(subjectsURL);

const subjectsResponse = await fetch(subjectsRequest);
const subjectsJSON = await subjectsResponse.json();
const subjects = subjectsJSON.data.subjects;
 
const classesJSON = [];
for (const s of subjects) {
  console.log("Loading " + s.value + " classes");
  const classURL = "https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA23&subject=" + s.value;
  const classRequest = new Request(classURL);

  const classResponse = await fetch(classRequest);
  const classJSON = await classResponse.json();
  classesJSON.push(...classJSON.data.classes);
}

console.log("All done!");

/*
const locations = new Set();
for (const c of classesJSON) {
  for (const e of c.enrollGroups) {
    for (const s of e.classSections) {
      for (const m of s.meetings) {
        locations.add(m.bldgDescr);
      }
    }
  }
}

console.log(locations); */

const classes = classesJSON.map(x => ({
  name: x.subject + " " + x.catalogNbr + ": " + x.titleLong, 
  enrollGroups: x.enrollGroups,
  drawn_on_map: false
}));

export default classes;