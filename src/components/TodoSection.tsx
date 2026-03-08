import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2, Circle, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { getTodosByDate, addTodo, toggleTodo, deleteTodo, Todo } from "@/lib/todos";
import { format, addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns";
import { ko } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface TodoSectionProps {
  refreshKey: number;
}

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "오늘";
  if (isTomorrow(date)) return "내일";
  if (isYesterday(date)) return "어제";
  return format(date, "M월 d일 (EEE)", { locale: ko });
}

export default function TodoSection({ refreshKey }: TodoSectionProps) {
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [addDate, setAddDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateStr = format(viewDate, "yyyy-MM-dd");
  const todos = getTodosByDate(dateStr);
  const doneCount = todos.filter((t) => t.done).length;

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addTodo(text, format(addDate, "yyyy-MM-dd"));
    setInput("");
    setShowInput(false);
    // Switch view to the date we just added to
    setViewDate(addDate);
  };

  const handleToggle = (id: string) => toggleTodo(id);
  const handleDelete = (id: string) => deleteTodo(id);

  // Force re-render after mutations
  const [, forceUpdate] = useState(0);
  const mutateAndRefresh = (fn: () => void) => {
    fn();
    forceUpdate((n) => n + 1);
  };

  return (
    <div>
      {/* Header with date navigation */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => setViewDate(subDays(viewDate, 1))} className="p-1 rounded-lg hover:bg-muted/50">
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {formatDateLabel(viewDate)}의 할 일
                {todos.length > 0 && (
                  <span className="text-xs font-normal ml-1">({doneCount}/{todos.length})</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={viewDate}
                onSelect={(d) => { if (d) setViewDate(d); }}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <button onClick={() => setViewDate(addDays(viewDate, 1))} className="p-1 rounded-lg hover:bg-muted/50">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {!isToday(viewDate) && (
            <button
              onClick={() => setViewDate(new Date())}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium ml-1"
            >
              오늘
            </button>
          )}
        </div>
        <button
          onClick={() => { setAddDate(viewDate); setShowInput(!showInput); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary/50 text-secondary-foreground text-xs font-semibold hover:bg-secondary/70 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> 추가
        </button>
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <form
              onSubmit={(e) => { e.preventDefault(); mutateAndRefresh(handleAdd); }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="할 일 입력..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                >
                  추가
                </button>
              </div>
              {/* Date selector for new todo */}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg bg-muted/30"
                  >
                    <CalendarIcon className="w-3 h-3" />
                    {format(addDate, "M월 d일 (EEE)", { locale: ko })}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={addDate}
                    onSelect={(d) => { if (d) { setAddDate(d); setCalendarOpen(false); } }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {todos.length === 0 && !showInput ? (
        <p className="text-xs text-muted-foreground/60 text-center py-4">할 일이 없습니다 ✏️</p>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card border border-border/50 group ${
                  todo.done ? "opacity-50" : ""
                }`}
              >
                <button onClick={() => mutateAndRefresh(() => handleToggle(todo.id))} className="shrink-0">
                  {todo.done ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-muted-foreground/40" />
                  )}
                </button>
                <span className={`text-sm flex-1 ${todo.done ? "line-through text-muted-foreground" : ""}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => mutateAndRefresh(() => handleDelete(todo.id))}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground/50" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
