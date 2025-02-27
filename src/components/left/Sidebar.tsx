import { withGlobal } from "../../global";
import React, {
  FC,
  memo,
  RefObject,
  useEffect,
  useMemo,
} from "../../lib/teact/teact";

import { useState } from "../../lib/teact/teact";
import buildClassName from "../../util/buildClassName";
import Icon from "../common/icons/Icon";
import ProfileInfo from "../common/ProfileInfo";
import ProfileInfoForSidebar from "../common/ProfileInfoForSidebar";
import ProfilePhoto from "../common/ProfilePhoto";
import DeckDialog from "../modals/deckModal/DeckDialog";
import Button from "../ui/Button";
import DropdownMenu from "../ui/DropdownMenu";
import { useDecks } from "./main/contexts/DeckContext";
import { Deck } from "./main/hooks/useDeckColumns";
import LeftSideMenuItems from "./main/LeftSideMenuItems";
import "./Sidebar.scss";

type Props = { deckRef: RefObject<HTMLDivElement | null> };
const TITLE_MAX_LENGTH = 10;

type StateProps = {
  currentUserId?: string;
};

function Sidebar({ deckRef, currentUserId }: Props & StateProps) {
  const {
    userDeckData,
    setSelectedDeck,
    addDeck,
    selectedDeck,
    renameDeck,
    removeDeck,
    setIsAddColumnOpen,
  } = useDecks();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [deckModalOpen, setdeckModalOpen] = useState(false);
  const [deckToManage, setDeckToManage] = useState<Deck>();
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
          <Icon name="animals" />
        </Button>
      );
    }, []);

  console.log(userDeckData, "userDeckdata");

  return (
    <div style={`width:${sideBarOpen ? "220px" : "140px"}`} className="sidebar">
      {/* <DropdownMenu
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
      </DropdownMenu> */}
      <div style="max-height:fit-content;" className="profile-info-sidebar">
        <ProfileInfoForSidebar
          peerId={currentUserId || ""}
          canPlayVideo={true}
          forceShowSelf
        />
      </div>

      <div className="deck-title">
        <h4 style={"margin:0;"}>Decks</h4>
        <Button
          ariaLabel="Add Deck"
          size="tiny"
          round
          color="adaptive"
          style="width:fit-content;"
          onClick={() => {
            addDeck(`Deck ${userDeckData.decks.length + 1}`);
          }}
        >
          <Icon name="add" />
        </Button>
      </div>

      <div className="decks-column">
        {userDeckData.decks.map((_deck, j) => (
          <div key={j} className="deck-row">
            <Button
              size="tiny"
              color={_deck.name === selectedDeck ? "primary" : "secondary"}
              onClick={() => {
                setIsAddColumnOpen(false);
                setSelectedDeck(_deck.name);
              }}
              style="width:fit-content;"
            >
              {_deck.name}
            </Button>
            {sideBarOpen && (
              <Button
                size="tiny"
                round
                color="gray"
                onClick={() => {
                  setDeckToManage(_deck);
                  setdeckModalOpen(true);
                }}
              >
                <Icon name="edit" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <Button
          round
          size="tiny"
          onClick={() => {
            setSideBarOpen(!sideBarOpen);
          }}
        >
          {!sideBarOpen ? (
            <Icon name="arrow-right" />
          ) : (
            <Icon name="arrow-left" />
          )}
        </Button>
        <h4 style={"margin:0;"}>TD</h4>
      </div>
      <DeckDialog
        isOpen={deckModalOpen && deckToManage ? true : false}
        maxLength={TITLE_MAX_LENGTH}
        title={"Edit Deck"}
        subtitle={"Manage your deck settings"}
        placeholder={deckToManage ? deckToManage.name : "Deck 1"}
        initialValue={""}
        onClose={() => {
          setdeckModalOpen(false);
        }}
        onSubmit={(newName) => {
          renameDeck(deckToManage!.name, newName);
          setdeckModalOpen(false);
        }}
        deleteHandler={() => {
          removeDeck(deckToManage!.name);
        }}
      />
    </div>
  );
}

export default memo(
  withGlobal<Props>((global): StateProps => {
    const { currentUserId } = global;

    return {
      currentUserId,
    };
  })(Sidebar)
);
