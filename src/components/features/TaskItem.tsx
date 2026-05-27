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
        className={`group flex items-center gap-4 py-4 px-5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
          task.isCompleted
            ? "task-completed"
            : "bg-bg-card hover:bg-bg-card-hover border border-border-subtle hover:border-glass-border"
        } ${justCompleted ? "animate-sparkle" : ""}`}
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
              ? "bg-accent border-accent scale-100"
              : "border-border-subtle hover:border-accent hover:scale-110"
            }
            ${isPendingToggle ? "opacity-50" : ""}
            ${isReadOnly ? "" : "cursor-pointer"}
          `}
          aria-label={task.isCompleted ? "Desmarcar tarefa" : "Concluir tarefa"}
        >
          {isPendingToggle ? (
            <Loader2 size={12} className="animate-spin text-text-muted" />
          ) : task.isCompleted ? (
            <Check size={12} className="text-bg-primary animate-check-pop" strokeWidth={3} />
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
              className="w-full bg-bg-card border border-border-subtle rounded-md px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent"
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
                ${task.isCompleted ? "task-completed text-text-muted" : "text-text-primary"}
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
                <span className="inline-flex items-center gap-1 text-[11px] text-text-muted font-mono">
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
            className="cursor-pointer flex-shrink-0 p-1.5 rounded-lg bg-bg-card text-text-muted hover:bg-bg-card-hover hover:text-text-primary transition-all border border-border-subtle"
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
            className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-bg-primary border border-border-subtle shadow-2xl p-2 z-50 animate-fade-in origin-top-right"
          >
            {/* Close button */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-border-subtle">
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Opções</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="cursor-pointer p-1 hover:bg-bg-card rounded-md transition-colors"
              >
                <X size={12} className="text-text-muted" />
              </button>
            </div>

            {/* Quick Time Setter */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-accent" />
                <span className="text-[11px] text-text-muted font-medium">Horário</span>
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
                    className="cursor-pointer px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-bg-card hover:bg-accent/20 hover:text-accent text-text-muted transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Tag size={12} className="text-accent" />
                <span className="text-[11px] text-text-muted font-medium">Categoria</span>
              </div>
              <div className="flex flex-col gap-1">
                {ENERGY_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleCategorySelect(tag.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      task.category === tag.id ? 'bg-bg-card-hover text-text-primary' : 'text-text-secondary hover:bg-bg-card'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete */}
            <div className="h-px bg-border-subtle my-2 mx-1" />
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPendingDelete}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
