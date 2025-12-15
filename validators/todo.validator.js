const { z } = require("zod");

const createTodoSchema = z.object({
  title: z.string().min(1).max(100),
  done: z.boolean()
}).strict();

const updateTodoSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  done: z.boolean().optional()
}).strict();

module.exports = {
  createTodoSchema,
  updateTodoSchema
};

