import axios from '../axios';

export const getToken = (email, password) => {
    return axios.post('/api/token/', {
        email,
        password
    })
}

export const removeToken = () => {
    return true
}

export const getRefresh = () => {
    return axios.post('/api/token/refresh/', {
        refresh: window.localStorage.getItem("refreshToken")
    })
}

export const register = (email, password, data) => {
    return axios.post('/api/users/', {
        email: email,
        password: password,
        data: data
    })
}

export const getTeamsByUser = () => {
    return axios.get('/api/teams/')
}

export const createTeam = (name, description) => {
    return axios.post('/api/teams/', {
        name: name,
        description: description,
    })
}

export const getProjects = (id) => {
    return axios.get('/api/teams/' + id + '/')
}

export const getProjectsByUser = () => {
    return axios.get('/api/user-projects/')
}

export const getSingleProject = (id) => {
    return axios.get('/api/projects/' + id + '/')
}

export const createProject = (name, description, image) => {
    return axios.post('/api/projects/', {
        name: name,
        description: description,
        image: image
    })
}

export const inviteUser = (email, data) => {
    return axios.post('/api/email-invitations/', {
        email: email,
        data: data
    })
}

export const getInvitedUser = (guid) => {
    return axios.get('/api/email-invitations/' + guid + '/')
}

export const resetPass = (email) => {
    return axios.post('/api/password-reset/', {
        email:email
    })
}

export const getResetPassForUser = (guid) => {
    return axios.get('/api/password-reset/'+ guid + '/')
}

export const destroyResetAndUpdatePass = (guid, password, data) => {
    return axios.put('/api/password-reset/'+ guid +'/',{
        guid: guid,
        password: password,
        data: data
    })
}

export const getProjectSections = (id) => {
    return axios.get('/api/project-sections/' + id + '/')
}

export const getSectionCategories = (id) => {
    return axios.get('api/section-categories/' + id + '/')
}

export const getCategoryElements = (id) => {
    return axios.get('api/category-elements/' + id + '/')
}

export const createSection = (name, description, project) => {
    return axios.post('/api/sections/', {
        name: name,
        description: description,
        project: project
    })
}

export const createCategory = (name, description, section) => {
    return axios.post('/api/categories/', {
        name: name,
        description: description,
        section: section
    })
}

export const createElement = (title, description, category) => {
    return axios.post('/api/elements/', {
        title: title,
        description: description,
        category: category
    })
}

export const elementCategoryChange = (element, categoryId, newOrder) => {
    console.log("ID elementa",element.id)
    return axios.put ('/api/category-elements/'+element.id+'/', {
        element: element,
        category_id: categoryId,
        newOrder: newOrder
    })
}

export const createItem = (content, type, element) => {
    return axios.post("api/items/", {
        content: content,
        type: type,
        element: element
    })
}

export const reorderElementsForCategory = (arrayElements, catId) => {
    return axios.put("api/reorder-elements/" + catId + "/", {
        order: arrayElements
    })
}

export const reorderItemsForElement = (arrayItems, eleId) => {
    return axios.put("api/reorder-items/" + eleId + "/", {
        order: arrayItems
    })
}

export const itemElementChange = (item, elementId, newOrder, column) => {
    return axios.put('api/element-items/' + item.id + '/', {
        element_id: elementId,
        newOrder: newOrder,
        column: column
    })
}

export const updateItem = (id, content) => {
  return axios.patch('api/items/' + id + '/', {
    content: content
  })
}

export const updateElement = (id, title, description) => {
  return axios.patch('api/elements/' + id + '/', {
    title: title,
    description: description
  })
}

export const updateCategory = (id, name, description) => {
  return axios.patch('api/categories/' + id + '/', {
    name: name,
    description: description
  })
}

export const updateSection = (id, name, description) => {
  return axios.patch('api/sections/' + id + '/', {
    name: name,
    description: description
  })
}

export const updateProject = (id, name, description, data) => {
  return axios.pach('api/projects/' + id + '/', {
    name: name,
    description: description,
    data: data
  })
}

export const deleteItem = (id) => {
  return axios.delete('api/items/' + id + '/')
}

export const deleteElement = (id) => {
  return axios.delete('api/elements/' + id + '/')
}

export const deleteCategory = (id) => {
  return axios.delete('api/categories/' + id + '/')
}

export const deleteSection = (id) => {
  return axios.delete('api/sections/' + id + '/')
}

export const deleteProject = (id) => {
  return axios.delete('api/projects/' + id + '/')
}
