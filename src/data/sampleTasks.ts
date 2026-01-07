import type { Column } from "../types/kanban";

export const sampleColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Design system architecture",
        description:
          "Create the initial architecture diagram for the new microservices",
        priority: "high",
      },
      {
        id: "2",
        title: "Write unit tests",
        description: "Add test coverage for the authentication module",
        priority: "medium",
      },
      {
        id: "3",
        title: "Update documentation",
        description: "Review and update the API documentation",
        priority: "low",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "4",
        title: "Implement user dashboard",
        description: "Build the main dashboard with charts and metrics",
        priority: "high",
      },
      {
        id: "5",
        title: "Fix login bug",
        description: "Users are getting logged out unexpectedly on mobile",
        priority: "medium",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "6",
        title: "Set up CI/CD pipeline",
        description: "Configure GitHub Actions for automated deployments",
        priority: "high",
      },
      {
        id: "7",
        title: "Database migration",
        description: "Migrate user data to the new schema",
        priority: "medium",
      },
    ],
  },
];
