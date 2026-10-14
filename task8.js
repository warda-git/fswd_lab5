// Task 8: Async dashboard and fake fetch - Warda Aslam (242441)
const data = {
 '/users':[{id:242441,name:'Warda Aslam',department:'CS'},{id:2,name:'Sara',department:'CS'},{id:3,name:'Ali',department:'SE'}],
 '/courses':[{code:'FSWD'},{code:'CS301'}],
 '/results':[{studentId:242441,marks:90},{studentId:2,marks:40},{studentId:3,marks:75}]
};
function fakeFetch(url,options={}) {
  return new Promise((resolve,reject) => {
    const delay = url === '/slow' ? 300 : 20;
    const timer = setTimeout(() => {
      if (options.signal?.aborted) return reject(Object.assign(new Error('Request aborted'),{name:'AbortError'}));
      if (url === '/network') return reject(new TypeError('Network failure'));
      if (url === '/invalid-json') return resolve({ok:true,status:200,json:async () => {throw new SyntaxError('Invalid JSON');}});
      if (url === '/404' || url === '/500' || !(url in data) && url !== '/slow') {
        const status=url==='/500'?500:404;
        return resolve({ok:false,status,json:async () => ({error:'Failed'})});
      }
      resolve({ok:true,status:200,json:async () => url === '/slow' ? [] : data[url]});
    },delay);
    if (options.signal) {
      if (options.signal.aborted) {clearTimeout(timer);return reject(Object.assign(new Error('Request aborted'),{name:'AbortError'}));}
      options.signal.addEventListener('abort',() => {clearTimeout(timer);reject(Object.assign(new Error('Request aborted'),{name:'AbortError'}));},{once:true});
    }
  });
}
async function getJSON(url,fetchImplementation) {
  const response=await fetchImplementation(url);
  if (!response.ok) throw new Error('HTTP '+response.status);
  return await response.json();
}
async function dashboard() {
  // All three requests begin together.
  const [users,courses,results]=await Promise.all([
    getJSON('/users',fakeFetch),getJSON('/courses',fakeFetch),getJSON('/results',fakeFetch)
  ]);
  const scores=results.filter(r => Number.isFinite(r.marks) && r.marks >= 0 && r.marks <= 100);
  const stats={};
  for (const user of users) {
    const dept=user.department;
    if (!stats[dept]) stats[dept]={students:0,marksTotal:0,resultsCount:0,failed:0};
    stats[dept].students++;
    const result=scores.find(r => r.studentId === user.id);
    if (result) {stats[dept].marksTotal+=result.marks;stats[dept].resultsCount++;if (result.marks<50) stats[dept].failed++;}
  }
  for (const dept of Object.keys(stats)) {
    stats[dept].average=stats[dept].resultsCount ? stats[dept].marksTotal/stats[dept].resultsCount : null;
    delete stats[dept].marksTotal;delete stats[dept].resultsCount;
  }
  const best=scores.length ? scores.reduce((a,b) => b.marks>a.marks?b:a) : null;
  return {totalStudents:users.length,totalCourses:courses.length,
    overallAverage:scores.length ? scores.reduce((sum,r)=>sum+r.marks,0)/scores.length : null,
    highestPerformingStudent:best ? {name:users.find(u=>u.id===best.studentId)?.name ?? 'Unknown',marks:best.marks} : null,
    failedStudents:scores.filter(r=>r.marks<50).length,departmentStats:stats};
}
async function fetchWithTimeout(url,milliseconds) {
  const controller=new AbortController();
  const timer=setTimeout(() => controller.abort(),milliseconds);
  try {
    return await getJSON(url,u => fakeFetch(u,{signal:controller.signal}));
  } finally {clearTimeout(timer);}
}
async function test(label,url,ms=100) {
  try {console.log(label,await fetchWithTimeout(url,ms));}
  catch(error) {console.log(label,error.name+': '+error.message);}
}
async function main() {
  try {console.log('Dashboard:',await dashboard());}
  catch(error) {console.log('Dashboard error:',error.message);}
  await test('Normal','/users');
  await test('404','/404');
  await test('500','/500');
  await test('Network','/network');
  await test('Bad JSON','/invalid-json');
  await test('Timeout','/slow',30);
}
main();
