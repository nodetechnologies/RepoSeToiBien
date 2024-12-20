import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import nodeAxiosFirebase from '../../utils/nodeAxiosFirebase'; // Utility for requests

const StripoEditor = ({ template, templateId, businessId, tags }) => {
  const stripoRef = useRef(null);
  const currentUser = useSelector((state) => state.core.user);
  const businessPreference = useSelector((state) => state.core.businessData);
  const { t, i18n } = useTranslation();

  // Function to handle token refresh request
  const onTokenRefreshRequest = async (callback) => {
    const data = await nodeAxiosFirebase({
      method: 'POST',
      url: 'https://plugins.stripo.email/api/v1/auth',
      body: {
        pluginId: process.env.REACT_APP_STRIPO_PLUGIN_ID,
        secretKey: process.env.REACT_APP_STRIPO_SECRET_KEY,
        userId: businessPreference?.id,
        role: 'user',
      },
    });
    callback(data.token);
  };

  useEffect(() => {
    const initPlugin = () => {
      const editorContainer = document.getElementById('stripoEditorContainer');

      if (editorContainer) {
        const script = document.createElement('script');
        script.id = 'stripoScript';
        script.type = 'text/javascript';
        script.src =
          'https://plugins.stripo.email/resources/uieditor/latest/UIEditor.js';
        script.onload = () => {
          window.UIEditor.initEditor(editorContainer, {
            metadata: {
              emailId: businessPreference?.id,
              email: currentUser?.activeBusiness?.email,
              username:
                currentUser?.activeBusiness?.displayName ||
                currentUser?.activeBusiness?.name,
              avatarUrl: `https://storage.googleapis.com/node-business-logos/${businessPreference?.id}.png`,
              customVar1: currentUser?.uid,
            },
            locale: i18n.language || 'fr',
            html: template.html,
            css: template.css,
            messageSettingsEnabled: true,
            mergeTags: tags,
            modulesDisabled: false,
            onTokenRefreshRequest: onTokenRefreshRequest,
            notifications: {
              success: (text) => toast.success(text),
              error: (text) => toast.error(text),
              warn: (text) => toast.warn(text),
            },
            codeEditorButtonSelector: '#codeEditor',
            undoButtonSelector: '#undoButton',
            redoButtonSelector: '#redoButton',
            versionHistoryButtonSelector: '#versionHistoryButton',
          });
        };
        document.body.appendChild(script);
      } else {
        console.error('DOM element for editor not found.');
      }
    };

    initPlugin();

    return () => {
      const script = document.getElementById('stripoScript');
      if (script) {
        window.UIEditor.removeEditor();
        document.body.removeChild(script);
      }
    };
  }, [templateId, i18n.language]);

  return (
    <div
      id="stripoEditorContainer"
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
};

StripoEditor.propTypes = {
  onSave: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default StripoEditor;
