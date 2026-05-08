import type { FilterTab, TaskPriority } from '../../types'
import type { GroupedTasks } from '../../state/taskHelpers'
import { TodoPanelHeader } from './TodoPanelHeader'
import { SearchBar } from './SearchBar'
import { FilterTabs } from './FilterTabs'
import { PriorityGroup } from './PriorityGroup'
import styles from './TodoPanel.module.css'

type GroupKey = TaskPriority | 'completed'

interface TodoPanelProps {
  groupedTasks: GroupedTasks
  activeFilter: FilterTab
  searchQuery: string
  collapsedGroups: Set<GroupKey>
  onAddTask: () => void
  onSearchChange: (query: string) => void
  onFilterChange: (tab: FilterTab) => void
  onToggleGroupCollapse: (key: GroupKey) => void
  onToggleComplete: (taskId: string) => void
  onToggleStar: (taskId: string) => void
  onMenuClick: (taskId: string) => void
}

const GROUP_ORDER: GroupKey[] = ['high', 'medium', 'low', 'completed']

export function TodoPanel({
  groupedTasks,
  activeFilter,
  searchQuery,
  collapsedGroups,
  onAddTask,
  onSearchChange,
  onFilterChange,
  onToggleGroupCollapse,
  onToggleComplete,
  onToggleStar,
  onMenuClick,
}: TodoPanelProps) {
  return (
    <div className={styles.panel}>
      <TodoPanelHeader onAddTask={onAddTask} />
      <SearchBar value={searchQuery} onChange={onSearchChange} onFilterClick={() => {}} />
      <FilterTabs activeTab={activeFilter} onTabChange={onFilterChange} />
      <div className={styles.taskList}>
        {GROUP_ORDER.map((key) => (
          <PriorityGroup
            key={key}
            groupKey={key}
            tasks={groupedTasks[key]}
            collapsed={collapsedGroups.has(key)}
            onToggleCollapse={onToggleGroupCollapse}
            onToggleComplete={onToggleComplete}
            onToggleStar={onToggleStar}
            onMenuClick={onMenuClick}
          />
        ))}
      </div>
    </div>
  )
}
