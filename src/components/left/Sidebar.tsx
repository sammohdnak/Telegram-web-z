import React, { FC, RefObject, useMemo } from "../../lib/teact/teact";

import { useState } from "../../lib/teact/teact";
import buildClassName from "../../util/buildClassName";
import Button from "../ui/Button";
import DropdownMenu from "../ui/DropdownMenu";
import { useDecks } from "./main/contexts/DeckContext";
import LeftSideMenuItems from "./main/LeftSideMenuItems";
import "./Sidebar.scss";
type Props = { deckRef: RefObject<HTMLDivElement | null> };

function Sidebar({ deckRef }: Props) {
  const { decks, setSelectedDeck, addDeck } = useDecks();

  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [isOpen, setisOpen] = useState(false);

  const MainButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <Button
          round
          ripple={true}
          size="smaller"
          color="translucent"
          className={isOpen ? "active" : ""}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={onTrigger}
          ariaLabel={"Access Menu"}
        >
          <div className={buildClassName("animated-menu-icon")} />
        </Button>
      );
    }, []);

  return (
    <div style={`width:${sideBarOpen ? "320px" : "100px"}`} className="sidebar">
      <p>Menu</p>
      <DropdownMenu
        trigger={MainButton}
        footer={`Telegram Beta`}
        className={buildClassName("main-menu")}
        forceOpen={false}
        positionX={"left"}
        transformOriginX={undefined}
        onTransitionEnd={undefined}
      >
        <LeftSideMenuItems
          onSelectArchived={() => {}}
          onSelectContacts={() => {}}
          onSelectSettings={() => {}}
          onBotMenuOpened={() => {}}
          onBotMenuClosed={() => {}}
        />
      </DropdownMenu>
      <div>
        {decks.map((_deck, j) => (
          <div onClick={() => setSelectedDeck(_deck.name)}>{_deck.name}</div>
        ))}
      </div>
      <div
        onClick={() => {
          addDeck(`Deck ${decks.length + 1}`);
        }}
      >
        Add Deck
      </div>
      <div
        onClick={() => {
          setSideBarOpen(!sideBarOpen);
        }}
      >
        Expand
      </div>
    </div>
  );
}

export default Sidebar;
