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
    if (response.status == 404) {
      renderUserNotFound()
    } else {
      renderUserCard(userData)
    }
  }
  catch (err) {
    console.error("Capturei um erro: ", err)
  }
}

function renderUserCard(user) {
  const { avatar_url, name, login, bio, followers, public_repos } = user
  main.innerHTML = `
    <div class="card">
    
      
      <a href="#" onclick="window.location.href='https://github.com/${login}'" target = _blank>
        <img class="profile-img" src=${avatar_url} alt="foto da usuária do github">
      </a>
      <h2 class="profile-title">${name}</h2>
      <h4 class="profile-subtitle">${login}</h4>
      <p class="profile-description">${bio}</p>
      <div class="profile-infos">
        <div class="box-icons">
          <img src='../../assets/people_outline.png' class='box-img'>
          <p class='box-text'>${followers}</p>
        </div>
        <div id='repo-button' class="box-icons">
          <img src='../../assets/Vector.png' class='box-img'>
          <p class='box-text'>${public_repos}</p>
        </div>
      </div>
    </div> 
  `

  const repoButton = document.getElementById('repo-button')

  repoButton.addEventListener('click', clicado = (e) => {

    e.preventDefault();
    getRepositories(login)
    repoButton.removeEventListener('click', clicado) //impede q oevento ocorra novamente         


  })

}

function renderUserNotFound() {
  main.innerHTML = `
    <div class='not-found-box'>
      <h1 class='not-found-title'>Erro: 404 - Usuária não encontrada 😖</h1>
      <h3 class='not-found-subtitle'>Pesquise novamente</h3>
      <img class='not-found-img' src='../../assets/notfound.png'>
    </div>
  `
}
async function getRepositories(userName) {

  try {
      const response = await fetch(`https://api.github.com/users/${userName}/repos`)
      const repositories = await response.json()

      if(repositories.length === 0){
          renderRepositoriesPublic(userName)
      } else{
          renderRepositoriesCards(repositories)
      }

  } catch (error) {
      console.error('Capiturei um erro:', error)
  }
}

function renderRepositoriesCards(repositories) {

  let repositoriesList = document.getElementById('repositories-list')
  if (!repositoriesList) {
    const repositoriesList = document.createElement('div')
    repositoriesList.setAttribute('id', 'repositories-list')
    main.appendChild(repositoriesList)

  } else {
    repositoriesList.innerHTML = ""
  }


  repositories.map((repository) => {
    const { name, description, language, stargazers_count } = repository
    
    return repositoriesList.innerHTML += `
      <div class='repository'>
        <h2 class='repository-title'>${name}</h2>
        <p class='repository-description'>${description ? description : ""}</p>
        <div class='repository-details'>
          <p class='repository-text'>${language ? language : ""}</p>
          <p class='repository-text'>
            <img src='../../assets/star.png'>
            ${stargazers_count}
          </p>
        </div>
      </div>
    `

  })
}

function renderRepositoriesPublic(userName) {
  main.innerHTML += `
     <div class="no-repository">
       <h3 class="no-repository-title">${userName} não possui repositórios públicos<h3/>
     <div/>
          ` 
 }

/* PARA CASA:
 - A página deve exibir um alerta caso a usuária pesquisada não tenha repositórios públicos; ok
 - Resolver bug de quando clica 2 vezes no botão de repositórios; 
 - Resolver os campos que aparecer null, para que não aparecer; 
 - Click na imagem da usuária para levar ao repositório - ok
 - Personalizem o projeto
*/
