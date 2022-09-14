// for Array.from()
interface ArrayConstructor {
  from<T, U>(
    arrayLike: ArrayLike<T>,
    mapfn: (v: T, k: number) => U,
    thisArg?: any
  ): Array<U>
  from<T>(arrayLike: ArrayLike<T>): Array<T>
}

// categories
enum Category {
  task = 'task',
  randomThought = 'randomThought',
  idea = 'idea',
  quote = 'quote',
}

interface NoteItem {
  id: string
  name: string
  category: Category
  createdAt: Date
  content: string
}

// starting notes
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
    content: '- Spaceship; \n- Himars;',
  },
]

// note list of archived items
let archivedList: NoteItem[] = []

const initialActiveArchived = { active: 0, archived: 0 }

const noteCategories = {
  task: { ...initialActiveArchived },
  randomThought: { ...initialActiveArchived },
  idea: { ...initialActiveArchived },
  quote: { ...initialActiveArchived },
}

const list = document.getElementsByClassName('notes-table-main')[0] as Element
const createButton = document.getElementsByClassName('create-note__button')[0]
const archiveButton = document.getElementsByClassName(
  'archive-notes__button'
)[0]
const closeIcon = document.getElementsByClassName('cancel-icon')[0]

const form = document.getElementById('create-node') as HTMLFormElement
const nameField = document.querySelector(
  'input[name="name"]'
) as HTMLInputElement
const categoryField = document.getElementById(
  'select-category'
) as HTMLSelectElement
const contentField = document.querySelector(
  'textarea[name="content"]'
) as HTMLInputElement

// get elements to fill total table
const activeNotesCountElements = document.getElementsByClassName(
  'count-of-active-notes'
)
const archivedNotesCountElements = document.getElementsByClassName(
  'count-of-archived-notes'
)

const noteCategoriesElements = {
  task: {
    active: activeNotesCountElements[0],
    archived: archivedNotesCountElements[0],
  },
  randomThought: {
    active: activeNotesCountElements[1],
    archived: archivedNotesCountElements[1],
  },
  idea: {
    active: activeNotesCountElements[2],
    archived: archivedNotesCountElements[2],
  },
  quote: {
    active: activeNotesCountElements[3],
    archived: archivedNotesCountElements[3],
  },
}

type editObject = {
  currentElem: HTMLElement | null
  category: Category
  id: string
} | null

let openForm = false
let archivedOpen = true
let isEditing = false
let currentEditNote: editObject = null

createButton?.addEventListener('click', () => {
  openForm = showHideForm(form, openForm)
  setEmptyValuesToForm()
  nameField.focus()
})

archiveButton?.addEventListener('click', () => {
  list.textContent = ''

  if (archivedOpen) {
    archivedList.forEach((listItem) => {
      addNewNoteItem(listItem, true)
    })
  } else {
    noteList.forEach((listItem) => {
      addNewNoteItem(listItem)
    })
  }

  archivedOpen = !archivedOpen
})

closeIcon?.addEventListener('click', () => {
  openForm = showHideForm(form, openForm)
  isEditing = false
})

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

  // add to total count
  noteCategories[category].active++

  // add 1 active
  changeTotalView(category)

  addNewNoteItem(currentNote)

  // close form
  openForm = showHideForm(form, openForm)
}

// iife
;(() => {
  noteList.forEach((listItem) => {
    addNewNoteItem(listItem)

    // add to total count
    noteCategories[listItem.category].active++

    // add 1 active
    changeTotalView(listItem.category)
  })

  Array.from(Object.keys(noteCategories)).forEach((category) => {
    changeTotalView(category as Category)
  })
})()

// utils depend on noteList and archiveList
function addNewNoteItem(note: NoteItem, archived: boolean = false) {
  if (isEditing) {
    currentEditNote?.currentElem?.remove()

    noteList = noteList.filter((item) => item.id !== currentEditNote?.id)

    noteCategories[currentEditNote!.category].active--
    changeTotalView(currentEditNote!.category)

    isEditing = false
    currentEditNote = null
  }

  const { id, name, category, createdAt, content } = note

  const template = getListTemplate(
    id,
    name,
    category,
    createdAt,
    content,
    archived
  )
  list.insertAdjacentHTML('afterbegin', template)

  const currentElem = document.getElementById(`uuid${id}`) as HTMLElement

  const deleteIcon = document.querySelector(`#uuid${id} .trash-icon`)
  const editIcon = document.querySelector(`#uuid${id} .edit-icon`)
  const archiveIcon = document.querySelector(`#uuid${id} .archive-icon`)
  const unarchiveIcon = document.querySelector(`#uuid${id} .unarchive-icon`)

  deleteIcon?.addEventListener('click', () => {
    currentElem.remove()
    // delete from total
    if (archived) {
      archivedList = archivedList.filter((item) => item.id !== id)
      noteCategories[category].archived--
    } else {
      noteList = noteList.filter((item) => item.id !== id)
      noteCategories[category].active--
    }

    changeTotalView(category)
  })

  editIcon?.addEventListener('click', () => {
    openForm = showHideForm(form, openForm)
    isEditing = true
    currentEditNote = {
      currentElem,
      category,
      id,
    }
    setCurrentValuesToForm(note)
  })

  if (!archived) {
    archiveIcon?.addEventListener('click', () => {
      currentElem.remove()
      // remove from noteList
      noteList = noteList.filter((item) => item.id !== id)

      // push to the archivedList
      archivedList.push(note)

      // add to the total
      noteCategories[category].active--
      noteCategories[category].archived++
      changeTotalView(category)
    })
  } else {
    unarchiveIcon?.addEventListener('click', () => {
      currentElem.remove()
      // remove from archivedList
      archivedList = archivedList.filter((item) => item.id !== id)

      // push to the noteList
      noteList.push(note)

      // add to the total
      noteCategories[category].active++
      noteCategories[category].archived--
      changeTotalView(category)
    })
  }

  // scroll to top after adding
  list.scrollTop = 0
}

function changeTotalView(category: Category) {
  noteCategoriesElements[
    category
  ].active!.textContent = `${noteCategories[category].active}`

  noteCategoriesElements[
    category
  ].archived!.textContent = `${noteCategories[category].archived}`
}

function showHideForm(form: HTMLFormElement, currentState: boolean) {
  form.style.display = currentState ? 'none' : 'flex'
  return !currentState
}

function getListTemplate(
  id: string | number,
  name: string,
  category: Category,
  createdAt: Date,
  content: string,
  archived: boolean
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
              ${
                !archived
                  ? '<img class="edit-icon" src="icons/edit.svg" alt="edit" />'
                  : ''
              }
                  <img class="${
                    archived ? 'un' : ''
                  }archive-icon" src="icons/archive.svg" alt="archive" />
                  <img class="trash-icon" src="icons/trash.svg" alt="trash" />
              </li>
          </ul>
          `

  return htmlListTemplate
}

// linked to global object
function setCurrentValuesToForm(currentNote: NoteItem) {
  const { name, category, content } = currentNote
  nameField.value = name
  categoryField.value = category
  contentField.value = content
}
// linked to global object
function setEmptyValuesToForm() {
  nameField.value = ''
  categoryField.value = Category.task
  contentField.value = ''
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
