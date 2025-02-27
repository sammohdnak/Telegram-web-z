// contexts/DeckContext.ts
import useContext from "../../../../hooks/data/useContext";
import type { FC, TeactNode } from "../../../../lib/teact/teact";
import React, { createContext, useState } from "../../../../lib/teact/teact";
import { useDeckColumns, UserDeckData } from "../hooks/useDeckColumns";

export interface DeckContextType {
  userDeckData: UserDeckData;
  addDeck: (name: string) => void;
  removeDeck: (name: string) => void;
  addChatToDeck: (deckName: string, chatId: string, topicId?: string) => void;
  removeChatFromDeck: (deckName: string, chatId: string) => void;
  renameDeck: (deckName: string, newName: string) => void;

  selectedDeck: string;
  setSelectedDeck: (deckName: string) => void;
  isAddColumnOpen: boolean;
  setIsAddColumnOpen: (isOpen: boolean) => void;
}

// Initialize with default values
const defaultContext: DeckContextType = {
  userDeckData: {
    userId: "1234",
    selectedDeck: "Deck 1",
    decks: [
      {
        name: "Deck 1",
        chatIds: [],
      },
    ],
  },
  addDeck: () => {},
  removeDeck: () => {},
  addChatToDeck: () => {},
  renameDeck: () => {},
  removeChatFromDeck: () => {},
  selectedDeck: "Deck 1",
  setSelectedDeck: () => {},
  isAddColumnOpen: false,
  setIsAddColumnOpen: () => {},
};

const DeckContext = createContext<DeckContextType>(defaultContext);

export const DeckProvider: FC<{ children: TeactNode }> = ({ children }) => {
  const userDeckState = useDeckColumns();
  const [selectedDeck, setSelectedDeck] = useState<string>(
    userDeckState.userDeckData.decks.length > 0
      ? userDeckState.userDeckData.decks[0].name
      : ""
  );

  const [isAddColumnOpen, setIsAddColumnOpen] = useState<boolean>(false);

  return (
    <DeckContext.Provider
      value={{
        ...userDeckState,
        selectedDeck,
        setSelectedDeck,
        isAddColumnOpen,
        setIsAddColumnOpen,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export function useDecks(): DeckContextType {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDecks must be used within a DeckProvider");
  }
  return context as DeckContextType;
}
