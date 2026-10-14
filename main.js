import Student from './Student.js'; // default import
import {calculateGrade as gradeOf} from './gradeUtils.js'; // named import with alias
import {processTranscripts} from './transcriptService.js';
const rawData = JSON.stringify([
 {id:242441,name:'Warda Aslam',courses:[{code:'CS301',marks:81},{code:'CS302',marks:74}]},
 {id:101,name:'Ali',courses:[{code:'CS301',marks:50}]}
]);
function test(label,json) {
  try {
    const report = processTranscripts(json);
    console.log(label,'Report object:',report);
    console.log(label,'Report JSON:',JSON.stringify(report,null,2));
  } catch(error) {
    console.log(label,error.name+': '+error.message);
  } finally {
    console.log(label,'finished');
  }
}
console.log('Named alias grade:',gradeOf(85));
console.log('Default Student class:',new Student(242441,'Warda Aslam',[]));
test('Valid',rawData);
test('Malformed','{oops');
test('Missing ID',JSON.stringify([{name:'No ID',courses:[{code:'CS301',marks:80}]}]));
test('Duplicate IDs',JSON.stringify([{id:1,name:'A',courses:[{code:'X',marks:80}]},{id:1,name:'B',courses:[{code:'Y',marks:75}]}]));
test('Marks range',JSON.stringify([{id:2,name:'A',courses:[{code:'X',marks:101}]}]));
test('Missing code',JSON.stringify([{id:3,name:'A',courses:[{marks:55}]}]));
