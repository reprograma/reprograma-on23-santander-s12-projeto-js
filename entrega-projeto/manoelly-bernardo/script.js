const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');

button.addEventListener('click', (event) => {
  event.preventDefault();
  const username = input.value.trim();
  username ? getGitUser(username) : alert('Digite um(a) usuário(a) válido(a)!')
  input.value = '';
})

async function getGitUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();
    if (response.status == 404) {
      renderUserNotFound();
    } else {
      renderUserCard(userData);
    }
  } catch (error) {
    console.error(error);
  }
}

function renderUserCard(user) {
  const { avatar_url, name, login, bio, followers, public_repos } = user;
  main.innerHTML =
    `
    <div class="card">
      <img class="profile-img" src=${avatar_url} alt="foto do(a) usuário(a) do github">
      <h2 class="profile-title">${name}</h2>
      <h4 class="profile-subtitle">${login}</h4>
      <p class="profile-description">${bio}</p>
        <div class="profile-infos">
          <div class="box-icons">
            <img src="./assets/people_outline.png" class="box-img">
            <p class="box-text">${followers}</p>
          </div>
          <div id="repo-button" class="box-icons">
            <img src="./assets/Vector.png" class="box-img">
            <p class="box-text">${public_repos}</p>
          </div>
        </div>
    </div>
  `

  const repoButton = document.getElementById('repo-button')
  const imgUser = document.querySelector('.profile-img');

  function handleRepoButtonClick(event) {
    event.preventDefault();
    if (public_repos === 0 || public_repos == null || public_repos == undefined) {
      renderAlertEmptyPublicRepository(name);
    } else {
      getRepositories(login);
    }

    repoButton.style.cursor = 'default';
    imgUser.style.cursor = 'default';

    repoButton.removeEventListener('click', handleRepoButtonClick);
    imgUser.removeEventListener('click', handleRepoButtonClick);
  }

  repoButton.addEventListener('click', handleRepoButtonClick);
  imgUser.addEventListener('click', handleRepoButtonClick);
}

function renderUserNotFound() {
  main.innerHTML =
    `
    <div class="not-found-box">
      <h2 class="not-found-title">404: Usuário(a) não encontrado(a) :(</h2>
      <h3 class="not-found-subtitle">Pesquise novamente</h3>
      <img class="not-found-img" src="./assets/notfound.png" alt="imagem informando que usuário(a) não foi encontrado(a)">
    </div>
  `
}

async function getRepositories(userName) {
  try {
    const response = await fetch(`https://api.github.com/users/${userName}/repos`);
    const repos = await response.json();
    renderRepositoriesCards(repos);
  } catch (error) {
    console.error(error);
  }
}

function renderRepositoriesCards(repositories) {

  const repositoriesList = document.createElement('div');
  repositoriesList.setAttribute('id', 'repositories-list');
  main.appendChild(repositoriesList);

  repositories.forEach((repository) => {
    const { name, description, language, stargazers_count } = repository
    repositoriesList.innerHTML +=
      `
      <div class="repository">
        <h2 class="repository-title">${name}</h2>
        <p class="repository-description">${description ? description : 'Repositório sem descrição.'}</p>
        <div class="repository-details">
          <p class="repository-text">${language ? language : ''}
          </p>
          <p class="repository-text">
            <img src="./assets/star.png" alt="imagem de uma estrela">${stargazers_count}
          </p>
        </div>
      </div>
    `
  })
}

function renderAlertEmptyPublicRepository(nameUser) {

  const repositoryEmpty = document.createElement('div');
  repositoryEmpty.setAttribute('id', 'repositories-list');
  main.appendChild(repositoryEmpty);

  repositoryEmpty.innerHTML =
    `
    <h3> ${nameUser} não tem repositórios públicos ainda.</h3>
    `
}