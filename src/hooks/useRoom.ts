import { useState, useEffect } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FireBaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHightlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHightlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            const databaseRom = room.val();
            const firebaseQuestions: FireBaseQuestions = databaseRom.questions ?? {};

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => ({
                id: key,
                content: value.content,
                author: value.author,
                isHightlighted: value.isHightlighted,
                isAnswered: value.isAnswered,
                likeCount: Object.values(value.likes ?? {}).length,
                likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
            }));

            setTitle(databaseRom.title);
            setQuestions(parsedQuestions);
        });

        return () => {
            roomRef.off('value');
        }
    }, [roomId, user?.id]);

    return { questions, title };
}