const main = document.getElementById('main-content');
const input = document.querySelector('.search-input');
const button = document.querySelector('.search-button');

button.addEventListener('click', (event) => {
  event.preventDefault();
  const username = input.value.trim();
  username ? getGitUsername(username) : alert('Digite um usuário válido')
  input.value = '';
})

async function getGitUsername(username) {
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
      <img class="profile-img" src=${avatar_url} alt="foto de perfil do usuário no github">
      <h2 class="profile-title">${name}</h2>
      <h4 class="profile-subtitle">${login}</h4>
      <p class="profile-description">${bio}</p>
        <div class="profile-infos">
          <div class="box-icons">
            <img src="../../assets/people_outline.png" class="box-img">
            <p class="box-text">${followers}</p>
          </div>
          <div id="repo-button" class="box-icons">
            <img src="../../assets/Vector.png" class="box-img">
            <p class="box-text">${public_repos}</p>
          </div>
        </div>
    </div>
  `
