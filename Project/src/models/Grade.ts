export interface Grade {
    courseId: string
    grade: number
    studypoints: number
    retake: "yes" | "no",
}

export let Grade = (
    course_name: string,
    grade: number,
    studypoints: number,
    retake: "yes" | "no", )
    : Grade => ({
        courseId: course_name,
        grade: grade,
        studypoints: studypoints,
        retake: retake
})