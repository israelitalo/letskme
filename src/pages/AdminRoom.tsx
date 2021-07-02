import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Questions } from '../components/Quetions';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { database } from '../services/firebase';
import { useHistory } from 'react-router-dom';

type RoomParms = {
    id: string;
}

export function AdminRoom() {

    const history = useHistory();
    const params = useParams<RoomParms>();
    const roomId = params.id;

    const { user } = useAuth();
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        });

        history.push('/');
    }

    async function handleRemoveQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswer(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHightlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHightlighted: true,
        });
    }

    return (
        <div id="page-root">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div className="content-left">
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    <span>{questions.length > 0 ? questions.length : 0} perguntas</span>
                </div>
                <div className="question-list">
                    {questions.map((question) => (
                        <Questions
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHightlighted={question.isHightlighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswer(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleHightlightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque a pergunta" />
                                    </button>
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Questions>
                    ))}
                </div>

            </main>
        </div>
    )
}