import { Grade } from "./Grade";
import { List } from "../global/ListOps";

export interface Student {
    name: string
    lastname: string
    age: number
    gender: "male" | "female",
    city: string
    Grades: List<Grade> 
}

export let Student = (
    name: string,
    lastname: string,
    age: number,
    gender: "male" | "female",
    city: string,
    grades: List<Grade>)
    : Student => ({
        name: name,
        lastname: lastname,
        age: age,
        gender: gender,
        city: city,
        Grades: grades
})