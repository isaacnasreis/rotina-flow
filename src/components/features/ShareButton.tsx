"use client";

import { generateShareToken } from "@/actions/share";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleShareClick = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const token = await generateShareToken();
      const url = `${window.location.origin}/share/${token}`;
      setShareUrl(url);
    } catch (error) {
      console.error("Erro ao gerar link", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ButtonContent = (
    <button
      onClick={handleShareClick}
      className="text-white/50 hover:text-purple-400 transition-colors relative z-20 cursor-pointer"
      title="Compartilhar Rotina"
    >
      <Share2 size={18} />
    </button>
  );

  const ModalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#111] border border-purple-500/30 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl shadow-purple-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/30 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black uppercase italic mb-2 text-white">
              Sync Link
            </h3>
            <p className="text-sm font-mono text-white/40 mb-8 uppercase tracking-widest">
              Acesso de leitura gerado
            </p>

            {isLoading ? (
              <div className="h-14 flex items-center justify-center border border-white/10 bg-black/50 rounded-xl">
                <div className="h-4 w-4 bg-purple-500 rounded-full animate-ping"></div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl font-mono text-xs text-purple-300 focus:outline-none selection:bg-purple-500/30 overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-xl font-bold transition-colors flex items-center justify-center cursor-pointer"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-white/50 leading-relaxed italic">
                * Este link permite apenas a visualização da sua rotina atual. O
                visitante não poderá alterar, adicionar ou concluir blocos de
                fluxo.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {ButtonContent}
      {mounted && isOpen ? createPortal(ModalContent, document.body) : null}
    </>
  );
}
