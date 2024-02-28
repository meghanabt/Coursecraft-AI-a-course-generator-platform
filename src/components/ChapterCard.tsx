'use client';
import { cn } from '@/lib/utils';
import { Chapter } from '@prisma/client';
import axios from "axios";
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { error } from 'console';
import { useToast } from './ui/use-toast';

interface Props {
  chapter: Chapter,
  chapterIndex: number,
  completedChapters: Set<String>;
  setCompletedChapters: React.Dispatch<React.SetStateAction<Set<String>>>;
}

export type ChapterCardHandler = {
    triggerLoad: () => void;
  };

const ChapterCard= React.forwardRef<ChapterCardHandler, Props>(({chapter, chapterIndex, setCompletedChapters, completedChapters}, ref) => {

    const {toast} = useToast()
     const [success, setSuccess]= useState<boolean | null>(null);
     const {mutate:getChapterInfo, isLoading}=useMutation({
        mutationFn: async()=>{
            const response= await axios.post('/api/chapter/getInfo')
            return response.data
        }
     })

     const addChapterIdToSet = React.useCallback(() => {
        setCompletedChapters((prev) => {
          const newSet = new Set(prev);
          newSet.add(chapter.id);
          return newSet;
        });
      }, [chapter.id, setCompletedChapters]);
  
        React.useEffect(() => {
            if (chapter.videoId) {
            setSuccess(true);
            addChapterIdToSet;
            }
        }, [chapter, addChapterIdToSet]);
        React.useImperativeHandle(ref, ()=>({
        async triggerLoad()
        {
           getChapterInfo(undefined, {
            onSuccess:(success)=>{
                setSuccess(true)
            },
            onError:(error)=>{
                console.error(error)
                setSuccess(false)
                toast({
                    title: "Error",
                    description: "There was an error loading your chapter",
                    variant: "destructive",
                  });
            }
           })
        }
    }))
  return (
    <div key={chapter.id} className={cn('px-4 py-2 mt-2 rounded flex justify-between',
   { "bg-secondary": success===null,
   "bg-red-500": success===false,
   "bg-green-500": success===true})}
   >
        <h5>
            {chapter.name}
        </h5>
     
    </div>
  );
});

ChapterCard.displayName="ChapterCard"

export default ChapterCard;