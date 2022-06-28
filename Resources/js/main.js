const cardContainer = document.querySelector('[data-cards]')
const settingsModal = document.querySelector('.settings-modal')
const modalBtn = document.querySelector('.settings-btn')
const closeSettingsBtn = document.querySelector('.close-settings')
const listsContainer = document.querySelector('[data-lists]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const linksContainer = document.querySelector('[data-links]')
const newBkmkInputContainer = document.querySelector('[data-new-bookmark-input-container]')
const newBkmkBtn = document.querySelector('[data-new-bookmark-btn]')
const newBkmkForm = document.querySelector('[data-new-bookmark-form]')
const newBkmkNameInput = document.querySelector('[data-new-bookmark-name-input]')
const newBkmkUrlInput = document.querySelector('[data-new-bookmark-url-input]')
const LOCAL_STORAGE_LIST_KEY = 'bkmk.lists'
const LOCAL_STORAGE_SELECTED_LIST_KEY = 'bkmk.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = sessionStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY)
//=========================
//EVENT LISTENERS
//=========================
//open settings
modalBtn.addEventListener('click',function(){
    settingsModal.classList.add('modal-active')
    deleteItemBtn = document.querySelectorAll('.delete')
    addEL()
})
//close settings
closeSettingsBtn.addEventListener('click',function(){
    settingsModal.classList.remove('modal-active')
    renderCards()
})
//selecting active list
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        if (!newBkmkInputContainer.classList.contains('hidden')) {
            newBkmkInputContainer.classList.add('hidden')
            newBkmkNameInput.value = ""
            newBkmkUrlInput.value = ""
        }
        saveAndRender()
    }
})
//create new bookmark
newBkmkBtn.addEventListener('click', function() {
    newBkmkInputContainer.classList.remove('hidden')
})
newBkmkForm.addEventListener('submit', e => {
    e.preventDefault()
    const bkmkName  = newBkmkNameInput.value
    const bkmkUrl = newBkmkUrlInput.value
    if(bkmkName == null || bkmkUrl == null || bkmkName =='' || bkmkUrl == "") return
    const newBookmark = createBookmark(bkmkName, bkmkUrl)
    lists[selectedListId].links.push(newBookmark)
    saveAndRender()
    
})
//edit button

//=========================
//Functions
//=========================
function createBookmark(name, url) {
    return {name: name, url: url}
}
//function for adding event listeners after elements have been rendered
function addEL() {
    //delete button
    let deleteItemBtn = document.querySelectorAll('.delete')
    deleteItemBtn.forEach(button => {
        button.addEventListener('click', e => {
            e.target.parentNode.parentNode.remove()
            lists[selectedListId].links = lists[selectedListId].links.splice(e.target.id)
            saveAndRender()
        })

    })
    //edit-save button
    let editBtn = document.querySelectorAll('.edit')
    editBtn.forEach(button => {
        button.addEventListener('click', e => {
            //edit
            let nameInput = document.getElementById('nameInput'+e.target.id)
            let urlInput = document.getElementById('urlInput'+e.target.id)
            if(e.target.innerText == 'edit'){
                e.target.innerText = 'save'
                e.target.classList.remove('edit')
                e.target.classList.add('save')
            
                
                console.log(nameInput.value +' '+urlInput.value)
                nameInput.disabled = false
                urlInput.disabled = false
                urlInput.classList.remove('hidden')
                return
            }
            //save
            e.target.innerText = 'edit'
            e.target.classList.remove('save')
            e.target.classList.add('edit')
            lists[selectedListId].links[e.target.id] = createBookmark(nameInput.value, urlInput.value)
            saveAndRender()
        })
    })
    //save title button
    let saveTitle = document.getElementById("titleSave")
    saveTitle.addEventListener('click', e => {
        let titleInput = document.getElementById('title')
        lists[selectedListId].title = titleInput.value
        save()
    })
}
//render
function setDefault() {
    //default storage list
    if (lists.length === 0) {
        lists = [
            {
                id: 0,
                title: "General",
                links: [
                    {name: "Google", url: "https://www.google.com"},
                    {name: "Example", url: "https://www.example.com"},
                    ]
            },
            {
                id: 1,
                title: "Watch",
                links: [
                    {name: "Youtube", url: "https://www.youtube.com/"},
                    {name: "Netflix", url: "https://www.netflix.com/"},
                    {name: "Hulu", url: "https://www.netflix.com/"},
                    {name: "Twitch", url: "https://twitch.tv/"},
                    {name: "AnimeDao", url: "https://animedao.to/"}
                    ]
            },
            {
                id: 2,
                title: "Social",
                links: [
                    {name: "Facebook", url: "httpx://www.facebook.com/"},
                    {name: "Twitter", url: "https://www.twitter.com/"}
                    ] 
            }
        ]
    }
    
    //default open list
    if (selectedListId === null) {
    selectedListId = 0
    save()
    }
}
function saveAndRender() {
    save()
    renderLists()
    renderBKMKs()
    addEL()
}
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    sessionStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId)
}

