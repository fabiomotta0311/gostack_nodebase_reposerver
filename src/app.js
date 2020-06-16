const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repo);
  return response.json(repo);
});

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

function preventLikes (request, response, next) {
  const { likes } = request.body;
  if (likes) {
    return response.status(400).json({ likes: 0 });
  }
  return next();
}


app.put("/repositories/:id", preventLikes, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIdx = repositories.findIndex(repository => repository.id === id);
        if ( repoIdx < 0) {
            return response.status(400).json({ error: 'Repository not found' });
        }

  const repo = { id, title, url, techs }
  repositories[repoIdx] = repo;
  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex(repo => repo.id === id);

      if ( repoIdx < 0) {
          return response.status(400).json({ error: 'Repository not found' });
      }
    
  repositories.splice(repoIdx,1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex(repo => repo.id === id);
      if ( repoIdx < 0) {
          return response.status(400).json({ error: 'Repository not found' });
      }

  const repository = repositories.find( repository => repository.id === id );
  
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
