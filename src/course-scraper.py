import requests
import json

def grab_json(url):
  return json.loads(requests.get(url).text)

rosterURL = "https://classes.cornell.edu/api/2.0/config/rosters.json"
roster = grab_json(rosterURL)['data']['rosters'][-1]['slug']

subjectsURL = "https://classes.cornell.edu/api/2.0/config/subjects.json?roster="+roster
subjects = grab_json(subjectsURL)['data']['subjects']
 
classesJSON = []
for s in subjects :
  print(s['value'])
  classURL = "https://classes.cornell.edu/api/2.0/search/classes.json?roster="+roster+"&subject=" + s['value']
  classesJSON.extend(grab_json(classURL)['data']['classes'])

badPlaces = [
  "Virtual",
  "Wolpe Centre",
  "Bloomberg Center",
  "Tata Innovation Center",
  "Green Greenhouse Bldg G"
]

classes = []
for c in classesJSON:
  item = {
    'code': c['subject'] + " " + c['catalogNbr'],
    'title': c['titleLong'],
    'name': c['subject'] + " " + c['catalogNbr'] + ": " + c['titleLong'],
    'desc': c['description'],
    'locations': [],
  }
  for e in c['enrollGroups']:
    for s in e['classSections']:
      for m in s['meetings']:
        place = {
          'bldg': m['bldgDescr'],
          'room': m['facilityDescr'],
          'type': s['ssrComponent'],
          'typeLong': s['ssrComponentLong'],
          'time': m['timeStart'],
          'days': m['pattern']
        }
        if place['bldg'] == None or list(filter(lambda item: item == place['bldg'], badPlaces)) != []:
          continue
        if list(filter(lambda el: 
          el['room'] == place['room'] and 
          el['type'] == place['type'] and 
          el['time'] == place['time'] and 
          el['days'] == place['days'], item['locations'])) == []:
          item['locations'].append(place)
  if len(item['locations']) > 0: 
    classes.append(item)

with open('./src/classes.json', 'w') as f:
    json.dump(classes, f)