## Conventions
Follow these remix.js conventions where applicable:

 - Use Remix.js for routing
 - Use DaisyUI for styling
 - Put generic re-usableuse UI components into ./app/ui/common/
 - Breakdown components into smaller pieces so that readability is improved
 - Utilize twMerge of tailwind-merge for merges of tailwind classes
 - Refactor early, by making assumptions where things should live
 - Extract appropriate hooks and state management where needed. Do this often.
 - Assume which files you also have to create so that end to end functionality is implemented
 - Follow the file/folder structure defined below

```
app/
├─ ui/
│  ├─ common/               # Reusable components, usually atoms, if composed of multiple, make a folder Atom/Atom.tsx with child component in the same folder
│  │  └─ Atom.tsx
│  └─ pages/                # Page components, direclty imported by routes
│     └─ *Page/
│        ├─ *Page.tsx       # Main page component for this page     
│        ├─ *.ts            # Pure functions used only on this page
│        └─ use*.ts         # Hooks used only on this page
├─ routes/
│  └─ *.tsx                 # Remix defined routes
├─ hooks
│  └─ use*.ts               # Hooks re-used across the app
├─ utils/
│  └─ PureFunctions.ts      # Pure functions used across the app
└─ services/
  └── StatefulService.ts    # Stateful service used across the app
```
