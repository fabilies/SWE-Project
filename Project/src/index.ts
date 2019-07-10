import { createSelectable } from "./main/Selectable";
import { staticStudentData } from "./data/StaticData";

// Get all students
let student_static_data = staticStudentData();

// Bind linq operations to student data by making it a Selectable
let students = createSelectable(student_static_data)


// Example queries
let select_query = students.Select("name").Include("Grades", q => q.Select("courseId", "grade").Where(x => x.get("retake").Equals("yes"))).toList().toArray()
let chained_select_query = students.Select("name").Select("lastname")
let select_with_include = students.Select("name", "lastname").Include("Grades", q => q.Select("courseId", "studypoints"))

let select_where = students.Select("name").Where(x => x.get("name").StartsWith("G").And(x => x.get("name").EndsWith("a"))).toList().toArray()
let select_where2 = students.Select("name", "age").Where(x => x.get("age").GreaterThen(25)).toList().toArray()
let select_where3 = students.Select("name").Select("lastname").Include("Grades", q => q.Select("grade", "retake").Where(x => x.get("grade").GreaterThen(5.5))).toList().toArray()


console.log(select_query)


// let fullQuery = students
//                 .Select('name', 'lastname').Select('age', 'gender')
//                 .Include('Grades', q => q
//                 .Select('courseId', 'grade')
//                 .Where(x => x.get('grade').GreaterOrEquals(6)
//                 .Or(x => x.get('courseId').In(['Software Engineering'])))).toList().toArray()

// console.log(fullQuery)