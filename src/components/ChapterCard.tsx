"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React , {useState, useEffect, useImperativeHandle}from "react";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

// type Props = {
//   chapter: Chapter;
//   chapterIndex: number;
//   completedChapters: Set<String>;
//   setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
// };

// export type ChapterCardHandler = {
//   triggerLoad: () => void;
// };

// const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
//   ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
//     const { toast } = useToast();
//     const [success, setSuccess] = React.useState<boolean | null>(null);
//     const { mutate: getChapterInfo, isLoading } = useMutation({
//       mutationFn: async () => {
//         const response = await axios.post("/api/chapter/getInfo", {
//           chapterId: chapter.id,
//         });
//         return response.data;
//       },
//     });

//     const addChapterIdToSet = React.useCallback(() => {
//       setCompletedChapters((prev) => {
//         const newSet = new Set(prev);
//         newSet.add(chapter.id);
//         return newSet;
//       });
//     }, [chapter.id, setCompletedChapters]);

//     React.useEffect(() => {
//       if (chapter.videoId) {
//         setSuccess(true);
//         addChapterIdToSet;
//       }
//     }, [chapter, addChapterIdToSet]);

//     React.useImperativeHandle(ref, () => ({
//       async triggerLoad() {
//         if (chapter.videoId) {
//           addChapterIdToSet();
//           return;
//         }
//         getChapterInfo(undefined, {
//           onSuccess: () => {
//             setSuccess(true);
//             addChapterIdToSet();
//           },
//           onError: (error) => {
//             console.error(error);
//             setSuccess(false);
//             toast({
//               title: "Error",
//               description: "There was an error loading your chapter",
//               variant: "destructive",
//             });
//             addChapterIdToSet();
//           },
//         });
//       },
//     }));
//     return (
//       <div
//         key={chapter.id}
//         className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
//           "bg-secondary": success === null,
//           "bg-red-500": success === false,
//           "bg-green-500": success === true,
//         })}
//       >
//         <h5>{chapter.name}</h5>
//         {isLoading && <Loader2 className="animate-spin" />}
//       </div>
//     );
//   }
// );

// ChapterCard.displayName = "ChapterCard";

// export default ChapterCard;


const requestQueue :any[]= [];
let queueProcessing = false;

async function processQueue() {
  if (queueProcessing) {
    return;
  }
  queueProcessing = true;

  let delayMs = 60000; 
  const maxDelayMs = 300000; 

  while (requestQueue.length > 0) {
    const { request, resolve, reject } = requestQueue.shift();
    try {
      const response = await request();
      resolve(response);
      delayMs = 60000;
    } catch (error) {
      if (error) {
        
        delayMs = Math.min(delayMs * 2, maxDelayMs);
      } else {
        delayMs = 60000;
      }
      reject(error);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  queueProcessing = false;
}

type Props = {
  chapter: Chapter;
  chapterIndex: number;
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
};

export type ChapterCardHandler = {
  triggerLoad: () => Promise<void>;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
  ({ chapter, completedChapters, setCompletedChapters }, ref) => {
    const { toast } = useToast();
    const [success, setSuccess] = useState<boolean | null>(null);

    const { mutateAsync: getChapterInfo } = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/chapter/getInfo", {
          chapterId: chapter.id,
        });
        return response.data;
      },
    });

    const addChapterIdToSet = React.useCallback(() => {
      setCompletedChapters((prev) => {
        const newSet = new Set(prev);
        newSet.add(chapter.id);
        return newSet;
      });
    }, [chapter.id, setCompletedChapters]);

    const loadChapterInfo = React.useCallback(() => {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          request: () => getChapterInfo(),
          resolve,
          reject,
        });

        processQueue(); // Start processing the queue with the 1-minute delay
      })
        .then(() => {
          setSuccess(true);
          addChapterIdToSet();
        })
        .catch((error) => {
          setSuccess(false);
          toast({
            title: "Error",
            description: "Error loading your chapter",
            variant: "destructive",
          });
          addChapterIdToSet();
        });
    }, [getChapterInfo, addChapterIdToSet, toast]);

    useEffect(() => {
      loadChapterInfo(); 
    }, [loadChapterInfo]);

    useImperativeHandle(ref, () => ({
      async triggerLoad() {
        await loadChapterInfo(); 
      },
    }));

    return (
      <div
        key={chapter.id}
        className={cn("px-4 py-2 mt-2  flex justify-between", {
          "bg-secondary": success === null,
          "bg-red-500": success === false,
          "bg-green-500": success === true,
        })}
      >
        <h5>{chapter.name}</h5>
        {success === null && <Loader2 className="animate-spin" />}
      </div>
    );
  }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;