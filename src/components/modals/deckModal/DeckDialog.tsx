import React, { memo, useState } from "../../../lib/teact/teact";

import useLastCallback from "../../../hooks/useLastCallback";
import useOldLang from "../../../hooks/useOldLang";

import Button from "../../ui/Button";
import InputText from "../../ui/InputText";
import Modal from "../../ui/Modal";

import styles from "./DeckDialog.module.scss";
import ConfirmDialog from "../../ui/ConfirmDialog";
import renderText from "../../common/helpers/renderText";
import Icon from "../../common/icons/Icon";

export type OwnProps = {
  isOpen: boolean;
  title: string;
  subtitle?: React.ReactNode;
  placeholder: string;
  submitText?: string;
  maxLength?: number;
  initialValue?: string;
  onClose: NoneToVoidFunction;
  onSubmit: (text: string) => void;
  deleteHandler: () => void;
};

const DeckDialog = ({
  isOpen,
  title,
  subtitle,
  placeholder,
  submitText,
  maxLength,
  initialValue = "",
  onClose,
  onSubmit,
  deleteHandler,
}: OwnProps) => {
  const lang = useOldLang();

  const [text, setText] = useState(initialValue);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleTextChange = useLastCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    }
  );

  const handleSubmit = useLastCallback(() => {
    onSubmit(text);
  });

  return (
    <>
      <Modal
        className="narrow"
        title={title}
        isOpen={isOpen}
        onClose={onClose}
        isSlim
      >
        {Boolean(subtitle) && <div className={styles.subtitle}>{subtitle}</div>}
        <InputText
          placeholder={placeholder}
          value={text}
          onChange={handleTextChange}
          maxLength={maxLength}
          teactExperimentControlled
        />
        <div className={styles["deck-modal-buttons"]}>
          <Button
            color="danger"
            className="confirm-dialog-button"
            onClick={() => {
              setDeleteModalOpen(true);
            }}
          >
            <Icon name="delete" />
          </Button>
          <div className={styles["name-buttons"]}>
            <Button className="confirm-dialog-button" isText onClick={onClose}>
              {lang("Cancel")}
            </Button>
            <Button className="confirm-dialog-button" onClick={handleSubmit}>
              {submitText || lang("Save")}
            </Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
        textParts={renderText(
          `Are you sure you want to delete ${placeholder}?`,
          ["br", "simple_markdown"]
        )}
        confirmLabel={"Delete Deck"}
        confirmHandler={() => {
          deleteHandler();
          onClose();
        }}
        confirmIsDestructive
      />
    </>
  );
};

export default memo(DeckDialog);
