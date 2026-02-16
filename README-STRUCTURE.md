# Project Structure

This document outlines the project structure for maintainability and scalability.

## Folder Structure

```
AsianLeStaff/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   ├── login.tsx          # Login screen
│   └── clock-in.tsx       # Clock-in screen
│
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components (buttons, modals, etc.)
│   ├── user/             # User-related components
│   └── layout/           # Layout components (headers, containers)
│
├── services/             # Business logic and API calls
│   └── userService.ts    # User-related API calls
│
├── types/                # TypeScript type definitions
│   └── index.ts         # Shared types and interfaces
│
├── utils/                # Utility functions
│   └── validation.ts     # Validation helpers
│
├── constants/            # App constants (if needed)
│
└── hooks/                # Custom React hooks (if needed)
```

## Code Organization Principles

### 1. **Separation of Concerns**
   - **Screens** (`app/`): Handle navigation and screen-level state
   - **Components** (`components/`): Reusable, presentational components
   - **Services** (`services/`): Business logic and API calls
   - **Types** (`types/`): TypeScript definitions
   - **Utils** (`utils/`): Pure utility functions

### 2. **Component Structure**
   - Group by feature/domain (e.g., `user/`, `ui/`, `layout/`)
   - Keep components small and focused
   - Use TypeScript interfaces for props

### 3. **Service Layer**
   - All API calls go through services
   - Services return typed data
   - Easy to mock for testing
   - Easy to swap implementations

### 4. **Type Safety**
   - Define types in `types/` folder
   - Export from index for easy imports
   - Use interfaces for object shapes

## Adding New Features

### Adding a New Screen
1. Create file in `app/` directory
2. Add route to `app/_layout.tsx` if needed
3. Use components from `components/` folder

### Adding a New Component
1. Determine category (ui, user, layout, etc.)
2. Create file in appropriate `components/` subfolder
3. Export from component file
4. Use TypeScript interfaces for props

### Adding a New Service
1. Create file in `services/` folder
2. Define return types using types from `types/`
3. Export functions for use in screens/components

### Adding New Types
1. Add to `types/index.ts` or create new file
2. Export from `types/index.ts` for easy imports

## Best Practices

1. **Import Paths**: Use `@/` alias for root imports (configured in tsconfig.json)
2. **Naming**: Use PascalCase for components, camelCase for functions
3. **File Naming**: Match component/type names with file names
4. **Exports**: Prefer named exports for utilities, default exports for components
5. **Error Handling**: Handle errors in services, show user-friendly messages in screens
