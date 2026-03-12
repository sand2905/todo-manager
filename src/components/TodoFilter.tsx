export type Filter = 'all' | 'active' | 'completed';

interface TodoFilterProps {
  current: Filter;
  onChange: (filter: Filter) => void;
  counts: { all: number; active: number; completed: number };
}

export function TodoFilter({ current, onChange, counts }: TodoFilterProps) {
  const filters: Filter[] = ['all', 'active', 'completed'];

  return (
    <div className="todo-filter">
      {filters.map((f) => (
        <button
          key={f}
          className={current === f ? 'active' : ''}
          onClick={() => onChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
        </button>
      ))}
    </div>
  );
}
