const rosterURL = "https://classes.cornell.edu/api/2.0/config/rosters.json";
const rosterResponse = (await fetch(rosterURL));
const rosterJSON = await rosterResponse.json();
const roster = rosterJSON.data.rosters.pop().slug;

const subjectsURL = "https://classes.cornell.edu/api/2.0/config/subjects.json?roster="+roster;
const subjectsResponse = await fetch(subjectsURL);
const subjectsJSON = await subjectsResponse.json();
const subjects = subjectsJSON.data.subjects;
 
const classesJSON = [];
for (const s of subjects) {
  console.log("Loading " + s.value + " classes");
  const classURL = "https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA23&subject=" + s.value;
  console.log(classURL);
  const classResponse = await fetch(classURL);
  const classJSON = await classResponse.json();
  classesJSON.push(...classJSON.data.classes);
}
console.log("All done!");

const classes = []
for (const c of classesJSON) {
  const item = {
    name: c.subject + " " + c.catalogNbr + ": " + c.titleLong,
    desc: c.description,
    locations: [],
  }
  classes.push(item);
  for (const e of c.enrollGroups) {
    for (const s of e.classSections) {
      for (const m of s.meetings) {
        const place = {
          bldg: m.bldgDescr,
          room: m.facilityDescr,
          type: s.ssrComponent
        }
        if (!item.locations.some(el => el.bldg === place.bldg && el.room === place.room)) {
          item.locations.push(place);
        }
      }
    }
  }
}

export default classes;