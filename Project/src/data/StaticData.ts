import { Student } from "../models/Student";
import { List, FromArrayToList } from "../global/ListOps";
import { Grade } from "../models/Grade";

export const staticStudentData = () : List<Student> => {
    
    let studentData =
        // Student[] to List<Student>, same counts for Grade[] to List<Grade>
        FromArrayToList([
            Student('Sander', 'van Beek', 24, 'man', 'Rotterdam', 
                FromArrayToList([
                    Grade('Development 7', 4, 4, 'no'),
                    Grade('Development 8', 7, 4, 'yes'),
                    Grade('Software Engineering', 8, 30, 'no')
                ])
            ),
            Student('Johan', 'Beunkamp', 32, 'man', 'Utrecht', 
                FromArrayToList([
                    Grade('Development 8', 3, 4, 'no'),
                    Grade('Analyse 7', 9.1, 8, 'yes'),
                    Grade('Software Engineering', 6.5, 30, 'yes'),
                ])
            ),  
            Student('Sanne', 'Zwarts', 22, 'woman', 'Rotterdam', 
                FromArrayToList([
                    Grade('Analyse 7', 4, 4, 'yes'),
                    Grade('Development 5', 7, 4, 'yes'),
                    Grade('Smart Things', 7, 4, 'no'),
                    Grade('SLC', 6, 1, 'no'),
                    Grade('Software Engineering', 3, 30, 'no')
                ])
            ),
            Student('Johan', 'Zwieten', 25, 'man', 'Schoonhoven', 
                FromArrayToList([
                    Grade('Software Engineering', 8.5, 30, 'no'),
                    Grade('Development 8', 6, 4, 'yes'),
                    Grade('Webshop', 5.4, 8, 'yes')
                ])
            ),
            Student('Cor', 'Oldy', 77, 'man', 'Amsterdam', 
                FromArrayToList([
                    Grade('Software Engineering', 8.5, 30, 'no'),
                    Grade('Development 8', 5.5, 4, 'yes'),
                    Grade('Webshop', 7.7, 8, 'no')
                ])
            ),
            Student('Sam', 'Brink', 21, 'man', 'Utrecht', 
                FromArrayToList([
                    Grade('Software Engineering', 5.5, 30, 'no'),
                    Grade('Development 8', 6.5, 4, 'yes'),
                    Grade('Webshop', 7.5, 8, 'yes')
                ])
            ),
            Student('Roberto', 'Salvioni', 26, 'man', 'Nieuwegein', 
                FromArrayToList([
                    Grade('Software Engineering', 8.5, 30, 'yes'),
                    Grade('Development 8', 6.6, 4, 'yes'),
                    Grade('Webshop', 7.7, 8, 'no')
                ])
            )
        ])

    return studentData
}