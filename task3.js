// Task 3: Safe Profile Update - Warda Aslam (242441)
const student = {
 id:242441,name:'Warda Aslam',marks:0,scholarship:false,
 address:{city:'Islamabad',sector:'F-10'},contact:{email:'warda@university.edu'}
};
const update = {name:'Warda Aslam',address:{city:'Rawalpindi'},contact:{phone:'03001234567'}};
function updateProfile(original, changes) {
  return {
    ...original,...changes,
    address:{...original.address,...(changes.address ?? {})},
    contact:{...original.contact,...(changes.contact ?? {})}
  };
}
const updated = updateProfile(student,update);
const {name,marks=0,scholarship=false,address:{city:studentCity,sector='Unknown'}} = updated;
const {email, ...otherContact} = updated.contact; // object rest
const {id, ...restOfStudent} = updated;
const [first,second='No second item'] = [name]; // array destructuring + default
function showNames(...names) {return names.join(', ');} // rest parameters
const phone = updated.contact?.phone ?? 'Not provided';
const details = {name,studentCity,phone}; // property shorthand
console.log('Original:',student);
console.log('Updated:',updated);
console.log('Destructuring:',details,marks,scholarship,sector,email,otherContact,first,second,id,Object.keys(restOfStudent));
console.log('Rest parameters:',showNames('Warda','Sara'));
console.log('Same original object?',student === updated);
console.log('Same address?',student.address === updated.address);
console.log('Same contact?',student.contact === updated.contact);
console.log('Boundary update (0, false, empty string):',updateProfile(student,{name:'',marks:0,scholarship:false}));
