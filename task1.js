// Task 1: Admission Decision - Warda Aslam (242441)
const applicants = [
  {id:'A101',name:'Sara Khan',age:'19',matricMarks:'91',intermediateMarks:'87',entryTest:'78',program:'BSCS',feePaid:'true'},
  {id:'A102',name:'Ahmed Ali',age:'twenty',matricMarks:'88',intermediateMarks:'',entryTest:'72',program:'BSSE',feePaid:'false'},
  {id:'A103',name:'Hassan',age:'18',matricMarks:'76',intermediateMarks:'83',entryTest:'91',program:'BSAI',feePaid:'true'},
  {id:'A104',name:'Warda Aslam',age:'21',matricMarks:'90',intermediateMarks:'84',entryTest:'81',program:'BSCS',feePaid:'true'},
  {id:'A105',name:'Test Waiting',age:'20',matricMarks:'75',intermediateMarks:'65',entryTest:'71',program:'BSSE',feePaid:'false'}
];
const programs = ['BSCS','BSSE','BSAI'];
function processApplicant(a) {
  const fields = ['age','matricMarks','intermediateMarks','entryTest'];
  const values = {};
  for (const field of fields) {
    if (a[field] === undefined || a[field] === null || String(a[field]).trim() === '')
      return {id:a.id,name:a.name,program:a.program,status:'INVALID DATA',reason:'Missing '+field};
    values[field] = Number(a[field]);
    if (!Number.isFinite(values[field]))
      return {id:a.id,name:a.name,program:a.program,status:'INVALID DATA',reason:'Invalid '+field};
  }
  if (values.age < 17 || values.age > 30 || fields.slice(1).some(f => values[f] < 0 || values[f] > 100))
    return {id:a.id,name:a.name,program:a.program,status:'INVALID DATA',reason:'Value out of range'};
  if (!programs.includes(a.program))
    return {id:a.id,name:a.name,program:a.program,status:'INVALID DATA',reason:'Unsupported program'};
  if (a.feePaid !== 'true' && a.feePaid !== 'false')
    return {id:a.id,name:a.name,program:a.program,status:'INVALID DATA',reason:'Invalid feePaid'};
  const merit = values.matricMarks * 0.2 + values.intermediateMarks * 0.3 + values.entryTest * 0.5;
  const eligible = merit >= 70 && values.entryTest >= 60 && values.intermediateMarks >= 60;
  // Policy used: eligible + paid fee = SELECTED; eligible + unpaid fee = WAITING.
  const status = !eligible ? 'REJECTED' : a.feePaid === 'true' ? 'SELECTED' : 'WAITING';
  return {id:a.id,name:a.name,program:a.program,merit:Number(merit.toFixed(2)),status};
}
function summarize(data) {
  const valid = data.filter(a => a.status !== 'INVALID DATA');
  const counts = {};
  for (const a of data) counts[a.program] = (counts[a.program] || 0) + 1;
  const merits = valid.map(a => a.merit);
  return {
    validApplicants:valid.length,invalidApplicants:data.length-valid.length,
    highestMerit:valid.length ? valid.reduce((best,a) => a.merit > best.merit ? a : best) : null,
    lowestMerit:valid.length ? Math.min(...merits) : null,
    averageMerit:valid.length ? Number((merits.reduce((sum,n) => sum+n,0)/valid.length).toFixed(2)) : null,
    byProgram:counts
  };
}
const processed = applicants.map(processApplicant);
console.log('Admission decisions:',processed);
console.log('Summary:',summarize(processed));
console.log('Boundary/invalid tests:',[
  processApplicant({...applicants[0],id:'T1',age:'17',matricMarks:'0'}),
  processApplicant({...applicants[0],id:'T2',entryTest:'101'}),
  processApplicant({...applicants[0],id:'T3',program:'UNKNOWN'})
]);
