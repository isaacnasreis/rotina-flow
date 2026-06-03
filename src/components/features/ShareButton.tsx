"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ShareButton({
  className,
  withLabel = false,
  onClickCallback,
}: {
  className?: string;
  withLabel?: boolean;
  onClickCallback?: () => void;
} = {}) {
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
    if (onClickCallback) onClickCallback();
    try {
      const res = await fetch("/api/share", { method: "POST" });
      const data = await res.json();
      if (data.token) {
        const url = `${window.location.origin}/share/${data.token}`;
        setShareUrl(url);
      }
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
      className={
        className ||
        "text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-bg-card-hover relative z-20"
      }
      title="Compartilhar Rotina"
    >
      <Share2 size={withLabel ? 16 : 18} />
      {withLabel && <span>Compartilhar</span>}
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
            className="bg-bg-primary border border-border-active p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl shadow-accent/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-text-muted hover:text-text-primary cursor-pointer p-1 rounded hover:bg-bg-card-hover transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-black uppercase italic mb-2 text-text-primary">
              Sync Link
            </h3>
            <p className="text-sm font-mono text-text-muted mb-8 uppercase tracking-widest">
              Acesso de leitura gerado
            </p>

            {isLoading ? (
              <div className="h-14 flex items-center justify-center border border-border-subtle bg-bg-card rounded-xl">
                <div className="h-4 w-4 bg-accent rounded-full animate-ping"></div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-bg-card border border-border-subtle p-4 rounded-xl font-mono text-xs text-text-primary focus:outline-none focus:border-border-active selection:bg-accent/30 overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-accent hover:opacity-80 text-bg-primary px-6 rounded-xl font-bold transition-colors flex items-center justify-center cursor-pointer"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-bg-card rounded-xl border border-border-subtle">
              <p className="text-xs text-text-muted leading-relaxed italic">
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
