import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import FloatingAIAction from "./FloatingAIAction";
import axios from "axios";
import { fetchTextGeneration } from "../../services/aiGeneration";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const EditorField = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [loading, setLoading] = useState(false);
  const [AITextChange, setAITextChange] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (quill == null || socket == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", id);
  }, [quill, socket, id]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    const interval = setInterval(() => {
      socket.emit("save-changes", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket, AITextChange]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== "user") return;

      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [quill, socket, AITextChange]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    const handleTextChange = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleTextChange);

    return () => {
      socket.off("receive-changes", handleTextChange);
    };
  }, [quill, socket, AITextChange]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const quilInstance = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    quilInstance.disable();
    quilInstance.setText("Loading...");
    setQuill(quilInstance);
  }, []);

  const handleTextOperation = async (operation) => {
    quill.root.innerHTML = ` <p class="loading-line w-3/4 h-4 bg-gray-300 rounded animate-pulse mb-1"></p> <p class="loading-line w-1/2 h-4 bg-gray-300 rounded animate-pulse mb-1"></p> <p class="loading-line w-full h-4 bg-gray-300 rounded animate-pulse mb-1"></p> <p class="loading-line w-1/2 h-4 bg-gray-300 rounded animate-pulse"></p>
    `;
    setLoading(true);
    try {
      const response = await fetchTextGeneration(quill.getText(), operation);

      if (response.success) {
        setAITextChange(true);
        quill.clipboard.dangerouslyPasteHTML(response.text);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FloatingAIAction
        handleTextOperation={handleTextOperation}
        loading={loading}
      />
      <div
        id="editor"
        className="quil-container min-h-full sm:h-screen bg-white"
        ref={wrapperRef}
      ></div>
    </>
  );
};

export default EditorField;
