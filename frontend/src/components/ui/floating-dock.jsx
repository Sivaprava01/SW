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
    <div className={cn("relative flex items-center justify-center max-w-full", className)}>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </div>
  );
};

const FloatingDockMobile = ({ items, className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative hidden", className)}>
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
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-lg cursor-pointer min-h-[44px] transition-colors duration-200",
                    item.isActive
                      ? "bg-orange-600 text-white border-orange-400 font-bold shadow-orange-600/40 ring-2 ring-orange-400/30"
                      : "bg-[#fff8f3]/95 dark:bg-[#14110F]/95 text-stone-700 dark:text-[#FFF5EB] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50 dark:hover:bg-[#28211C]"
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
          "h-12 w-12 rounded-full flex items-center justify-center shadow-2xl border backdrop-blur-lg cursor-pointer active:scale-95 transition-colors duration-200",
          open
            ? "bg-orange-600 text-white border-orange-400 shadow-orange-600/40"
            : "bg-[#fff8f3]/95 dark:bg-[#14110F]/95 text-stone-800 dark:text-[#FFF5EB] border-amber-200/70 dark:border-[#3D332B] hover:bg-orange-50 dark:hover:bg-[#28211C]"
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
      onTouchMove={(e) => {
        if (e.touches[0]) mouseX.set(e.touches[0].pageX);
      }}
      onTouchEnd={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-14 sm:h-16 gap-1 sm:gap-2 md:gap-3 items-end rounded-2xl bg-[#fff8f3]/95 dark:bg-[#14110F]/95 backdrop-blur-lg border border-amber-200/80 dark:border-[#3D332B] px-2 sm:px-3.5 pb-2 sm:pb-3 shadow-2xl shadow-stone-900/10 dark:shadow-black/70 max-w-full overflow-x-auto no-scrollbar will-change-transform",
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

  let widthTransform = useTransform(distance, [-120, 0, 120], [35, 54, 35]);
  let heightTransform = useTransform(distance, [-120, 0, 120], [35, 54, 35]);

  let widthTransformIcon = useTransform(distance, [-120, 0, 120], [17, 26, 17]);
  let heightTransformIcon = useTransform(distance, [-120, 0, 120], [17, 26, 17]);

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={title}
      className="cursor-pointer focus:outline-none relative group flex items-end justify-center shrink-0"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center relative shadow-xs transition-colors duration-200",
          isActive
            ? "bg-orange-600 dark:bg-orange-500 text-white shadow-lg shadow-orange-600/40 ring-2 ring-orange-400/60"
            : "bg-[#fff1e3] dark:bg-[#1e1b19] text-stone-700 dark:text-[#D4C4B5] hover:bg-amber-100 dark:hover:bg-[#28211C] hover:text-orange-700 dark:hover:text-[#ffb690] border border-amber-200/50 dark:border-[#3D332B]"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              transition={{ duration: 0.15 }}
              className="px-2.5 py-1 whitespace-pre rounded-lg bg-stone-900/95 dark:bg-stone-100/95 text-white dark:text-stone-900 absolute -top-9 left-1/2 -translate-x-1/2 w-fit text-[11px] font-bold shadow-xl pointer-events-none z-50 backdrop-blur-xs font-headline"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center pointer-events-none"
        >
          {icon}
        </motion.div>
        {isActive && (
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shadow-xs pointer-events-none" />
        )}
      </motion.div>
    </button>
  );
}
