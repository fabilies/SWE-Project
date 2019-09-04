import { createSelectable } from "./main/Selectable";
import { staticStudentData } from "./data/StaticData";

// Get all students
let student_static_data = staticStudentData();

// Bind linq operations to student data by making it a Selectable
let students = createSelectable(student_static_data)


// Example queries
let select_query = students.Select("name").Include("Grades", q => q.Select("courseId")).toList().toArray()
let chained_select_query = students.Select("name").Select("lastname").Include("Grades", q => q.Select("courseId")).toList().toArray()
let select_with_include = students.Select("name", "lastname").Include("Grades", q => q.Select("courseId", "studypoints"))

let test_query = students.Select("name", "gender").Include("Grades", t => t.Select("courseId", "grade", "retake")).toList().toArray()

console.log(test_query[3]);
console.log('\n');
console.log(test_query[2]);
