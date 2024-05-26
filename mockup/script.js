const logoBtn = document.getElementById('tflogo')
const logoText = document.getElementById('tfname')
const sidebar = document.getElementById('main-sidebar')
const item = document.getElementsByClassName('sidebar-item')

let collapsed = true
logoBtn.addEventListener('click', () => {
    switch (collapsed) {
        case true:
            collapsed = false
            logoText.classList.add('collapsed')
            sidebar.classList.add('collapsed')
            for (const i of item) {
                i.classList.add('collapsed')
            }
            break;
        case false:
            collapsed = true
            logoText.classList.remove('collapsed')
            sidebar.classList.remove('collapsed')
            for (const i of item) {
                i.classList.remove('collapsed')
            }
            break;
    }
})