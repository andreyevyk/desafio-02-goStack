const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);
  
  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if(!!!repository){
    return response.status(400).json({ message: 'Repository not found' })
  }
  
  repository.title = title ? title : repository.title;
  repository.url = url ? url : repository.url;
  repository.techs = techs ? techs : repository.techs;

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoriesIndex < 0){
    return response.status(400).json({ message: 'Repository not found' })
  }

  repositories.splice(repositoriesIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoriesIndex < 0){
    return response.status(400).json({ message: 'Repository not found' })
  }

  let repository = repositories[repositoriesIndex];
  repository.likes++;

  repositories[repositoriesIndex] = repository;

  return response.json(repository);
});

module.exports = app;
