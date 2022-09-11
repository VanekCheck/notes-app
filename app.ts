interface NoteItem {
  id: number | string
  name: string
  category: Category
  createdAt: Date
  content: string
}
enum Category {
  task = 'task',
  randomThought = 'randomThought',
  idea = 'idea',
  quote = 'quote',
}

// type CategoryStrings = 'task' | 'randomThought' | 'idea' | 'quote'

let noteList: NoteItem[] = [
  {
    id: Math.random().toString(16).slice(2),
    name: 'Shopping List',
    category: Category.task,
    createdAt: new Date(2021, 3, 20, 10),
    content: 'Tomatoes, bread',
  },
  {
    id: Math.random().toString(16).slice(2),
    name: 'The theory of evolution',
    category: Category.randomThought,
    createdAt: new Date(2021, 3, 27, 21),
    content:
      'Evolution is change in the heritable characteristics of biological populations over successive generations',
  },
  {
    id: Math.random().toString(16).slice(2),
    name: 'New Feature',
    category: Category.idea,
    createdAt: new Date(2021, 4, 5, 20),
    content: 'Implement new cool Feature',
  },
  {
    id: Math.random().toString(16).slice(2),
    name: 'William Gaddis',
    category: Category.quote,
    createdAt: new Date(2021, 4, 7, 23),
    content: 'Tomatoes, bread',
  },
  {
    id: Math.random().toString(16).slice(2),
    name: 'Books',
    category: Category.task,
    createdAt: new Date(2021, 4, 15, 24),
    content: 'The Lean Startup',
  },
  {
    id: Math.random().toString(16).slice(2),
    name: 'Magazines',
    category: Category.task,
    createdAt: new Date(2021, 4, 25, 30),
    content: 'The New York Times',
  },
  {
    id: Math.random().toString(16).slice(2),
    name: 'Wish list',
    category: Category.task,
    createdAt: new Date(2021, 4, 27, 12),
    content: '- Spaceship; - Himars;',
  },
]

const archivedList: NoteItem[] = [],
  finishedList: NoteItem[] = []

const list = document.getElementsByClassName('notes-table-main')[0] as Element
const button = document.getElementsByClassName('create-note__button')[0]
const closeIcon = document.getElementsByClassName('cancel-icon')[0]
const form = document.getElementById('create-node') as HTMLFormElement

let openForm = false

button?.addEventListener('click', () => {
  openForm = showHideForm(form, openForm)
})

closeIcon?.addEventListener('click', () => {
  openForm = showHideForm(form, openForm)
})

const initialActiveArchived = { active: 0, archived: 0 }

const noteCategories = {
  task: { ...initialActiveArchived },
  randomThought: { ...initialActiveArchived },
  idea: { ...initialActiveArchived },
  quote: { ...initialActiveArchived },
}

// handle submit

form!.onsubmit = function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  const name = formData.get('name') as string
  const category = formData.get('category') as Category
  const content = formData.get('content') as string

  const currentNote = {
    id: Math.random().toString(16).slice(2),
    name,
    category: Category[category],
    createdAt: new Date(),
    content,
  }

  noteList.push(currentNote)
  addNewNoteItem(currentNote)

  noteCategories[category].active += 1

  // close form
  openForm = showHideForm(form, openForm)
}

// on click
function editNote(e: any) {
  console.log(e)
}

// iife
;(() => {
  noteList.forEach((listItem) => {
    addNewNoteItem(listItem)
  })
})()

// utils
function addNewNoteItem(note: NoteItem) {
  const { id, name, category, createdAt, content } = note
  const template = getListTemplate(id, name, category, createdAt, content)
  list.insertAdjacentHTML('afterbegin', template)

  // add to total count
  noteCategories[category].active++

  const currentElem = document.getElementById(`uuid${id}`) as HTMLElement

  const deleteIcon = document.querySelector(`#uuid${id} .trash-icon`)
  const editIcon = document.querySelector(`#uuid${id} .edit-icon`)
  const archiveIcon = document.querySelector(`#uuid${id} .archive-icon`)

  deleteIcon?.addEventListener('click', () => {
    currentElem.remove()
    noteList = noteList.filter((item) => item.id !== id)

    // delete from total
    noteCategories[category].active--
    console.log(noteCategories)
  })

  editIcon?.addEventListener('click', () => {})

  archiveIcon?.addEventListener('click', () => {
    // remove from noteList
    currentElem.remove()
    noteList = noteList.filter((item) => item.id !== id)

    // push to the archivedList
    archivedList.push({ id, name, category, createdAt, content })

    // add to the total
    noteCategories[category].active--
    noteCategories[category].archived++

    console.log(noteCategories)
  })

  // scroll to top after adding
  list.scrollTop = 0
}

function getListTemplate(
  id: string | number,
  name: string,
  category: Category,
  createdAt: Date,
  content: string
): string {
  const dates = getDatesFromContent(content)
  const iconName = getIconName(category)

  let htmlListTemplate: string = `
        <ul id=uuid${id} class="table__list-item notes-table__list-item">
            <li class="list-item__name">
                <div class="list-item__icon">
                <img src="/icons/${iconName}.png" alt="cart-icon" />
                </div>
                <p>${truncate(name, 15)}</p>
            </li>
            <li>${createdAt.toLocaleDateString()}</li>
            <li>${
              category === Category.randomThought
                ? 'Random Thought'
                : category[0]?.toUpperCase() + category.slice(1)
            }</li>
            <li>${truncate(content, 15)}</li>
            <li>${dates}</li>
            <li class="list-item__icons">
                <img class="edit-icon" src="icons/edit.svg" alt="edit" />
                <img class="archive-icon" src="icons/archive.svg" alt="archive" />
                <img class="trash-icon" src="icons/trash.svg" alt="trash" />
            </li>
        </ul>
        `

  return htmlListTemplate
}
function getDatesFromContent(content: string): string {
  const dates = content.match(/\d{1,2}([\/.-])\d{1,2}\1\d{2,4}/g)
  return truncate(dates?.join(', ') ?? '', 30)
}

function getIconName(category: Category): string {
  switch (category) {
    case Category.quote:
      return 'quote'
    case Category.randomThought:
      return 'mindset'
    case Category.task:
      return 'cart'
    case Category.idea:
      return 'bulb'
  }
}

function truncate(str: string, maxlength: number): string {
  return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str
}

function showHideForm(form: HTMLFormElement, currentState: boolean) {
  form.style.display = currentState ? 'none' : 'flex'
  return !currentState
}
