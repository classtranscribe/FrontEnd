export const fakeData = {
  courses       : require('./courses.data.json'),
  instructors   : require('./instructors.data.json'),
  terms         : require('./terms.data.json'),
  departments   : require('./subjects.data.json'),
  playlists     : require('./playlist.data.json'),
  instData      : require('./instructorpage.data.json')
}

export const initialData = {
  initialTerm: {
    name: '', 
    startDate: '', 
    endDate: '',
    universityId: ''
  },
  initialUni: {
    name: '', 
    domain: ''
  },
  initialDepart: {
    name: '', 
    acronym: '', 
    universityId: ''
  },
  initialCourse: {
    courseName: '', 
    courseNumber: '', 
    description: '', 
    departmentId: ''
  },
  initialOffering: {
    offering: {
      sectionName: '',
      termId: '',
      accessType: 'Public'
    },
    courseId: '',
    instructorId: '',
  },
  initialPlaylist: {
    description: '',
    offeringId: ''
  },
  initialVideo: {
    description: '',
    playlistId: '',
    path: '',
  },
}