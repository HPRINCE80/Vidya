import Counter from "../models/Counter.js";


export const generateStudentId = async () =>{
    const year = new Date().getFullYear(); 
    const counterName = `student_${year}`;
    
    const counter = await Counter.findOneAndUpdate(
        {
            name: counterName
        },
        { $inc :{ value:1}},
        {new:true, upsert:true}
    );

    const sequence = String(counter.value).padStart(3,"0");
    return `PRI${year}${sequence}`;

};