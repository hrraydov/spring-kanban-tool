const baseUrl = 'http://localhost:8080';

export const getBoards = async () => {
    const result = await fetch(baseUrl + '/boards', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    return json;
};

export const getBoard = async (board_id) => {
    const result = await fetch(baseUrl + '/boards/' + board_id, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    return json;
};

export const createBoard = async (data) => {
    const result = await fetch(baseUrl + '/boards', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    return json;
};

export const editBoard = async (id, data) => {
    const result = await fetch(baseUrl + `/boards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    return json;
};

export const deleteBoard = async (id) => {
    const result = await fetch(baseUrl + `/boards/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        }
    });
    const json = await result.json();
    return json;
};

export const getTasks = async (boardId) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    return json;
};

export const getTask = async (boardId, taskId) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    console.log(json);
    const queries = [];
    json.attachments.forEach(attachment => {
        queries.push(getAttachments(boardId, taskId, attachment.id));
    });
    const files = await Promise.all(queries);
    console.log(files);
    console.log(URL.createObjectURL(files[0]));
    return json;
};

export const createTask = async (boardId, data) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    });
    const json = await result.json();
    const queries = [];
    data.attachments.forEach(attachment => {
        queries.push(createAttachment(boardId, json.id, attachment));
    });
    await Promise.all(queries);
    return json;
};

export const editTask = async (boardId, taskId, data) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const json = await result.json();
    return json;
};

export const deleteTask = async (boardId, taskId) => {
    await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        }
    });
};

export const getAttachments = async (boardId, taskId, attachmentId) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}/attachments/${attachmentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        }
    });
    const blob = await result.blob();
    return blob;
};

export const createAttachment = async (boardId, taskId, data) => {
    const formData = new FormData();
    formData.append('file', data);
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}/attachments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
        body: formData
    });
    return await result.blob();
};

export const login = async (data) => {
    const result = await fetch(baseUrl + `/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const json = await result.json();
    if(result.status >= 400) {
        throw new Error(json.code);
    }
    return json;
};

export const register = async (data) => {
    const result = await fetch(baseUrl + `/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const json = await result.json();
    if(result.status >= 400) {
        throw new Error(json.code);
    }
    return json;
};

export const userInfo = async () => {
    const result = await fetch(baseUrl + `/auth/info`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
    });
    const json = await result.json();
    return json;
};

export const getUser = async (email) => {
    const result = await fetch(baseUrl + `/users?email=${email}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
    });
    const json = await result.json();
    return json;
};
