const main = document.getElementById('main-content')
const input = document.querySelector('.search-input')
const button = document.querySelector('.search-button')

button.addEventListener('click', (e) => {
  e.preventDefault();
  const username = input.value.trim() 
  username ? getGitHubUser(username) : alert("Digite uma usuária válida")
  input.value = ""
})

async function getGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const userData = await response.json()
    if(response.status == 404) {
      renderUserNotFound()
    } else {
      renderUserCard(userData)
    }
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
}

function renderUserCard(user) {
  console.log(user)
  const { avatar_url, name, login, bio, followers, public_repos, html_url } = user
  main.innerHTML = `
    <div class="card">
        <a href= ${html_url} > 
            <img class="profile-img" src=${avatar_url} alt="foto da usuária do github">
        </a>
    <h2 class="profile-title">${name}</h2>
    <h4 class="profile-subtitle">${login}</h4>
    <p class="profile-description">${bio}</p>
     <div class="profile-infos">
     <div class="box-icons">
          <img src='../../reprograma-on23-santander-s12-projeto-js/assets/people_outline.png' class='box-img'>
          <p class='box-text'>${followers}</p>
        </div>
        <div id='repo-button' class="box-icons">
          <img src='../../reprograma-on23-santander-s12-projeto-js/assets/Vector.png' class='box-img'>
          <p class='box-text'>${public_repos}</p>
        </div>
      </div>
    </div> 
  `

  const repoButton = document.getElementById('repo-button')
  
  repoButton.addEventListener('click', (e) => {
    e.preventDefault();
    getRepositories(login)
  })
}

function renderUserNotFound() {
  main.innerHTML = `
    <div class='not-found-box'>
      <h1 class='not-found-title'>404 - Usuária não encontrada 😖</h1>
      <h3 class='not-found-subtitle'>Pesquise novamente</h3>
      <img class='not-found-img' src='../../reprograma-on23-santander-s12-projeto-js/assets/notfound.png'>
    </div>
  `
}


function renderUserReposNotPublic() {
    main.innerHTML += `
      <div class='not-found-box-Public'>
        <h1 class='not-found-title'> Usuária não tem repositório público ainda</h1>
        <img class='not-found-img' src='../../reprograma-on23-santander-s12-projeto-js/assets/repos-nao-encontrada.png'>
      </div>
    `
  }

async function getRepositories(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`)
    const repositories = await response.json()
    
    if(repositories.length ==0){
      renderUserReposNotPublic() 
    }
    renderRepositoriesCards(repositories)
  }
  catch(err) {
    console.error("Capturei um erro: ",err)
  }
}

function renderRepositoriesCards(repositories) {
    let repositoriesList = document.getElementById("repositories-list")
    if(!repositoriesList){
        repositoriesList = document.createElement('div')
        repositoriesList.setAttribute('id', 'repositories-list')
        main.appendChild(repositoriesList)
    }
    else{
        repositoriesList.innerHTML = ""
    }
  
  repositories.map((repository) => {
    const { name, description, language, stargazers_count } = repository
    return repositoriesList.innerHTML += `
      <div class='repository'>
        <h2 class='repository-title'>${name}</h2>
        <p class='repository-description'>${
         description == null ? "sem descrição": description
        }</p>
        <div class='repository-details'>
          <p class='repository-text'>${
            language == null ? "sem linguagem" : language
        }</p>
          <p class='repository-text'>
            <img src='../../reprograma-on23-santander-s12-projeto-js/assets/star.png'>
            ${stargazers_count}
          </p>
        </div>
      </div>
    `
  })
}


/* PARA CASA:
 - A página deve exibir um alerta caso a usuária pesquisada não tenha repositórios públicos;
 - Resolver bug de quando clica 2 vezes no botão de repositórios;
 - Resolver os campos que aparecer null, para que não aparecer;
 - Click na imagem da usuária para levar ao repositório
 - Personalizem o projeto
*/
