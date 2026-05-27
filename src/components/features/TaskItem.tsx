"use client";

import { toggleTaskStatus, deleteTask, updateTask } from "@/actions/task";
import { Check, MoreHorizontal, Clock, Tag, Trash2, X, Loader2, Settings2 } from "lucide-react";
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
      setTimeout(() => setJustCompleted(false), 500);
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
          flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200
          ${task.isCompleted
            ? "bg-white/[0.02]"
            : "bg-white/[0.03] hover:bg-white/[0.06]"
          }
          ${justCompleted ? "animate-sparkle" : ""}
        `}
      >
        {/* Checkbox Circle */}
        <button
          type="button"
          disabled={isPendingToggle || isReadOnly}
          onClick={handleToggle}
          className={`
            relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300
            flex items-center justify-center
            ${task.isCompleted
              ? "bg-purple-500 border-purple-500 scale-100"
              : "border-white/20 hover:border-purple-400 hover:scale-110"
            }
            ${isPendingToggle ? "opacity-50" : ""}
            ${isReadOnly ? "" : "cursor-pointer"}
          `}
          aria-label={task.isCompleted ? "Desmarcar tarefa" : "Concluir tarefa"}
        >
          {isPendingToggle ? (
            <Loader2 size={12} className="animate-spin text-white/60" />
          ) : task.isCompleted ? (
            <Check size={12} className="text-white animate-check-pop" strokeWidth={3} />
          ) : null}
        </button>

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          {isEditing && !isReadOnly ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="w-full bg-transparent text-[15px] font-medium outline-none text-white caret-purple-400"
              autoFocus
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
                ${task.isCompleted ? "task-completed text-white/40" : "text-white/90"}
                ${!isReadOnly ? "cursor-text" : ""}
              `}
            >
              {task.title}
            </button>
          )}

          {/* Optional metadata chips */}
          {(hasTimeInfo || hasCategory || isRolledOver) && !isEditing && (
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {isRolledOver && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/90 border border-orange-500/20">
                  <Clock size={10} className="opacity-70" />
                  De ontem
                </span>
              )}
              {hasTimeInfo && (
                <span className="inline-flex items-center gap-1 text-[11px] text-white/25 font-mono">
                  <Clock size={10} className="opacity-50" />
                  {task.startTime}
                  {task.endTime && ` - ${task.endTime}`}
                </span>
              )}
              {hasCategory && tagData && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagData.bg} ${tagData.text}`}>
                  {tagData.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* More Options Button */}
        {!isReadOnly && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="cursor-pointer flex-shrink-0 p-1.5 rounded-lg bg-white/[0.04] text-white/40 hover:bg-white/10 hover:text-white/90 transition-all border border-white/[0.02]"
            aria-label="Opções e detalhes"
          >
            <Settings2 size={15} />
          </button>
        )}
      </div>

      {/* Options Menu */}
      {isMenuOpen && !isReadOnly && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 z-50 w-64 glass-card p-3 shadow-xl shadow-black/40 animate-fade-in"
          >
            {/* Close button */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Opções</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="cursor-pointer p-1 hover:bg-white/5 rounded-md transition-colors"
              >
                <X size={12} className="text-white/40" />
              </button>
            </div>

            {/* Quick Time Setter */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-purple-400" />
                <span className="text-[11px] text-white/40 font-medium">Horário</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: "Agora", getTime: () => { const now = new Date(); return { start: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`, end: `${String(Math.min(now.getHours() + 1, 23)).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` }; } },
                  { label: "Manhã", getTime: () => ({ start: "08:00", end: "12:00" }) },
                  { label: "Tarde", getTime: () => ({ start: "14:00", end: "18:00" }) },
                  { label: "Noite", getTime: () => ({ start: "19:00", end: "22:00" }) },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const { start, end } = preset.getTime();
                      handleTimeSet(start, end);
                    }}
                    className="cursor-pointer px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 text-white/40 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={12} className="text-purple-400" />
                <span className="text-[11px] text-white/40 font-medium">Categoria</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ENERGY_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleCategorySelect(tag.id)}
                    className={`
                      cursor-pointer px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all
                      ${task.category === tag.id
                        ? `${tag.bg} ${tag.text} border ${tag.border}`
                        : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/50"
                      }
                    `}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPendingDelete}
              className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-medium border-t border-white/5 mt-1 pt-3"
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
