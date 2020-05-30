const alertMesgs = {
  default: {
    status: 'success', 
    header: 'Default alert', 
    detail: null
  },
  saved: {
    status: 'success', 
    header: 'Successfully saved! :)', 
    detail: null
  },
  deleted: {
    status: 'success', 
    header: 'Successfully deleted the content :)', 
    detail: null
  },
  uploaded: {
    status: 'success', 
    header: 'Successfully Uploaded!',
    detail: 'We will transcribe the video within 2 days.'
  },
  wrong: {
    status: 'danger', 
    header: 'Ooops, something wrong :( Please try again', 
    detail: null
  },
  wrongType: {
    status: 'danger', 
    header: 'Sorry, you can only upload PNG files.', 
    detail: 'E.g. \'myCat.png\''
  },
  selectUni: {
    status: 'secondary',
    header: 'Please select a university',
    detail: 'You can create or view contents after selecting an university'
  },
  selectDepart: {
    status: 'secondary',
    header: 'Please select a department',
    detail: 'You can create or view contents after selecting a department'
  }
}

export default alertMesgs;