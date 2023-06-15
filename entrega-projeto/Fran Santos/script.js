const main = document.getElementById('main-content')
const input = document.querySelector('.search-input')
const button = document.querySelector('.search-button')
const repositoriesList = document.createElement('div')
button.addEventListener('click', (e) => {
    e.preventDefault();
    const userName = input.value.trim()
    userName ? getGitHubUser(userName) : alert('Digite um usuário Válido')
    input.value = ""
})

async function getGitHubUser(userName) {

    try {
        const response = await fetch(`https://api.github.com/users/${userName}`);
        const userData = await response.json()

        if (response.status == 404) {
            renderUserNotFound()
        } else {
            renderUserCard(userData)
        }

    } catch (error) {
        console.error('Capiturei um erro:', error)
    }
}

function renderUserCard(user) {

    const { avatar_url, name, login, bio, followers, public_repos, html_url } = user

    main.innerHTML = ` 
    <div class="card">
    <a href=${html_url} target="_blank"> 
    <img class="profile-img" src=${avatar_url} alt="Foto do usuário do GitHub">
    <a/>
   <h2 class="profile-title">${name}<h2/>
   <h4 class="profile-subTitle">${login}<h4/>
   <p class="profile-description">${bio}<p/>
   <div class="profile-infos">
   <div class="box-icons">
   <img src='../../assets/people_outline.png' class ="box-icon">
   <p class="box-text">${followers}<p/>
   <div/>
   <div  id="repo-button" class="box-icons">
   <img src='../../assets/Vector.png' class ="box-icon">
   <p class="box-text">${public_repos}<p/>
   <div/>
   <div/>
   <div/>
   `
    const repoButton = document.getElementById("repo-button")
    console.log(repoButton)
    repoButton.addEventListener('click', (e) => {
        e.preventDefault();
        getRepositories(login);
    })
}



function renderUserNotFound() {
    main.innerHTML = `
<div class="not-found-box">
 <p class="not-found-title">404 : Usuário não encontrado<p/>
 <h3 class="not-found-subtitle">Pesquisa novamente<h3/>
 <img src='../../assets/notfound.png' class ="not-found-img">
<div/>
`
}

async function getRepositories(userName) {

    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos`)
        const repositories = await response.json()

        if (repositories.length === 0) {
            renderRepositoriesPublic(userName)
        } else {
            renderRepositoriesCards(repositories)
        }

    } catch (error) {
        console.error('Capiturei um erro:', error)
    }
}


function renderRepositoriesCards(repositories) {

    repositoriesList.setAttribute('id', 'repositories-list')
    main.appendChild(repositoriesList)

    repositoriesList.innerHTML = ""
    repositories.map((repository) => {

        const { name, description, language, stargazers_count } = repository
        return repositoriesList.innerHTML += `
    <div class="repository">
      <h2 class="repository-title">${name}<h2/>
    <p class="repository-description">${description == null ? "" : description}<p/>
    <div class="repository-details">
      <p class="repository-text">${language == null ? "" : language}<p/>
      <p class="repository-text">
      <img src="../../assets/star.png">${stargazers_count}<p/>
    <div/>
    <div/>
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