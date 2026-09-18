import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </div>
  );
};

const FloatingDockMobile = ({ items, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative flex sm:hidden items-center justify-center", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-3 flex flex-col gap-2 items-center z-50 max-h-[70vh] overflow-y-auto p-1"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.8,
                  transition: {
                    delay: idx * 0.02,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.03 }}
              >
                <button
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setOpen(false);
                  }}
                  aria-label={item.title}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-lg transition-all duration-200 cursor-pointer min-h-[44px]",
                    item.isActive
                      ? "bg-emerald-600 text-white border-emerald-400 font-bold shadow-emerald-600/40 ring-2 ring-emerald-400/30"
                      : "bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="h-5 w-5 flex items-center justify-center">{item.icon}</div>
                  <span className="text-xs font-bold whitespace-nowrap">{item.title}</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
        className={cn(
          "h-13 w-13 rounded-full flex items-center justify-center shadow-2xl border backdrop-blur-lg transition-all duration-300 cursor-pointer active:scale-95",
          open
            ? "bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/40 rotate-180"
            : "bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 transition-transform duration-300" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "hidden sm:flex h-16 gap-3 items-end rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/90 dark:border-slate-800/90 px-3.5 pb-3 shadow-2xl shadow-slate-900/10 dark:shadow-black/50",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({ mouseX, title, icon, onClick, isActive }) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [42, 64, 42]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [42, 64, 42]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={title}
      className="cursor-pointer focus:outline-none relative group"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center relative transition-all duration-150 shadow-xs",
          isActive
            ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400/60"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2.5 py-1 whitespace-pre rounded-lg bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 absolute -top-9 left-1/2 -translate-x-1/2 w-fit text-[11px] font-bold shadow-xl pointer-events-none z-50 backdrop-blur-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
        {isActive && (
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-xs" />
        )}
      </motion.div>
    </button>
  );
}
