/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import clsx from 'clsx';
import { faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HtmlContent from 'shared/components/HtmlContent';
import { useModuleContext } from 'shared/context';
import { useLocales } from 'shared/hooks';
import { useCurrentBlockRef } from 'user-ui/hooks';
import { useTextWithVariableValues } from 'user-ui/hooks/useTextWithVariableValues';
import { BlockReference, isBlockRefEqual } from 'user-ui/lib';
import classes from './styles.module.scss';

type ReadMoreModalProps = {
  htmlContent: string;
  buttonLabel?: string;
};

const ReadMoreModal: FC<ReadMoreModalProps> = props => {
  const { translate } = useLocales();

  const { htmlContent, buttonLabel, children } = props;
  const content = useTextWithVariableValues(htmlContent);
  const { emitter } = useModuleContext();
  const currentBlockRef = useCurrentBlockRef();
  const prevBlockRef = useRef<BlockReference | undefined>(currentBlockRef);
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback((): number | undefined => {
    if (!show || closing) {
      return;
    }
    emitter.emit('readMoreClosed', currentBlockRef);
    setClosing(true);
    return window.setTimeout(() => {
      setShow(false);
    }, 200);
  }, [closing, currentBlockRef, emitter, show]);

  const handleShow = useCallback(() => {
    setClosing(false);
    setShow(true);
    emitter.emit('readMoreOpened', currentBlockRef);
  }, [currentBlockRef, emitter]);

  useEffect(() => {
    if (isBlockRefEqual(prevBlockRef.current, currentBlockRef)) {
      return;
    }
    const timerId = currentBlockRef && handleClose();
    return () => window.clearTimeout(timerId);
  }, [currentBlockRef, handleClose]);

  useEffect(() => {
    prevBlockRef.current = currentBlockRef;
  }, [currentBlockRef]);

  return (
    <>
      {children ? (
        <div
          role={'presentation'}
          className={classes.readMoreBtnContainer}
          onClick={handleShow}
        >
          {children}
        </div>
      ) : (
        <Button
          variant="custom"
          className={classes.readMoreButton}
          onClick={handleShow}
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
          <div className={classes.readMoreTitle}>
            {buttonLabel || 'Läs mer'}
          </div>
        </Button>
      )}

      <Modal
        className={classes.questionModal}
        contentClassName={clsx(
          classes.modalContent,
          closing && classes.modalClosing,
        )}
        dialogClassName={classes.modalDialog}
        show={show}
        animation={false}
        onHide={handleClose}
      >
        <Modal.Body className={classes.modalBody}>
          <HtmlContent className={classes.modalBodyInner} content={content} />
        </Modal.Body>
        <Modal.Footer className={classes.modalFooter}>
          <Button
            variant="custom"
            className={classes.modalCloseButton}
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className={classes.modalCloseIcon}
            />
            <div className={classes.modalCloseLabel}>
              {translate('buttons.back')}
            </div>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReadMoreModal;
