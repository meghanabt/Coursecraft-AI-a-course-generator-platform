import { getAuthSession } from '@/lib/auth';
import React from 'react';
import {redirect} from "next/navigation"
import { InfoIcon } from 'lucide-react';
import CreateCourseForm from '@/components/CreateCourseForm';

type Props ={}

const CreatePage= async(props:Props)=>{
    const session = await getAuthSession()
    // if(!session?.user)
    // {
    //     return redirect('/gallery')
    // }
    return(
        <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-16 sm:px-0">
            <h1 className="self-center text-3xl font-bold text-center sm:text-6xl">
                CourseCraft-AI
            </h1>
            <div className="flex p-4 mt-5 border-none bg-secondary">
            <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
            <div>
            Provide a course title or specify the subject you wish to explore. 
            Next, input a series of units, representing the specific topics you intend to study. 
            Our AI will then create a course tailored to your preferences, incorporating the given title, chapters,
             and units.
        </div>
         </div>
    <CreateCourseForm/>
        </div>
    )


}

export default CreatePage;