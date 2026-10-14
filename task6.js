// Task 6: Error-first callbacks - Warda Aslam (242441)
const students = [{id:242441,name:'Warda Aslam',completed:['CS301'],registered:[]}];
const courses = [{code:'CS401',prerequisite:'CS301',seats:2},{code:'CS402',prerequisite:'CS301',seats:0}];
function loadStudent(id,callback) {
  setTimeout(() => {
    const s = students.find(s => s.id === id);
    if (!s) return callback(new Error('Student not found'),null);
    callback(null,s);
  },50);
}
function checkPrerequisites(student,course,callback) {
  setTimeout(() => {
    if (!course) return callback(new Error('Course not found'),null);
    if (!student.completed.includes(course.prerequisite)) return callback(new Error('Prerequisite incomplete'),null);
    callback(null,true);
  },50);
}
function checkSeats(course,callback) {
  setTimeout(() => {
    if (course.seats <= 0) return callback(new Error('Course full'),null);
    callback(null,true);
  },50);
}
function registerCourse(student,course,callback) {
  setTimeout(() => {
    if (student.registered.includes(course.code)) return callback(new Error('Already registered'),null);
    student.registered.push(course.code);course.seats--;
    callback(null,{studentId:student.id,course:course.code,status:'REGISTERED'});
  },50);
}
function enroll(id,code,done) {
  const course = courses.find(c => c.code === code);
  loadStudent(id,(error,student) => {
    if (error) return done(error,null);
    checkPrerequisites(student,course,(error) => {
      if (error) return done(error,null);
      checkSeats(course,(error) => {
        if (error) return done(error,null);
        registerCourse(student,course,done);
      });
    });
  });
}
function show(error,value) {console.log(error ? 'ERROR: '+error.message : 'SUCCESS:',error ? '' : value);}
enroll(242441,'CS401',(error,value) => {
  show(error,value);
  enroll(242441,'CS401',show); // already registered
  enroll(242441,'CS402',show); // course full
  enroll(999,'CS401',show); // missing student
  enroll(242441,'UNKNOWN',show); // unknown course
  students.push({id:99,name:'Test',completed:[],registered:[]});
  enroll(99,'CS401',show); // missing prerequisite
});
// Callback nesting makes longer workflows harder to read and handle errors in.
