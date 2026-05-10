import type { Operation } from '../core/operations.ts';
import type { ParamDef } from '../core/operations.ts';

export interface McpToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}

export function buildParamSchema(v: ParamDef): Record<string, unknown> {
  return {
    type: v.type === 'array' ? 'array' : v.type,
    ...(v.description ? { description: v.description } : {}),
    ...(v.enum ? { enum: v.enum } : {}),
    ...(v.default !== undefined ? { default: v.default } : {}),
    ...(v.items ? { items: { type: v.items.type } } : {}),
  };
}

export function buildToolDefs(ops: Operation[]): McpToolDef[] {
  return ops.map(op => ({
    name: op.name,
    description: op.description,
    inputSchema: {
      type: 'object' as const,
      properties: Object.fromEntries(
        Object.entries(op.params).map(([k, v]) => [k, buildParamSchema(v)]),
      ),
      required: Object.entries(op.params)
        .filter(([, v]) => v.required)
        .map(([k]) => k),
    },
  }));
}
