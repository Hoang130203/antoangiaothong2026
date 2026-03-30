// components/EmojiRain.js
import React, { useEffect, useState } from 'react';
import styles from './EmojiRain.module.css';

const emojis = ['❄️', '🌟', '🍀', '🌟'];

function EmojiRain() {
    const [emojisList, setEmojisList] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newEmojisList = [...emojisList];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            newEmojisList.push({
                id: Math.random(),
                emoji: randomEmoji,
                bottom: -20,
                left: Math.random() * window.innerWidth,
                animationDuration: Math.random() * 2 + 5,
            });
            setEmojisList(newEmojisList);
        }, 3000);

        return () => clearInterval(interval);
    }, [emojisList]);

    return (
        <div className={styles.container}>
            {emojisList.map((emojiData) => (
                <div
                    key={emojiData.id}
                    className={styles.emoji}
                    style={{
                        bottom: `${emojiData.bottom}vh`,
                        left: `${emojiData.left}px`,
                        animationDuration: `${emojiData.animationDuration}s`,
                    }}
                >
                    {emojiData.emoji}
                </div>
            ))}
        </div>
    );
};

export default EmojiRain;
