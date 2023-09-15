import { Database } from "./database.js";
import { buildRoutePath } from "./utils/buildRoutePath.js";
import { randomUUID } from "node:crypto";

const database = new Database();

export const routes = [
  //Insert new Task
  {
    method: "POST",
    path: buildRoutePath("/task"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ mesage: "Título é obrigatório" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Descrição é obrigatória" }));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  //List all Tasks
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      return res.writeHead(200).end(JSON.stringify(database.select("tasks")));
    },
  },
  //Update a task
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const { id } = req.params;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Titulo é obrigatório." }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "Descrição é obrigatória." }));
      }

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res
          .writeHead(404)
          .end(
            JSON.stringify({ error: `Nenhuma task encontrada com o id ${id}` })
          );
      }

      database.update("tasks", id, {
        title,
        description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  //Complete a task
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res
          .writeHead(404)
          .end(
            JSON.stringify({ error: `Nenhuma task encontrada com o id ${id}` })
          );
      }

      const isTaskCompleted = !!task.completed_at;

      const completed_at = isTaskCompleted ? null : new Date();

      database.update("tasks", id, { completed_at });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        res
          .writeHead(404)
          .end(
            JSON.stringify({ error: `Nenhuma task encontrada com o id ${id}` })
          );
      }

      database.delete("tasks", id);

      return res.writeHead(200).end();
    },
  },
];
