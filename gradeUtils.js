export function calculateGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}
export function calculateAverage(courses) {
  return courses.reduce((sum,c) => sum+c.marks,0)/courses.length;
}
export function calculateGPA(courses) {
  // Example grade-point policy because the lab does not provide an official GPA scale.
  const points = {'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'F':0};
  return courses.reduce((sum,c) => sum+points[calculateGrade(c.marks)],0)/courses.length;
}
