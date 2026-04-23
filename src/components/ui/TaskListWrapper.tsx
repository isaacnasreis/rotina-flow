"use client";
import { motion } from "framer-motion";
import { JSX, ReactNode } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
} as const;

export function TaskListWrapper({
  children,
}: {
  children: ReactNode[] | ReactNode;
}): JSX.Element | null {
  if (!children) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative "
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </motion.div>
  );
}
