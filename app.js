var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// categories
var Category;
(function (Category) {
    Category["task"] = "task";
    Category["randomThought"] = "randomThought";
    Category["idea"] = "idea";
    Category["quote"] = "quote";
})(Category || (Category = {}));
// starting notes
var noteList = [
    {
        id: Math.random().toString(16).slice(2),
        name: 'Shopping List',
        category: Category.task,
        createdAt: new Date(2021, 3, 20, 10),
        content: 'Tomatoes, bread'
    },
    {
        id: Math.random().toString(16).slice(2),
        name: 'The theory of evolution',
        category: Category.randomThought,
        createdAt: new Date(2021, 3, 27, 21),
        content: 'Evolution is change in the heritable characteristics of biological populations over successive generations'
    },
    {
        id: Math.random().toString(16).slice(2),
        name: 'New Feature',
        category: Category.idea,
        createdAt: new Date(2021, 4, 5, 20),
        content: 'Implement new cool Feature'
    },
    {
        id: Math.random().toString(16).slice(2),
        name: 'William Gaddis',
        category: Category.quote,
        createdAt: new Date(2021, 4, 7, 23),
        content: 'Tomatoes, bread'
    },
    {
        id: Math.random().toString(16).slice(2),
        name: 'Books',
        category: Category.task,
        createdAt: new Date(2021, 4, 15, 24),
        content: 'The Lean Startup'
    },
    {
        id: Math.random().toString(16).slice(2),
        name: 'Magazines',
        category: Category.task,
        createdAt: new Date(2021, 4, 25, 30),
        content: 'The New York Times'
    },
    {
        id: Math.random().toString(16).slice(2),
        name: 'Wish list',
        category: Category.task,
        createdAt: new Date(2021, 4, 27, 12),
        content: '- Spaceship; \n- Himars;'
    },
];
// note list of archived items
var archivedList = [];
var initialActiveArchived = { active: 0, archived: 0 };
var noteCategories = {
    task: __assign({}, initialActiveArchived),
    randomThought: __assign({}, initialActiveArchived),
    idea: __assign({}, initialActiveArchived),
    quote: __assign({}, initialActiveArchived)
};
var list = document.getElementsByClassName('notes-table-main')[0];
var createButton = document.getElementsByClassName('create-note__button')[0];
var archiveButton = document.getElementsByClassName('archive-notes__button')[0];
var closeIcon = document.getElementsByClassName('cancel-icon')[0];
var form = document.getElementById('create-node');
var nameField = document.querySelector('input[name="name"]');
var categoryField = document.getElementById('select-category');
var contentField = document.querySelector('textarea[name="content"]');
// get elements to fill total table
var activeNotesCountElements = document.getElementsByClassName('count-of-active-notes');
var archivedNotesCountElements = document.getElementsByClassName('count-of-archived-notes');
var noteCategoriesElements = {
    task: {
        active: activeNotesCountElements[0],
        archived: archivedNotesCountElements[0]
    },
    randomThought: {
        active: activeNotesCountElements[1],
        archived: archivedNotesCountElements[1]
    },
    idea: {
        active: activeNotesCountElements[2],
        archived: archivedNotesCountElements[2]
    },
    quote: {
        active: activeNotesCountElements[3],
        archived: archivedNotesCountElements[3]
    }
};
var openForm = false;
var archivedOpen = true;
var isEditing = false;
var currentEditNote = null;
createButton === null || createButton === void 0 ? void 0 : createButton.addEventListener('click', function () {
    openForm = showHideForm(form, openForm);
    setEmptyValuesToForm();
    nameField.focus();
});
archiveButton === null || archiveButton === void 0 ? void 0 : archiveButton.addEventListener('click', function () {
    list.textContent = '';
    if (archivedOpen) {
        archivedList.forEach(function (listItem) {
            addNewNoteItem(listItem, true);
        });
    }
    else {
        noteList.forEach(function (listItem) {
            addNewNoteItem(listItem);
        });
    }
    archivedOpen = !archivedOpen;
});
closeIcon === null || closeIcon === void 0 ? void 0 : closeIcon.addEventListener('click', function () {
    openForm = showHideForm(form, openForm);
    isEditing = false;
});
// handle submit
form.onsubmit = function (e) {
    e.preventDefault();
    var formData = new FormData(form);
    var name = formData.get('name');
    var category = formData.get('category');
    var content = formData.get('content');
    var currentNote = {
        id: Math.random().toString(16).slice(2),
        name: name,
        category: Category[category],
        createdAt: new Date(),
        content: content
    };
    noteList.push(currentNote);
    // add to total count
    noteCategories[category].active++;
    // add 1 active
    changeTotalView(category);
    addNewNoteItem(currentNote);
    // close form
    openForm = showHideForm(form, openForm);
};
(function () {
    noteList.forEach(function (listItem) {
        addNewNoteItem(listItem);
        // add to total count
        noteCategories[listItem.category].active++;
        // add 1 active
        changeTotalView(listItem.category);
    });
    Array.from(Object.keys(noteCategories)).forEach(function (category) {
        changeTotalView(category);
    });
})();
// utils depend on noteList and archiveList
function addNewNoteItem(note, archived) {
    var _a;
    if (archived === void 0) { archived = false; }
    if (isEditing) {
        (_a = currentEditNote === null || currentEditNote === void 0 ? void 0 : currentEditNote.currentElem) === null || _a === void 0 ? void 0 : _a.remove();
        noteList = noteList.filter(function (item) { return item.id !== (currentEditNote === null || currentEditNote === void 0 ? void 0 : currentEditNote.id); });
        noteCategories[currentEditNote.category].active--;
        changeTotalView(currentEditNote.category);
        isEditing = false;
        currentEditNote = null;
    }
    var id = note.id, name = note.name, category = note.category, createdAt = note.createdAt, content = note.content;
    var template = getListTemplate(id, name, category, createdAt, content, archived);
    list.insertAdjacentHTML('afterbegin', template);
    var currentElem = document.getElementById("uuid".concat(id));
    var deleteIcon = document.querySelector("#uuid".concat(id, " .trash-icon"));
    var editIcon = document.querySelector("#uuid".concat(id, " .edit-icon"));
    var archiveIcon = document.querySelector("#uuid".concat(id, " .archive-icon"));
    var unarchiveIcon = document.querySelector("#uuid".concat(id, " .unarchive-icon"));
    deleteIcon === null || deleteIcon === void 0 ? void 0 : deleteIcon.addEventListener('click', function () {
        currentElem.remove();
        // delete from total
        if (archived) {
            archivedList = archivedList.filter(function (item) { return item.id !== id; });
            noteCategories[category].archived--;
        }
        else {
            noteList = noteList.filter(function (item) { return item.id !== id; });
            noteCategories[category].active--;
        }
        changeTotalView(category);
    });
    editIcon === null || editIcon === void 0 ? void 0 : editIcon.addEventListener('click', function () {
        openForm = showHideForm(form, openForm);
        isEditing = true;
        currentEditNote = {
            currentElem: currentElem,
            category: category,
            id: id
        };
        setCurrentValuesToForm(note);
    });
    if (!archived) {
        archiveIcon === null || archiveIcon === void 0 ? void 0 : archiveIcon.addEventListener('click', function () {
            currentElem.remove();
            // remove from noteList
            noteList = noteList.filter(function (item) { return item.id !== id; });
            // push to the archivedList
            archivedList.push(note);
            // add to the total
            noteCategories[category].active--;
            noteCategories[category].archived++;
            changeTotalView(category);
        });
    }
    else {
        unarchiveIcon === null || unarchiveIcon === void 0 ? void 0 : unarchiveIcon.addEventListener('click', function () {
            currentElem.remove();
            // remove from archivedList
            archivedList = archivedList.filter(function (item) { return item.id !== id; });
            // push to the noteList
            noteList.push(note);
            // add to the total
            noteCategories[category].active++;
            noteCategories[category].archived--;
            changeTotalView(category);
        });
    }
    // scroll to top after adding
    list.scrollTop = 0;
}
function changeTotalView(category) {
    noteCategoriesElements[category].active.textContent = "".concat(noteCategories[category].active);
    noteCategoriesElements[category].archived.textContent = "".concat(noteCategories[category].archived);
}
function showHideForm(form, currentState) {
    form.style.display = currentState ? 'none' : 'flex';
    return !currentState;
}
function getListTemplate(id, name, category, createdAt, content, archived) {
    var _a;
    var dates = getDatesFromContent(content);
    var iconName = getIconName(category);
    var htmlListTemplate = "\n          <ul id=uuid".concat(id, " class=\"table__list-item notes-table__list-item\">\n              <li class=\"list-item__name\">\n                  <div class=\"list-item__icon\">\n                  <img src=\"/icons/").concat(iconName, ".png\" alt=\"cart-icon\" />\n                  </div>\n                  <p>").concat(truncate(name, 15), "</p>\n              </li>\n              <li>").concat(createdAt.toLocaleDateString(), "</li>\n              <li>").concat(category === Category.randomThought
        ? 'Random Thought'
        : ((_a = category[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + category.slice(1), "</li>\n              <li>").concat(truncate(content, 15), "</li>\n              <li>").concat(dates, "</li>\n              <li class=\"list-item__icons\">\n              ").concat(!archived
        ? '<img class="edit-icon" src="icons/edit.svg" alt="edit" />'
        : '', "\n                  <img class=\"").concat(archived ? 'un' : '', "archive-icon\" src=\"icons/archive.svg\" alt=\"archive\" />\n                  <img class=\"trash-icon\" src=\"icons/trash.svg\" alt=\"trash\" />\n              </li>\n          </ul>\n          ");
    return htmlListTemplate;
}
function setCurrentValuesToForm(currentNote) {
    var name = currentNote.name, category = currentNote.category, content = currentNote.content;
    nameField.value = name;
    categoryField.value = category;
    contentField.value = content;
}
function setEmptyValuesToForm() {
    nameField.value = '';
    categoryField.value = Category.task;
    contentField.value = '';
}
function getDatesFromContent(content) {
    var _a;
    var dates = content.match(/\d{1,2}([\/.-])\d{1,2}\1\d{2,4}/g);
    return truncate((_a = dates === null || dates === void 0 ? void 0 : dates.join(', ')) !== null && _a !== void 0 ? _a : '', 30);
}
function getIconName(category) {
    switch (category) {
        case Category.quote:
            return 'quote';
        case Category.randomThought:
            return 'mindset';
        case Category.task:
            return 'cart';
        case Category.idea:
            return 'bulb';
    }
}
function truncate(str, maxlength) {
    return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str;
}
