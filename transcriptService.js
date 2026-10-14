import Student from './Student.js';
import {calculateAverage,calculateGPA,calculateGrade} from './gradeUtils.js';
export function processTranscripts(rawData) {
  let data;
  try {data=JSON.parse(rawData);} catch(error) {throw new SyntaxError('Malformed JSON');}
  if (!Array.isArray(data)) throw new TypeError('Expected an array of students');
  const ids = new Set();
  const report = [];
  for (const item of data) {
    if (!item || item.id === undefined || item.id === null || String(item.id).trim() === '') throw new TypeError('Missing student ID');
    if (ids.has(item.id)) throw new Error('Duplicate ID: '+item.id);
    ids.add(item.id);
    if (typeof item.name !== 'string' || !item.name.trim() || !Array.isArray(item.courses) || item.courses.length === 0)
      throw new TypeError('Invalid name or courses');
    for (const c of item.courses) {
      if (!c || typeof c.code !== 'string' || !c.code.trim()) throw new TypeError('Missing course code');
      if (typeof c.marks !== 'number' || !Number.isFinite(c.marks)) throw new TypeError('Invalid marks type');
      if (c.marks < 0 || c.marks > 100) throw new RangeError('Marks must be 0 to 100');
    }
    const student = new Student(item.id,item.name,item.courses);
    report.push({id:student.id,name:student.name,
      average:Number(calculateAverage(student.courses).toFixed(2)),
      gpa:Number(calculateGPA(student.courses).toFixed(2)),
      courses:student.courses.map(c => ({...c,grade:calculateGrade(c.marks)}))});
  }
  return report;
}
