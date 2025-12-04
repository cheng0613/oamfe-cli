import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <h1>{{projectName}}</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

let counter = 0
const counterButton = document.querySelector('#counter')
counterButton.addEventListener('click', () => {
  counter++
  counterButton.innerText = \`count is \${counter}\`
})

counterButton.innerText = \`count is \${counter}\`