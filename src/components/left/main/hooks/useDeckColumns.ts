// hooks/useDeckColumns.ts
import { useCallback, useEffect, useState } from '../../../../lib/teact/teact';

interface Deck {
    name: string;
    chatIds: string[];
}

const DECKS_STORAGE_KEY = 'telegram_deck_columns';

export function useDeckColumns() {

    const getInitialDeckData = () => {
        try {
            const stored = localStorage.getItem(DECKS_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to load decks from storage', err);
        }

        // Default deck if nothing in storage
        return [{
            name: 'Deck 1',
            chatIds: [],
        }];
    }
    const [decks, setDecks] = useState<Deck[]>(getInitialDeckData());

    // Save to localStorage whenever decks change
    useEffect(() => {
        try {
            localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to save decks to storage', err);
        }
    }, [decks]);

    const addDeck = useCallback((name: string) => {
        setDecks((current) => [...current, { name, chatIds: [] }]);
    }, []);

    const removeDeck = useCallback((name: string) => {
        setDecks((current) => current.filter((deck) => deck.name !== name));
    }, []);

    const addChatToDeck = useCallback((deckName: string, chatId: string) => {
        setDecks((current) => current.map((deck) => {
            if (deck.name === deckName) {
                return {
                    ...deck,
                    chatIds: [...deck.chatIds, chatId],
                };
            }
            return deck;
        }));
    }, []);

    const removeChatFromDeck = useCallback((deckName: string, chatId: string) => {

        console.log({ deckName, chatId })
        setDecks((current) => current.map((deck) => {
            if (deck.name === deckName) {
                return {
                    ...deck,
                    chatIds: deck.chatIds.filter((id) => id !== chatId),
                };
            }
            return deck;
        }));
    }, []);

    return {
        decks,
        addDeck,
        removeDeck,
        addChatToDeck,
        removeChatFromDeck,
    };
}