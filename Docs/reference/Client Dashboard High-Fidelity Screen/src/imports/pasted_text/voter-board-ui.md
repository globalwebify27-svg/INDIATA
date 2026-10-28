Continue from the existing Election Management Platform design.

Create the next high-fidelity screen:

"06 — High-Fidelity UI / 02 — Voter Board"

IMPORTANT:
- Keep the exact same visual language as the existing Client Dashboard.
- Reuse the existing Design System and Components.
- Do not create a new color palette.
- Do not change typography.
- Do not change the sidebar/header structure.
- Do not redesign the application shell.
- Do not modify the Sitemap, User Flows, Low-Fidelity Wireframes, Design System, or Components.
- Create only the Voter Board screen.
- Make this a production-quality enterprise SaaS interface.

==================================================
VOTER BOARD
==================================================

Use the existing application shell:

Sidebar
+
Top Header
+
Main Content

Keep the sidebar exactly consistent with the Dashboard.

The Voters navigation item must be active.

Main content:

Breadcrumb:
Election Management / Voters

Page heading:
Voters

Supporting text:
Search, filter and manage voter records.

Top-right actions:

[Import Data]
[+ Add Voter]

==================================================
SEARCH
==================================================

Create a prominent search area:

[ 🔍 Search by Name, EPIC, Mobile... ]

Support the concept of searching by:

- Voter Name
- EPIC / Voter ID
- Mobile Number

Add a search/filter action where appropriate.

==================================================
QUICK FILTERS
==================================================

Create a horizontal quick-filter area.

Filters:

[Gender]
[Age]
[Booth]
[Caste]
[Ward]
[Status]

Also include useful quick filters:

[Visited]
[Favorite]
[Mobile Available]

Show selected filters as filter chips.

Include:

[Clear All]

==================================================
ADVANCED FILTERS
==================================================

Create an "Advanced Filters" control.

When opened, it should use the existing Drawer / Filter Panel component.

Include structured filter groups:

Location:
- State
- Lok Sabha
- Vidhan Sabha
- Ward
- Booth
- Village / Area

Personal:
- Gender
- Age
- Date of Birth
- Caste
- Occupation
- Qualification

Contact:
- Mobile
- Email
- Address

Election / Status:
- Voted
- Visited
- Favorite
- Supporter / Opponent / Doubtful / Neutral
- Status

Actions:

[Reset]
[Apply Filters]

Keep the filter panel organized and easy to scan.

==================================================
RESULT SUMMARY
==================================================

Below filters show:

4,250 voters found

Also show active filter count when filters are applied.

Example:

4,250 voters
12 filters applied

==================================================
VOTER TABLE
==================================================

Create a professional data table using the existing Table component.

Columns:

☐
#
Name
EPIC
Gender
Age
Caste
Mobile
Booth
Ward
Status
Actions

Example rows:

Rahul Sharma
XXXXXXX
Male
42
General
98XXXXXX21
Booth 102
Ward 5
Supporter

Amit Patel
XXXXXXX
Male
35
OBC
97XXXXXX45
Booth 102
Ward 5
Neutral

Priya Shah
XXXXXXX
Female
29
General
96XXXXXX88
Booth 103
Ward 6
Doubtful

Use the existing Status Badge component.

Do not use excessive colors.

Use semantic status colors only.

==================================================
ROW ACTIONS
==================================================

Provide a compact row action menu:

View Profile
Edit
Call
WhatsApp
View Family
Voter Slip

Use a dropdown/action menu rather than showing too many buttons in every row.

==================================================
TABLE BEHAVIOR
==================================================

Include:

- Select all checkbox
- Row selection
- Pagination
- Rows per page
- Sort indicators
- Column alignment
- Sticky table header if appropriate
- Horizontal scrolling when needed

Pagination example:

Showing 1–25 of 4,250

[Previous] 1 2 3 ... 170 [Next]

==================================================
BULK ACTIONS
==================================================

When voters are selected, show a bulk-action toolbar.

Example:

12 selected

[Export]
[Send Message]
[Assign Worker]
[Mark Visited]
[More...]

Keep the toolbar compact.

==================================================
EMPTY STATE
==================================================

Create an empty state for zero results:

No voters found

Try changing your search or filters.

[Clear Filters]

==================================================
LOADING STATE
==================================================

Create a loading state using the existing skeleton components.

Show:

Search skeleton
Filter skeleton
Table row skeletons

==================================================
ERROR STATE
==================================================

Create an error state:

Unable to load voter data.

[Retry]

==================================================
RESPONSIVE CONSIDERATIONS
==================================================

Design the desktop version first.

Keep the structure ready for:

1440px desktop
1280px laptop
768px tablet
390px mobile

On smaller screens:

- Sidebar collapses
- Search remains prominent
- Filters become a filter drawer
- Table becomes horizontally scrollable or converts to a card/list representation
- Important voter actions remain accessible

Do not create the full mobile design yet.

==================================================
VISUAL CONSISTENCY
==================================================

Match the existing Client Dashboard:

- Same Inter typography
- Same primary color
- Same background
- Same border treatment
- Same spacing scale
- Same radius
- Same button styles
- Same input styles
- Same table components
- Same sidebar
- Same header

Do not introduce new visual patterns unless necessary.

The Voter Board should feel like the next screen of the SAME application, not a separate design.

==================================================
FINAL GOAL
==================================================

Create a polished, professional voter-management interface suitable for daily operational use.

Prioritize:

Clarity
Searchability
Filtering
Data density
Readability
Fast actions
Consistency

Avoid:

Gradients
Glassmorphism
Huge cards
Excessive rounded corners
Decorative illustrations
Unnecessary animations
Marketing-style design

Create only the Voter Board screen in this step.