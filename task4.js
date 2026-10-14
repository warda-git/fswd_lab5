// Task 4: Classes and this - Warda Aslam (242441)
class Person {
  constructor(name,email) {this.name=name;this.email=email;}
  introduce() {return `Hi, I am ${this.name}. Email: ${this.email}`;}
}
class Student extends Person {
  constructor(name,email,rollNo,marks) {
    super(name,email);this.rollNo=rollNo;this.marks=marks;
  }
  introduce() {return `${super.introduce()} Roll: ${this.rollNo}`;}
  getResult() {return this.marks >= 50 ? 'PASS' : 'FAIL';}
}
class FacultyMember extends Person {
  constructor(name,email,employeeId,department) {
    super(name,email);this.employeeId=employeeId;this.department=department;
  }
  introduce() {return `${super.introduce()} Faculty: ${this.department}`;}
}
const warda = new Student('Warda Aslam','warda@university.edu',242441,85);
const ali = new Student('Ali','ali@university.edu',101,40);
const teacher = new FacultyMember('Ms. Hina','hina@university.edu',501,'CS');
const users = [warda,ali,teacher];
users.forEach(user => console.log(user.introduce()));
console.log('Student results:',warda.getResult(),ali.getResult());
console.log('instanceof:',warda instanceof Student,warda instanceof Person,teacher instanceof FacultyMember);
const guest = {name:'Dr. Ahmed',email:'ahmed@example.com'};
console.log('call():',Person.prototype.introduce.call(guest));
const fn = warda.introduce;
try {console.log(fn());} catch(error) {console.log('Detached method failed:',error.message);}
const safeFn = warda.introduce.bind(warda);
console.log('bind():',safeFn());