//render functions
function renderLists()   {
    clearElement(listsContainer)
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.innerText = list.title
        if (list.id == selectedListId) {
            listElement.classList.add('active-list')
        }
        listsContainer.appendChild(listElement)
    })
}
function renderBKMKs() {
    clearElement(listDisplayContainer)
    //title input
    const listTitleInput = document.createElement('input')
    listTitleInput.id = "title"
    listTitleInput.type = "text"
    listTitleInput.value = lists[selectedListId].title
    const listTitleSaveBtn = document.createElement('button')
    listTitleSaveBtn.classList.add('save', 'btn')
    listTitleSaveBtn.innerText = 'save'
    listTitleSaveBtn.id = "titleSave"
    listDisplayContainer.appendChild(listTitleInput)
    listDisplayContainer.appendChild(listTitleSaveBtn)
    //bookmark inputs
    let bkmkCount = 0
    lists[selectedListId].links.forEach( links => {
        const bkmkContainer = document.createElement('li')
        const inputContainer = document.createElement('div')
        const btnContainer = document.createElement('div')
        const bkmkNameInput = document.createElement('input')
        const bkmkUrlInput = document.createElement('input')
        const editBtn = document.createElement('button')
        const deleteBtn = document.createElement('button')
        

        bkmkContainer.classList.add('edit-bookmark')
        btnContainer.classList.add('edit-bookmark-btns')
        bkmkNameInput.type = 'text'
        bkmkNameInput.id = 'nameInput'+bkmkCount
        bkmkNameInput.value = links.name
        bkmkNameInput.disabled = true
        bkmkUrlInput.type = 'text'
        bkmkUrlInput.id = 'urlInput'+bkmkCount
        bkmkUrlInput.value = links.url
        bkmkUrlInput.disabled = true
        bkmkUrlInput.classList.add('hidden')
        editBtn.classList.add('edit', 'btn')
        editBtn.innerText = "edit"
        editBtn.id = bkmkCount
        deleteBtn.classList.add('delete', 'btn')
        deleteBtn.id = bkmkCount
        deleteBtn.innerText = "delete"

        listDisplayContainer.appendChild(bkmkContainer)
        bkmkContainer.appendChild(inputContainer)
        bkmkContainer.appendChild(btnContainer)
        inputContainer.appendChild(bkmkNameInput)
        inputContainer.appendChild(bkmkUrlInput)
        btnContainer.appendChild(editBtn)
        btnContainer.appendChild(deleteBtn)
        bkmkCount++
    })
    //create new button
}
function newBkmk() {
    const bkmkContainer = document.createElement('li')
    const newSiteName = document.createElement('input')
    const newSiteUrl = document.createElement('input')
    const saveBtn = document.createElement('button')
    const deleteBtn = document.createElement('button')

    newSiteName.type = 'text'
    newSiteName.placeholder = "site name"
    newSiteUrl.type = 'text'
    newSiteUrl.placeholder = "site url \"https://www.example.com/\" "

    saveBtn.classList.add('edit-save', 'btn')
    saveBtn.innerText = "save"
    deleteBtn.classList.add('delete', 'btn')
    deleteBtn.innerText = "delete"
    
    listDisplayContainer.appendChild(bkmkContainer)
    bkmkContainer.appendChild(newSiteName)
    bkmkContainer.appendChild(saveBtn)
    bkmkContainer.appendChild(deleteBtn)
    bkmkContainer.appendChild(document.createElement('br'))
    bkmkContainer.appendChild(newSiteUrl)
}
function renderCards() {
    clearElement(cardContainer)
    lists.forEach(list => {
        const card = document.createElement('div')
        const titleElement = document.createElement('h3')
        const linksContainer = document.createElement('ul')
        titleElement.innerText = list.title
        cardContainer.appendChild(card)
        card.appendChild(titleElement)
        card.appendChild(linksContainer)
        list.links.forEach(link => {
            const linkAnchor = document.createElement('a')
            linkAnchor.href = link.url
            const siteName = document.createElement('li')
            siteName.innerText = link.name
            
            linksContainer.appendChild(linkAnchor)
            linkAnchor.appendChild(siteName)
        })        
    })
}
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
function reset() {
    localStorage.clear()
    lists = []
    setDefault()
    saveAndRender()
    renderCards()
}
setDefault()
saveAndRender()
renderCards()