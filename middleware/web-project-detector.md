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

### Task Type Patterns
- "create [component/page/form/dashboard]"
- "build [login/signup/contact] page"
- "add [search/navigation/sidebar]"
- "design [layout/interface]"
- "implement [frontend/UI]"

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

### Primary Detection (Explicit)
If task contains web keywords or patterns → Route to Anti-YOLO Web

### Secondary Detection (Context)
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