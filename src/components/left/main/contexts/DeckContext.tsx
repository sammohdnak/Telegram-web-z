// contexts/DeckContext.ts
import useContext from "../../../../hooks/data/useContext";
import type { FC, TeactNode } from "../../../../lib/teact/teact";
import React, { createContext, useState } from "../../../../lib/teact/teact";
import { useDeckColumns } from "../hooks/useDeckColumns";

export interface Deck {
  name: string;
  chatIds: string[];
}

export interface DeckContextType {
  decks: Deck[];
  addDeck: (name: string) => void;
  removeDeck: (name: string) => void;
  addChatToDeck: (deckName: string, chatId: string) => void;
  removeChatFromDeck: (deckName: string, chatId: string) => void;
  selectedDeck: string;
  setSelectedDeck: (deckName: string) => void;
  isAddColumnOpen: boolean;
  setIsAddColumnOpen: (isOpen: boolean) => void;
}

// Initialize with default values
const defaultContext: DeckContextType = {
  decks: [],
  addDeck: () => {},
  removeDeck: () => {},
  addChatToDeck: () => {},
  removeChatFromDeck: () => {},
  selectedDeck: "",
  setSelectedDeck: () => {},
  isAddColumnOpen: false,
  setIsAddColumnOpen: () => {},
};

const DeckContext = createContext<DeckContextType>(defaultContext);

export const DeckProvider: FC<{ children: TeactNode }> = ({ children }) => {
  const deckState = useDeckColumns();
  const [selectedDeck, setSelectedDeck] = useState<string>(
    deckState.decks.length > 0 ? deckState.decks[0].name : ""
  );

  const [isAddColumnOpen, setIsAddColumnOpen] = useState<boolean>(false);

  return (
    <DeckContext.Provider
      value={{
        ...deckState,
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
