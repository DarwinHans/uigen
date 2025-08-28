import { test, expect, afterEach, describe } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallIndicator } from "../ToolCallIndicator";

afterEach(() => {
  cleanup();
});

// Helper function to create tool invocation objects
const createToolInvocation = (
  toolName: string,
  args: Record<string, any>,
  state: string = "partial",
  result?: any
) => ({
  toolName,
  args,
  state,
  result,
});

describe("ToolCallIndicator - str_replace_editor tool", () => {
  test("shows 'Creating' message for create command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "/App.jsx",
      file_text: "content"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Creating App.jsx")).toBeDefined();
  });

  test("shows 'Editing' message for str_replace command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "str_replace",
      path: "/components/Button.tsx",
      old_str: "old",
      new_str: "new"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Editing Button.tsx")).toBeDefined();
  });

  test("shows 'Inserting text' message for insert command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "insert",
      path: "/utils/helpers.js",
      insert_line: 5,
      new_str: "new line"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Inserting text in helpers.js")).toBeDefined();
  });

  test("shows 'Viewing' message for view command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "view",
      path: "/package.json"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Viewing package.json")).toBeDefined();
  });

  test("shows 'Undoing changes' message for undo_edit command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "undo_edit",
      path: "/src/main.ts"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Undoing changes in main.ts")).toBeDefined();
  });

  test("shows 'Modifying' message for unknown str_replace_editor command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "unknown_command",
      path: "/test.js"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Modifying test.js")).toBeDefined();
  });
});

describe("ToolCallIndicator - file_manager tool", () => {
  test("shows 'Renaming' message for rename command", () => {
    const toolInvocation = createToolInvocation("file_manager", {
      command: "rename",
      path: "/old-name.jsx",
      new_path: "/new-name.jsx"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Renaming old-name.jsx to new-name.jsx")).toBeDefined();
  });

  test("shows 'Deleting' message for delete command", () => {
    const toolInvocation = createToolInvocation("file_manager", {
      command: "delete",
      path: "/components/OldComponent.tsx"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Deleting OldComponent.tsx")).toBeDefined();
  });

  test("shows 'Managing' message for unknown file_manager command", () => {
    const toolInvocation = createToolInvocation("file_manager", {
      command: "unknown_command",
      path: "/test.js"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Managing test.js")).toBeDefined();
  });
});

describe("ToolCallIndicator - unknown tools", () => {
  test("shows 'Running' message for unknown tool", () => {
    const toolInvocation = createToolInvocation("unknown_tool", {
      some_arg: "value"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Running unknown_tool")).toBeDefined();
  });
});

describe("ToolCallIndicator - file path extraction", () => {
  test("extracts filename from nested path", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "/src/components/ui/Button.tsx"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Creating Button.tsx")).toBeDefined();
  });

  test("handles path without leading slash", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "App.jsx"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Creating App.jsx")).toBeDefined();
  });

  test("handles path with multiple leading slashes", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "///src//components//Button.tsx"
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Creating Button.tsx")).toBeDefined();
  });

  test("handles missing path gracefully", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create"
      // path is missing
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Creating file")).toBeDefined();
  });

  test("handles empty path", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: ""
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Creating file")).toBeDefined();
  });
});

describe("ToolCallIndicator - visual states", () => {
  test("shows loading spinner for in-progress tool call", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "/App.jsx"
    }, "partial");

    const { container } = render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    
    // Check for loading spinner
    const spinner = container.querySelector('[data-testid="loader"]') || 
                    container.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
    
    // Should not have success indicator
    const successDot = container.querySelector('.bg-emerald-500');
    expect(successDot).toBeNull();
  });

  test("shows success dot for completed tool call with result", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "/App.jsx"
    }, "result", "File created successfully");

    const { container } = render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    
    // Check for success dot
    const successDot = container.querySelector('.bg-emerald-500');
    expect(successDot).toBeDefined();
    
    // Should not have loading spinner
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeNull();
  });

  test("shows loading spinner for completed tool call without result", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "/App.jsx"
    }, "result"); // state is "result" but no result value

    const { container } = render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    
    // Should show loading spinner since there's no result
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
    
    // Should not have success indicator
    const successDot = container.querySelector('.bg-emerald-500');
    expect(successDot).toBeNull();
  });

  test("applies correct CSS classes", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      command: "create",
      path: "/App.jsx"
    });

    const { container } = render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    
    // Check for main container classes
    const mainContainer = container.querySelector('.inline-flex.items-center.gap-2');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('bg-neutral-50');
    expect(mainContainer?.className).toContain('rounded-lg');
    expect(mainContainer?.className).toContain('text-xs');
    expect(mainContainer?.className).toContain('font-mono');
    expect(mainContainer?.className).toContain('border');
    expect(mainContainer?.className).toContain('border-neutral-200');
  });
});

describe("ToolCallIndicator - edge cases", () => {
  test("handles file_manager rename without new_path", () => {
    const toolInvocation = createToolInvocation("file_manager", {
      command: "rename",
      path: "/old-file.jsx"
      // new_path is missing
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Renaming old-file.jsx to file")).toBeDefined();
  });

  test("handles str_replace_editor without command", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {
      path: "/App.jsx"
      // command is missing
    });

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Modifying App.jsx")).toBeDefined();
  });

  test("handles empty args object", () => {
    const toolInvocation = createToolInvocation("str_replace_editor", {});

    render(<ToolCallIndicator toolInvocation={toolInvocation} />);
    expect(screen.getByText("Modifying file")).toBeDefined();
  });
});