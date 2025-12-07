# Web Project Detection Middleware

## Purpose
Automatically detect when a task involves web/frontend development to route it to the Anti-YOLO workflow with ASCII wireframing.

## Detection Triggers

### Explicit HTML/Web Keywords
- "HTML", "CSS", "JavaScript", "webpage", "website"
- "frontend", "UI", "user interface", "component" 
- "form", "button", "modal", "dashboard", "page"
- "React", "Vue", "Angular", "Svelte"
- "Bootstrap", "Tailwind", "styled-components"

### Web Application Keywords
- "web app", "application", "app", "full stack app", "frontend app"
- "data table", "tracking table", "tracker", "interface"
- "[platform] application", "LinkedIn tracker", "tracking system"

### Task Type Patterns
- "create [component/page/form/dashboard/app]"
- "build [login/signup/contact/tracker] page"
- "add [search/navigation/sidebar/table]"
- "design [layout/interface/application]"
- "implement [frontend/UI/web app]"

### Implementation Intent Patterns
- "full.*app", "web.*app", "application.*table", "tracking.*app"
- "dashboard.*application", "create.*app.*with", "build.*app.*for"
- Empty project + UI elements (table, dashboard, tracker, form, interface)

### Project Context Detection
Check for existing web project files:
- `package.json` with frontend frameworks
- `index.html`, `*.html` files
- `src/components/`, `public/`, `static/` directories
- CSS/SCSS files
- Frontend build configs (webpack, vite, etc.)

## Integration Point
This middleware is called by `systemcc` before workflow selection:

```
systemcc → web-project-detector → [web detected?] → anti-yolo-web workflow
                                → [not web] → standard workflow selection
```

## Detection Logic

### Priority 1: Explicit Web Keywords
If task contains HTML/CSS/JavaScript/React/Vue keywords → Route to Anti-YOLO Web

### Priority 2: Web Application Intent (NEW!)
If task contains "app"/"application" + UI elements (table/dashboard/tracker) → Route to Anti-YOLO Web
Special case: Empty project + web development intent → Route to Anti-YOLO Web

### Priority 3: Implementation Intent Detection
For empty projects, detect patterns like:
- "full web app", "create app with table", "build [platform] tracker"
- "LinkedIn application tracker", "tracking system", "dashboard application"

### Priority 4: Project Context Detection
If no explicit keywords but project has web files → Ask user:
"I detected this might be a web/frontend project. Would you like to use the visual wireframe workflow? (y/n)"

### Fallback
If uncertain → Use standard workflow (user can manually trigger Anti-YOLO if needed)

## Output Format
Returns detection result to systemcc router:
```json
{
  "isWebProject": true/false,
  "confidence": "high/medium/low", 
  "triggers": ["list of matched keywords/patterns"],
  "recommendedWorkflow": "anti-yolo-web" | "standard"
}
```

## Usage by systemcc
When web project detected, systemcc automatically routes to:
1. ASCII wireframe generation
2. User approval checkpoint  
3. HTML implementation phase
4. Wireframe-driven testing

This ensures all web development tasks get the visual planning benefits of the Anti-YOLO method.