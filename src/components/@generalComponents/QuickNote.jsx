// Libraries
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import GeneralText from '../../stories/general-components/GeneralText';

const QuickNote = ({
  elementPath,
  elementDetails,
  handleSave,
  fromList,
  fieldKey,
}) => {
  const { t } = useTranslation();
  const noteInputRef = useRef(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    setNote(elementDetails);
  }, [elementPath]);

  const handleNoteChange = (event, type) => {
    if (type === 'fixed') {
      return;
    } else {
      setNote(event);
    }
  };

  const saveNote = async () => {
    if (note !== '' && note !== elementDetails) {
      handleSave(fieldKey || 'note', note);
    }
  };

  return (
    <div style={{ maxWidth: '100%' }}>
      {fromList ? (
        <GeneralText
          text={note}
          primary={true}
          markdown
          classNameComponent="px-3"
          fontSize="13px"
          size="regular"
        />
      ) : (
        <ReactQuill
          theme="bubble"
          value={note}
          onBlur={saveNote}
          onChange={(e) => handleNoteChange(e, fromList ? 'fixed' : 'note')}
          ref={noteInputRef}
          modules={{
            history: {
              delay: 2000,
              maxStack: 500,
              userOnly: true,
            },
          }}
        />
      )}
    </div>
  );
};

export default QuickNote;
