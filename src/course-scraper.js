const loadingPara = document.getElementById("loading");
const loadingBar = document.getElementById("bar");

const rosterURL = "https://classes.cornell.edu/api/2.0/config/rosters.json";
const rosterResponse = (await fetch(rosterURL));
const rosterJSON = await rosterResponse.json();
const roster = rosterJSON.data.rosters.pop().slug;

const subjectsURL = "https://classes.cornell.edu/api/2.0/config/subjects.json?roster="+roster;
const subjectsResponse = await fetch(subjectsURL);
const subjectsJSON = await subjectsResponse.json();
const subjects = subjectsJSON.data.subjects;
 
const classesJSON = [];
let count = 0; const total = subjects.length;
for (const s of subjects) {
  count++;
  loadingPara.innerHTML = "Loading " + s.value + " classes";
  loadingBar.innerHTML = count + "/" + total;
  const classURL = "https://classes.cornell.edu/api/2.0/search/classes.json?roster=FA23&subject=" + s.value;
  const classResponse = await fetch(classURL);
  const classJSON = await classResponse.json();
  classesJSON.push(...classJSON.data.classes);
}
loadingPara.innerHTML = "All done!";

const badPlaces = 
  [
    "Virtual",
    "Wolpe Centre",
    "Bloomberg Center",
    "Tata Innovation Center",
    "Green Greenhouse Bldg G"
  ]

const classes = []
for (const c of classesJSON) {
  const item = {
    code: c.subject + " " + c.catalogNbr,
    title: c.titleLong,
    name: c.subject + " " + c.catalogNbr + ": " + c.titleLong,
    desc: c.description,
    locations: [],
  }
  for (const e of c.enrollGroups) {
    for (const s of e.classSections) {
      for (const m of s.meetings) {
        const place = {
          bldg: m.bldgDescr,
          room: m.facilityDescr,
          type: s.ssrComponent,
          typeLong: s.ssrComponentLong,
          time: m.timeStart,
          days: m.pattern
        }
        if (!place.bldg || badPlaces.includes(place.bldg)) continue;
        if (!item.locations.some(el => 
          el.room === place.room && el.type === place.type && el.time === place.time && el.days === place.days
        )) {
          item.locations.push(place);
        }
      }
    }
  }
  if (item.locations.length > 0) {classes.push(item);}
}

export default classes;