import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useConnection } from '@hooks/useConnection';
import { useParams } from 'react-router-dom';

export const TextEditor = () => {
  const SAVE_INTERVAL = 2000;
  const { socket } = useConnection('http://localhost:3001');
  const [ quill, setQuill ] = useState(null);
  const { id: documentId } = useParams();

  useEffect(() => {
    if (!socket || !quill) return;
    const interval = setInterval(() => {
      const delta = quill.getContents();
      socket.emit('save-document', delta);
    }, SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !documentId || !quill) return;

    socket.once('load-document', (document) => {
      quill.setContents(document);
      quill.enable();
    });


    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!quill || !socket) return;
    const handleQuill = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('text-change', delta);
    };
    quill && quill.on('text-change', handleQuill);
    return () => {
      quill && quill.off('text-change', handleQuill);
    };
  }, [quill, socket]);

  useEffect(() => {
    if (!quill || !socket) return;
    const handleQuill = (delta) => {
      quill.updateContents(delta);
    };
    socket && socket.on('recive-changes', handleQuill);
    return () => {
      socket && socket.off('recive-changes', handleQuill);
    };
  }, [quill, socket]);

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    if (quill) return;
    wrapper.innerHtml = '';
    const editor = document.createElement('div');
    wrapper.appendChild(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ align: [] }],
          ['image', 'blockquote', 'code-block'],
          ['clean']
        ]
      }
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, [quill]);

  return <div className="container" ref={wrapperRef}></div>;
};
