import { getAuthSession } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import CreateCourseForm from "@/components/CreateCourseForm";
import { checkSubscription } from "@/lib/subscription";

type Props = {};

const CreatePage = async (props: Props) => {

  const isPro = await checkSubscription();
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/gallery");
  }
  
  return (
    <div className="flex flex-col items-start max-w-xl px-8 mx-auto my-16 sm:px-0">
      <h1 className="self-center text-3xl font-bold text-center sm:text-6xl">
        CourseCraft-AI
      </h1>
      <div className="flex p-4 mt-5 border-none bg-secondary">
        <InfoIcon className="w-12 h-12 mr-3 text-blue-400" />
        <div>
        Please input a course title or topic you're interested in learning about, 
        followed by a list of units detailing the specific topics you wish to cover. 
         AI will create a course tailored to your preferences.
        </div>
      </div>

      <CreateCourseForm isPro={isPro} />
    </div>
  );
};

export default CreatePage;