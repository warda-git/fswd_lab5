// Task 7: Promise chain - Warda Aslam (242441)
const studentDB = [{id:242441,name:'Warda Aslam',completed:['CS301'],registered:[]}];
const courseDB = [{code:'CS401',prerequisite:'CS301',seats:2}];
function getStudent(id) {return new Promise((resolve,reject) => {
  const s=studentDB.find(s => s.id === id);s ? resolve(s) : reject(new Error('Student missing'));
});}
function getCourse(code) {return new Promise((resolve,reject) => {
  const c=courseDB.find(c => c.code === code);c ? resolve(c) : reject(new Error('Course missing'));
});}
function checkPrerequisites(data) {return new Promise((resolve,reject) => {
  data.student.completed.includes(data.course.prerequisite) ? resolve(data) : reject(new Error('Prerequisite missing'));
});}
function checkSeats(data) {return new Promise((resolve,reject) => {
  data.course.seats > 0 ? resolve(data) : reject(new Error('No seats'));
});}
function registerStudent(data) {return new Promise((resolve,reject) => {
  if (data.student.registered.includes(data.course.code)) return reject(new Error('Already registered'));
  data.student.registered.push(data.course.code);data.course.seats--;
  resolve({studentId:data.student.id,course:data.course.code,status:'REGISTERED'});
});}
function sendEmail() {return Promise.resolve('Email sent');}
function sendSMS() {return Promise.reject(new Error('SMS unavailable'));}
function writeAuditLog() {return Promise.resolve('Audit saved');}
function postRegistration() {
  const services=['Email','SMS','Audit'];
  return Promise.allSettled([sendEmail(),sendSMS(),writeAuditLog()])
    .then(results => results.map((r,i) => ({service:services[i],status:r.status})));
}
function enroll(id,code) {
  return getStudent(id)
    .then(student => getCourse(code).then(course => ({student,course})))
    .then(data => checkPrerequisites(data))
    .then(data => checkSeats(data))
    .then(data => registerStudent(data))
    .then(confirmation => {console.log('Registration:',confirmation);return postRegistration();})
    .then(report => console.log('Services:',report))
    .catch(error => console.log('Registration error:',error.message))
    .finally(() => console.log('Registration attempt finished'));
}
function serverOne() {return Promise.reject(new Error('Server 1 down'));}
function serverTwo() {return Promise.resolve({code:'CS401',source:'Server 2'});}
// Promise.any takes the FIRST FULFILLED result, not the first settled result.
enroll(242441,'CS401').then(() => enroll(999,'CS401'));
Promise.any([serverOne(),serverTwo()]).then(result => console.log('First successful server:',result));
