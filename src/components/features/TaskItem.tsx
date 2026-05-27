"use client";

import { toggleTaskStatus, deleteTask, updateTask } from "@/actions/task";
import { Check, MoreHorizontal, Clock, Tag, Trash2, X, Loader2 } from "lucide-react";
import { useState, useRef, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { ENERGY_TAGS } from "@/lib/constants";
import type { Task } from "@/types";

interface TaskItemProps {
  task: Task;
  isReadOnly?: boolean;
  style?: React.CSSProperties;
}

export function TaskItem({ task, isReadOnly = false, style }: TaskItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isPendingToggle, startToggleTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const tagData = ENERGY_TAGS.find((t) => t.id === task.category);
  const hasTimeInfo = task.startTime || task.endTime;
  const hasCategory = task.category && task.category !== "geral";
  const isRolledOver = new Date(task.createdAt) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleToggle = useCallback(() => {
    if (isReadOnly) return;
    if (!task.isCompleted) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
    startToggleTransition(async () => {
      const result = await toggleTaskStatus(task.id, task.isCompleted);
      if (result?.error) toast.error(result.error);
    });
  }, [task.id, task.isCompleted, isReadOnly]);

  const handleDelete = useCallback(() => {
    startDeleteTransition(async () => {
      const result = await deleteTask(task.id);
      if (result?.success) toast.success(result.success);
      if (result?.error) toast.error(result.error);
      setIsMenuOpen(false);
    });
  }, [task.id]);

  const handleTitleSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === task.title) {
      setEditValue(task.title);
      setIsEditing(false);
      return;
    }
    setIsEditing(false);
    updateTask(task.id, { title: trimmed }).then((result) => {
      if (result?.error) {
        toast.error(result.error);
        setEditValue(task.title);
      }
    });
  }, [editValue, task.id, task.title]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTitleSave();
      }
      if (e.key === "Escape") {
        setEditValue(task.title);
        setIsEditing(false);
      }
    },
    [handleTitleSave, task.title]
  );

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      updateTask(task.id, { category: categoryId }).then((result) => {
        if (result?.error) toast.error(result.error);
      });
      setIsMenuOpen(false);
    },
    [task.id]
  );

  const handleTimeSet = useCallback(
    (startTime: string, endTime: string) => {
      updateTask(task.id, { startTime, endTime }).then((result) => {
        if (result?.error) toast.error(result.error);
      });
      setIsMenuOpen(false);
    },
    [task.id]
  );

  return (
    <div
      className="group relative animate-fade-in"
      style={{ ...style, animationDelay: style?.animationDelay || "0ms" }}
    >
      <div
        className={`
          flex items-center gap-4 py-4 px-4 md:px-5
          transition-all duration-300 relative overflow-hidden
          ${task.isCompleted
            ? "glass-card border-transparent opacity-50 hover:opacity-75"
            : "glass-card hover:border-glass-border hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)]"
          }
          ${justCompleted ? "animate-sparkle" : ""}
        `}
      >
        {/* Checkbox */}
        <button
          type="button"
          disabled={isPendingToggle || isReadOnly}
          onClick={handleToggle}
          className={`
            relative flex-shrink-0 w-6 h-6 rounded-full border-2
            flex items-center justify-center
            transition-all duration-300
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
            ${task.isCompleted
              ? "bg-accent border-accent shadow-[0_0_8px_var(--accent-glow)]"
              : "border-border-subtle hover:border-accent hover:scale-110 hover:shadow-[0_0_0_4px_var(--accent-glow)]"
            }
            ${isPendingToggle ? "opacity-50 cursor-wait" : ""}
            ${isReadOnly ? "cursor-default" : "cursor-pointer"}
          `}
          aria-label={task.isCompleted ? "Desmarcar tarefa" : "Concluir tarefa"}
          aria-pressed={task.isCompleted}
        >
          {isPendingToggle ? (
            <Loader2 size={11} className="animate-spin text-text-muted" />
          ) : task.isCompleted ? (
            <Check size={11} className="text-bg-primary animate-check-pop" strokeWidth={3} />
          ) : null}
        </button>

        {/* Título */}
        <div className="flex-1 min-w-0">
          {isEditing && !isReadOnly ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="w-full bg-bg-card border border-border-active rounded-lg px-3 py-1.5
                text-[15px] text-text-primary focus:outline-none
                shadow-[0_0_0_2px_var(--focus-ring)]"
              autoFocus
              aria-label="Editar título da tarefa"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!isReadOnly) {
                  setIsEditing(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              className={`
                text-left w-full text-[15px] font-medium leading-snug truncate
                ${task.isCompleted ? "task-completed text-text-muted" : "text-text-primary"}
                ${!isReadOnly ? "cursor-text hover:text-accent transition-colors" : "cursor-default"}
              `}
              aria-label={`Tarefa: ${task.title}${task.isCompleted ? " (concluída)" : ""}`}
            >
              {task.title}
            </button>
          )}

          {/* Chips de metadata */}
          {(hasTimeInfo || hasCategory || isRolledOver) && !isEditing && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5" aria-label="Informações da tarefa">
              {isRolledOver && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  <Clock size={9} aria-hidden="true" />
                  De ontem
                </span>
              )}
              {hasTimeInfo && (
                <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary font-mono">
                  <Clock size={10} className="opacity-60" aria-hidden="true" />
                  {task.startTime}
                  {task.endTime && ` – ${task.endTime}`}
                </span>
              )}
              {hasCategory && tagData && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagData.bg} ${tagData.text}`}
                  aria-label={`Categoria: ${tagData.label}`}
                >
                  {tagData.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Botão de opções */}
        {!isReadOnly && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`
              cursor-pointer flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
              transition-all duration-200 border
              ${isMenuOpen
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-transparent border-transparent text-text-muted hover:bg-bg-card-hover hover:border-border-subtle hover:text-text-primary"
              }
              opacity-0 group-hover:opacity-100 focus-visible:opacity-100
            `}
            aria-label="Opções da tarefa"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>

      {/* Menu de opções */}
      {isMenuOpen && !isReadOnly && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            role="menu"
            aria-label="Opções da tarefa"
            className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-bg-primary border border-border-subtle
              shadow-[0_16px_48px_rgba(0,0,0,0.3)] p-3 z-50 animate-slide-up origin-top-right"
          >
            {/* Header do menu */}
            <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-border-subtle">
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                Editar tarefa
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="cursor-pointer p-1 hover:bg-bg-card-hover rounded-md transition-colors"
                aria-label="Fechar menu"
              >
                <X size={13} className="text-text-muted" />
              </button>
            </div>

            {/* Horário rápido */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-accent" aria-hidden="true" />
                <span className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                  Horário
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Presets de horário">
                {[
                  {
                    label: "Agora",
                    getTime: () => {
                      const now = new Date();
                      const h = String(now.getHours()).padStart(2, "0");
                      const m = String(now.getMinutes()).padStart(2, "0");
                      const h2 = String(Math.min(now.getHours() + 1, 23)).padStart(2, "0");
                      return { start: `${h}:${m}`, end: `${h2}:${m}` };
                    },
                  },
                  { label: "Manhã", getTime: () => ({ start: "08:00", end: "12:00" }) },
                  { label: "Tarde",  getTime: () => ({ start: "14:00", end: "18:00" }) },
                  { label: "Noite",  getTime: () => ({ start: "19:00", end: "22:00" }) },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      const { start, end } = preset.getTime();
                      handleTimeSet(start, end);
                    }}
                    className="cursor-pointer px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider
                      rounded-xl bg-bg-card hover:bg-accent/15 hover:text-accent
                      text-text-muted transition-all duration-150 border border-transparent
                      hover:border-accent/20"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={12} className="text-accent" aria-hidden="true" />
                <span className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                  Categoria
                </span>
              </div>
              <div className="flex flex-col gap-1" role="group" aria-label="Selecionar categoria">
                {ENERGY_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    role="menuitem"
                    onClick={() => handleCategorySelect(tag.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer
                      flex items-center gap-2
                      ${task.category === tag.id
                        ? "bg-accent/10 text-text-primary border border-accent/20"
                        : "text-text-secondary hover:bg-bg-card-hover hover:text-text-primary border border-transparent"
                      }`}
                    aria-pressed={task.category === tag.id}
                  >
                    <span className={`w-2 h-2 rounded-full ${tag.bg} flex-shrink-0`} aria-hidden="true" />
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divisor + Excluir */}
            <div className="h-px bg-border-subtle my-2" role="separator" />
            <button
              type="button"
              role="menuitem"
              onClick={handleDelete}
              disabled={isPendingDelete}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm
                text-red-400 hover:bg-red-500/10 hover:text-red-300
                transition-all duration-150 cursor-pointer disabled:cursor-wait disabled:opacity-50"
              aria-label="Remover tarefa permanentemente"
            >
              {isPendingDelete ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              Remover tarefa
            </button>
          </div>
        </>
      )}
    </div>
  );
}
