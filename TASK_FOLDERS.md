# Task Folder Mapping

## Connected Full-Stack Group (Single Combined Folder)

- Folder: `task-1.1-2.1-2.3`
- Why combined: `Task 1.1` frontend dashboard is powered by `Task 2.1` campaign API, and `Task 2.3` notification system integrates with the same campaign backend.
- Structure:
  - `task-1.1-2.1-2.3/frontend`
    - Task `1.1` (Campaign Dashboard UI)
    - Task `2.3` frontend part (notification center UI)
  - `task-1.1-2.1-2.3/backend`
    - Task `2.1` (Campaign Management REST API)
    - Task `2.3` backend part (WebSocket server + alert engine + alert persistence)

## Separate Task Folders (Unique Scope)

- Folder: `task-1.2`
  - `task-1.2/frontend`
  - Task `1.2` (AI-Assisted Creative Brief Builder)

- Folder: `task-2.2`
  - `task-2.2/backend`
  - Task `2.2` (AI Content Generation Microservice)

- Folder: `task-section3`
  - `task-section3/q1-debug-express` -> Section 3 Q1
  - `task-section3/q2-use-debounce` -> Section 3 Q2
  - `task-section3/q3-sql-query` -> Section 3 Q3
  - `task-section3/q4-react-optimize` -> Section 3 Q4
  - `task-section3/q5-ai-crud` -> Section 3 Q5

## Quick Rule Used

- If frontend and backend are connected, keep them in one numbered combined folder with separate `frontend` and `backend` subfolders.
- If a task is unique standalone frontend or standalone backend, keep it in its own task-numbered folder.
