import { ReactNode } from 'react';
import cx from 'classnames';
import '../styles/question.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    },
    children?: ReactNode;
    isAnswered?: boolean;
    isHightlighted?: boolean;
}

export function Questions({
    author,
    content,
    children,
    isAnswered = false,
    isHightlighted = false
}: QuestionProps) {
    return (
        <div className={cx(
            'question',
            { answered: isAnswered },
            { hightlighted: isHightlighted && !isAnswered },
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                {children &&
                    <div>
                        {children}
                    </div>
                }
            </footer>
        </div>
    );
}