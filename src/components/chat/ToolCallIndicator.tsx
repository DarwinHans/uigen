import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  args: Record<string, any>;
  state: string;
  result?: any;
}

interface ToolCallIndicatorProps {
  toolInvocation: ToolInvocation;
}

function getToolCallMessage(toolName: string, args: Record<string, any>): string {
  switch (toolName) {
    case "str_replace_editor": {
      const { command, path } = args;
      const fileName = path ? extractFileName(path) : "file";
      
      switch (command) {
        case "create":
          return `Creating ${fileName}`;
        case "str_replace":
          return `Editing ${fileName}`;
        case "insert":
          return `Inserting text in ${fileName}`;
        case "view":
          return `Viewing ${fileName}`;
        case "undo_edit":
          return `Undoing changes in ${fileName}`;
        default:
          return `Modifying ${fileName}`;
      }
    }
    
    case "file_manager": {
      const { command, path, new_path } = args;
      const fileName = path ? extractFileName(path) : "file";
      const newFileName = new_path ? extractFileName(new_path) : "file";
      
      switch (command) {
        case "rename":
          return `Renaming ${fileName} to ${newFileName}`;
        case "delete":
          return `Deleting ${fileName}`;
        default:
          return `Managing ${fileName}`;
      }
    }
    
    default:
      return `Running ${toolName}`;
  }
}

function extractFileName(path: string): string {
  // Remove leading slash and get the last part of the path
  const normalizedPath = path.replace(/^\/+/, '');
  const parts = normalizedPath.split('/');
  return parts[parts.length - 1] || path;
}

export function ToolCallIndicator({ toolInvocation }: ToolCallIndicatorProps) {
  const message = getToolCallMessage(toolInvocation.toolName, toolInvocation.args);
  const isCompleted = toolInvocation.state === "result" && toolInvocation.result;
  
  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}