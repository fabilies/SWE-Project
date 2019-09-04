import { Grade } from "./Grade";
import { List } from "../global/ListOps";

export interface Student {
    name: string
    lastname: string
    age: number
    gender: "man" | "woman",
    city: string
    Grades: List<Grade> 
}

export let Student = (
    name: string,
    lastname: string,
    age: number,
    gender: "man" | "woman",
    city: string,
    grades: List<Grade>
    ) : Student => ({
        name: name,
        lastname: lastname,
        age: age,
        gender: gender,
        city: city,
        Grades: grades
})