import { Ajv } from 'ajv';
import schema from './lesson-schema.json' with { type: 'json' };
import { createHandler } from './handler.js';
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

Deno.serve(
  createHandler({
    env: (name: string) => Deno.env.get(name),
    fetch: globalThis.fetch.bind(globalThis),
    validate,
    schema,
  }),
);
