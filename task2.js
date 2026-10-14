// Task 2: Academic Analytics - Warda Aslam (242441)
const results = [
  {id:1,name:'Ali',department:'CS',course:'FSWD',marks:82},
  {id:2,name:'Sara',department:'CS',course:'FSWD',marks:91},
  {id:3,name:'Usman',department:'SE',course:'FSWD',marks:47},
  {id:4,name:'Hina',department:'AI',course:'FSWD',marks:73},
  {id:5,name:'Ahmed',department:'SE',course:'FSWD',marks:64},
  {id:6,name:'Zoya',department:'AI',course:'FSWD',marks:91},
  {id:7,name:'Warda Aslam',department:'CS',course:'FSWD',marks:88},
  {id:8,name:'New Student',department:'DS',course:'FSWD',marks:50}
];
function getGrade(m) {
  if (!Number.isFinite(m) || m < 0 || m > 100) return {grade:'INVALID',gradePoints:null,status:'INVALID'};
  if (m >= 85) return {grade:'A',gradePoints:4.0,status:'PASS'};
  if (m >= 80) return {grade:'A-',gradePoints:3.7,status:'PASS'};
  if (m >= 75) return {grade:'B+',gradePoints:3.3,status:'PASS'};
  if (m >= 70) return {grade:'B',gradePoints:3.0,status:'PASS'};
  if (m >= 65) return {grade:'B-',gradePoints:2.7,status:'PASS'};
  if (m >= 60) return {grade:'C+',gradePoints:2.3,status:'PASS'};
  if (m >= 50) return {grade:'C',gradePoints:2.0,status:'PASS'};
  return {grade:'F',gradePoints:0,status:'FAIL'};
}
// Grade points above are an explicitly chosen example scale (lab specifies letter bands only).
const processed = results.map(s => ({...s,...getGrade(s.marks)}));
const ranked = [...processed].sort((a,b) => b.marks-a.marks || a.name.localeCompare(b.name));
const departmentStats = {};
processed.forEach(s => {
  if (!departmentStats[s.department]) departmentStats[s.department] = {students:0,total:0,highest:0,passed:0};
  const d = departmentStats[s.department];
  d.students++; d.total += s.marks;
  d.highest = Math.max(d.highest,s.marks);
  if (s.status === 'PASS') d.passed++;
});
Object.values(departmentStats).forEach(d => {d.average = Number((d.total/d.students).toFixed(2));delete d.total;});
const average = processed.reduce((sum,s) => sum+s.marks,0)/processed.length;
console.log('Graded:',processed);
console.log('Ranked (copy):',ranked.map(s => `${s.name}: ${s.marks}`));
console.log('Department stats:',departmentStats);
console.log('First above 85:',processed.find(s => s.marks > 85));
console.log('First failed index:',processed.findIndex(s => s.status === 'FAIL'));
console.log('Any failed:',processed.some(s => s.status === 'FAIL'));
console.log('All marks valid:',processed.every(s => Number.isFinite(s.marks) && s.marks >= 0 && s.marks <= 100));
console.log('Above average:',processed.filter(s => s.marks > average).map(s => s.name));
console.log('Top 3:',ranked.slice(0,3).map(s => s.name));
console.log('Boundary/invalid grade tests:',[getGrade(0),getGrade(100),getGrade(-1)]);
