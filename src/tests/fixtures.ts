import type { Task, ChatMessage } from '../types'

const now = new Date().toISOString()
const today9am = (() => { const d = new Date(); d.setHours(9,0,0,0); return d.toISOString() })()
const tomorrow9am = (() => { const d = new Date(); d.setDate(d.getDate()+1); d.setHours(9,0,0,0); return d.toISOString() })()
const future = (() => { const d = new Date(); d.setDate(d.getDate()+7); d.setHours(9,0,0,0); return d.toISOString() })()

export const FIXTURE_TASK_HIGH: Task = { id:'t1', title:'Review Q2 metrics report', priority:'high', completed:false, starred:true, dueDate:tomorrow9am, createdAt:now }
export const FIXTURE_TASK_MEDIUM: Task = { id:'t2', title:'Follow up with design team', priority:'medium', completed:false, starred:false, dueDate:today9am, createdAt:now }
export const FIXTURE_TASK_LOW: Task = { id:'t3', title:'Organize inspiration board', priority:'low', completed:false, starred:false, dueDate:future, createdAt:now }
export const FIXTURE_TASK_COMPLETED: Task = { id:'t4', title:'Send weekly report', priority:'high', completed:true, starred:false, createdAt:now }

export const FIXTURE_TASKS: Task[] = [FIXTURE_TASK_HIGH, FIXTURE_TASK_MEDIUM, FIXTURE_TASK_LOW, FIXTURE_TASK_COMPLETED]

export const FIXTURE_MESSAGES: ChatMessage[] = [
  { id:'m1', role:'user', content:'Add a task to review Q2', timestamp:'10:31 AM', delivered:true },
  { id:'m2', role:'assistant', content:"Got it! I've added the task.", timestamp:'10:31 AM', delivered:true, attachedTask: FIXTURE_TASK_HIGH },
  { id:'m3', role:'user', content:'What are my priorities?', timestamp:'10:32 AM', delivered:true },
  { id:'m4', role:'assistant', content:'Here are your top priorities.', timestamp:'10:32 AM', delivered:true },
]
