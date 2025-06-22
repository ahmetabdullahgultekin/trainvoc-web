import {useState} from 'react';

const NICK_KEY = 'trainvoc_nick';
const AVATAR_KEY = 'trainvoc_avatar';

export function getStoredNick() {
    return localStorage.getItem(NICK_KEY) || '';
}

export function setStoredNick(nick: string) {
    localStorage.setItem(NICK_KEY, nick);
}

export function getStoredAvatar() {
    return localStorage.getItem(AVATAR_KEY) || '';
}

export function setStoredAvatar(avatar: string) {
    localStorage.setItem(AVATAR_KEY, avatar);
}

export default function useProfile() {
    const [nick, setNickState] = useState(getStoredNick());
    const [avatar, setAvatarState] = useState(getStoredAvatar());

    const setNick = (newNick: string) => {
        setStoredNick(newNick);
        setNickState(newNick);
    };

    const setAvatar = (newAvatar: string) => {
        setStoredAvatar(newAvatar);
        setAvatarState(newAvatar);
    };

    return {nick, setNick, avatar, setAvatar};
}

const avatarList = [
    '🦊', '🐱', '🐶', '🐵', '🐸', '🐼', '🐧', '🐯', '🦁', '🐮', '🐨', '🐰', '🐻', '🐷', '🐔', '🦄', '🐙', '🐢', '🐳', '🐝'
];

export {avatarList};
