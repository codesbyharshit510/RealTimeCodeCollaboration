import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, username, onCodeChange }) => {
  const editorRef = useRef(null);

  // Initialize CodeMirror and emit codeChange + typing
  useEffect(() => {
    let cm = Codemirror.fromTextArea(
      document.getElementById('realtimeEditor'),
      {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );
    editorRef.current = cm;

    const handleChange = (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);

      if (origin !== 'setValue') {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        socketRef.current.emit(ACTIONS.TYPING,    { roomId, username });
      }
    };

    cm.on('change', handleChange);

    // Clean up CodeMirror instance on unmount
    return () => {
      cm.off('change', handleChange);
      cm.toTextArea();
    };
  }, [roomId, username, onCodeChange, socketRef]);

  // Listen for incoming code changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRemoteCode = ({ code }) => {
      if (code != null && editorRef.current) {
        editorRef.current.setValue(code);
      }
    };

    socket.on(ACTIONS.CODE_CHANGE, handleRemoteCode);

    return () => {
      socket.off(ACTIONS.CODE_CHANGE, handleRemoteCode);
    };
  }, [socketRef]);

  return <textarea id="realtimeEditor" />;
};

export default Editor;
