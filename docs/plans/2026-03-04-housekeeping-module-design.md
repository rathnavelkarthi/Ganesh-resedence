# Housekeeping Module Design

**Date:** 2026-03-04
**Status:** Approved
**Approach:** Supabase Backend (new table + frontend integration)

## Problem

No housekeeping management. Room cleaning status (Clean/Dirty) exists on the Rooms page but there's no task assignment, tracking, or auto-generation. Every competitor offers this as a standard feature.

## Solution

A dedicated Housekeeping page in the CRM with:
- Auto-generated cleaning tasks on guest checkout
- Manager view with task board and assignment
- Staff mobile view for self-service status updates
- Real-time sync via Supabase

## Data Model

### Table: `housekeeping_tasks`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Auto-generated |
| tenant_id | uuid (FK → tenants) | Multi-tenant isolation |
| room_id | int (FK → rooms) | Which room to clean |
| assigned_to | uuid (FK → staff, nullable) | Assigned housekeeper |
| task_type | enum | `checkout_clean`, `daily_refresh`, `deep_clean`, `maintenance`, `custom` |
| status | enum | `pending`, `in_progress`, `completed`, `issue_reported` |
| priority | enum | `low`, `normal`, `high`, `urgent` |
| notes | text (nullable) | Staff can add notes/report issues |
| created_at | timestamptz | Auto-set |
| started_at | timestamptz (nullable) | When staff starts cleaning |
| completed_at | timestamptz (nullable) | When staff marks done |
| created_by | uuid (FK → staff, nullable) | null = auto-generated |

### Auto-Generation

When a reservation status changes to `checked_out` (via QuickCheckoutModal or Reservations page), insert a `checkout_clean` task for that room with `priority: high` and `status: pending`. Frontend-driven (not DB trigger) since the checkout flow already exists.

Dedup rule: if a `pending` or `in_progress` task already exists for the same room, don't create a duplicate — bump existing to `urgent`.

## Pages

### 1. Housekeeping Page (Manager View)

**Route:** `/admin/housekeeping`
**Access:** SUPER_ADMIN, MANAGER, RECEPTION
**File:** `src/pages/crm/Housekeeping.tsx`

**Stats bar (top):**
- Rooms to clean (pending count)
- In progress (active count)
- Completed today
- Issues reported

**Task board (main):**
- List view with status filter tabs: All | Pending | In Progress | Completed | Issues
- Each row: Room number, task type badge, assigned staff, priority badge, time elapsed
- Actions: Assign staff, change priority, mark complete, delete

**Quick actions:**
- Create manual task (select room, type, priority, optional assignee)
- Filter by assigned staff, priority, room type

### 2. Staff Mobile View

**Route:** `/admin/my-tasks`
**Access:** HOUSEKEEPING role
**File:** `src/pages/crm/MyTasks.tsx`

**Card-based, mobile-first layout:**
- Shows only tasks assigned to logged-in staff
- Large room number, task type, priority color coding
- Actions per card:
  - "Start" → `in_progress`, set `started_at`
  - "Done" → `completed`, set `completed_at`, update room `cleaning_status` to `clean`
  - "Report Issue" → opens notes field, set `issue_reported`
- Minimal UI, large touch targets

## Integration Points

| Existing Component | Change |
|---|---|
| `QuickCheckoutModal.tsx` | After checkout → insert housekeeping task |
| `Reservations.tsx` | On status change to checked_out → insert task |
| `Rooms.tsx` | Show cleaning task status badge on room cards |
| `Calendar.tsx` | Show cleaning icon on rooms with pending tasks |
| `Sidebar.tsx` | Add "Housekeeping" nav item with pending count badge |
| `CRMApp.tsx` | Add routes for `/housekeeping` and `/my-tasks` |
| `CRMDataContext.tsx` | Add `housekeepingTasks` state, CRUD operations, Supabase queries |

## Error Handling

- Deactivated staff assignee → reassign to unassigned
- Duplicate room task on double-checkout → dedup, bump to urgent
- Network offline → show last-loaded state with "no connection" banner

## Access Control

| Role | Housekeeping Page | My Tasks | Create Task | Assign Staff | Complete Task |
|------|---|---|---|---|---|
| SUPER_ADMIN | Full | - | Yes | Yes | Yes |
| MANAGER | Full | - | Yes | Yes | Yes |
| RECEPTION | Read + assign | - | Yes | Yes | No |
| HOUSEKEEPING | - | Own tasks | No | No | Own tasks |

## Out of Scope (Future)

- Drag-and-drop Kanban board
- Scheduled recurring tasks (daily towel refresh)
- Push notifications
- Time tracking / performance metrics
- Inventory tracking (linens, supplies)
