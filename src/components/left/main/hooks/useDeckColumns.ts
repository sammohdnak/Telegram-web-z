// hooks/useDeckColumns.ts
import { getGlobal } from '../../../../global';
import { useCallback, useEffect, useState } from '../../../../lib/teact/teact';

export interface Deck {
    name: string;
    chatIds: { chatId: string, topicId?: string }[];
}

export type UserDeckData = {
    userId: string,
    selectedDeck: string,
    decks: Deck[]
}

export const initialUserDeckState: UserDeckData = {
    userId: '1234',
    selectedDeck: 'Deck 1',
    decks: [{
        name: 'Deck 1',
        chatIds: [],
    }]
}


export function useDeckColumns() {

    const global = getGlobal()
    const currentUserId = global.currentUserId || '1234'


    let DECKS_STORAGE_KEY = `telegram_deck_columns_${currentUserId}`;


    const getInitialUserDeckData = () => {
        try {
            const stored = localStorage.getItem(DECKS_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to load decks from storage', err);
        }


        let _initialUserDeckState = initialUserDeckState
        _initialUserDeckState.userId = global.currentUserId || '1234'
        // Default deck if nothing in storage
        return { ..._initialUserDeckState };
    }
    const [userDeckData, setUserDeckData] = useState<UserDeckData>(getInitialUserDeckData());

    // Save to localStorage whenever decks change
    useEffect(() => {
        try {
            localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(userDeckData));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to save decks to storage', err);
        }
    }, [userDeckData]);

    const addDeck = useCallback((name: string) => {

        let _userDeckData = userDeckData
        _userDeckData.decks.push({ name, chatIds: [] })

        console.log({ userDeckData, _userDeckData })
        setUserDeckData({ ..._userDeckData })
    }, []);

    const removeDeck = useCallback((name: string) => {
        let _userDeckData = userDeckData
        _userDeckData.decks = _userDeckData.decks.filter((deck) => deck.name !== name)

        setUserDeckData({ ..._userDeckData })
    }, []);

    const addChatToDeck = useCallback((deckName: string, chatId: string, topicId?: string) => {
        let _userDeckData = userDeckData
        _userDeckData.decks = _userDeckData.decks.map((deck) => {
            if (deck.name === deckName) {
                return {
                    ...deck,
                    chatIds: [...deck.chatIds, { chatId: chatId, topicId: topicId }],
                };
            }
            return deck;
        })

        setUserDeckData({ ..._userDeckData })

    }, []);

    const renameDeck = useCallback((deckName: string, newName: string) => {
        let _userDeckData = userDeckData
        _userDeckData.decks = _userDeckData.decks.map((deck) => {
            if (deck.name === deckName) {
                return {
                    ...deck,
                    name: newName
                };
            }
            return deck;
        })

        setUserDeckData({ ..._userDeckData })

    }, []);

    const removeChatFromDeck = useCallback((deckName: string, chatId: string) => {
        let _userDeckData = userDeckData


        _userDeckData.decks = _userDeckData.decks.map((deck) => {
            if (deck.name === deckName) {
                return {
                    ...deck,
                    chatIds: deck.chatIds.filter((chat) => chat.chatId !== chatId),
                };
            }
            return deck;
        })
        setUserDeckData({ ..._userDeckData })

    }, []);

    return {
        userDeckData,
        addDeck,
        removeDeck,
        addChatToDeck,
        removeChatFromDeck,
        renameDeck
    };
}