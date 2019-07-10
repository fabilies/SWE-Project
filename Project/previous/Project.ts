interface Student {
    name: string,
    lastname: string,
    grades:Grade
}

interface Grade {
    grade:number,
    courseId:number
}

let Student = (
    name: string,
    lastname: string,
    grades:Grade
    ): Student => ({
        name: name,
        lastname: lastname,
        grades:grades
})

let Grades = (
    grade:number,
    courseId:number
    ): Grade => ({
        grade:grade,
        courseId: courseId
})


// Het Omit K type wordt gebruikt om bepaalde keys van een object te verwijderen. 
// Het returnt het object minus de keys doorgegeven in k
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type removeName = Omit<Student, "name">

// Pick wordt gebruikt om bepaalde keys van een object te krijgen.
// > T: Het object waar je de keys van wilt hebben.
// > K extends keyof T: De keys die je wilt hebben.
// type substudent = Omit<Student, "name">

interface Selectable<T> {
    select: <key extends keyof T>(this: any, ...properties: key[]) => Selectable<Omit<T, key>>
    toString: () => T
}

let Selectable = <T>(entity: T): Selectable<T> => ({
    ... entity, 
    select: function<key extends keyof T>(this: T, ...properties: key[]): Selectable<Omit<T, key>> {
        const ret: any = {};
        let select_rec = (_this, ks: key[], i) => {
            if(i >= ks.length) return
            let key = ks[i]
            ret[key] = (_this[key])
            select_rec(_this, ks, i + 1)
        }
        select_rec(this, properties, 0)
        return Selectable<Omit<T, key>>(ret);
    },
    toString: function() : T { return entity }
})

let person = Student("John", "Test", Grades[1]);
let sp = Selectable(person);
let combinedTest = sp.select("name", "lastname").toString();
console.log('Combined Select: \n', combinedTest);





// Kan je alleen de van de kolommen selecteren die je al geselecteerd hebt of;
// alleen de kolommen die je nog niet geselecteerd hebt.