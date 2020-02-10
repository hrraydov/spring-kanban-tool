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
    await fetch(baseUrl + `/boards/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        }
    });
};

export const getTasksAssignedToUser = async (userId) => {
    const boards = await getBoards();
    const results = [];
    for (const boardIndex in boards) {
        const board = boards[boardIndex];
        const res = await fetch(baseUrl + `/boards/${board.id}/tasks?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();
        results.push(...json.map(task => ({
            ...task,
            boardId: board.id
        })));
    }
    return results;
}

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
    const queries = [];
    json.attachments.forEach(attachment => {
        queries.push(getAttachments(boardId, taskId, attachment.id));
    });
    const attachments = await Promise.all(queries);
    json.attachments.forEach(att => {
        att['blob'] = attachments.find(x => x.id === att.id).blob;
    });
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
        queries.push(createAttachment(boardId, json.id, attachment.blob));
    });
    await Promise.all(queries);
    return json;
};

export const editTask = async (boardId, taskId, data) => {
    const oldResult = await getTask(boardId, taskId);
    const oldAttachments = oldResult.attachments;
    const newAttachments = data.attachments;
    await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    const difference = oldAttachments.filter(x => !newAttachments.some(na => na.name === x.name)).concat(newAttachments.filter(x => !oldAttachments.some(na => na.name === x.name)));
    const queries = [];
    difference.forEach(attachment => {
        if (oldAttachments.some(oa => oa.name === attachment.name)) {
            //queries.push(removeRoleFromRoleGroup(groupId, id));
        } else {
            queries.push(createAttachment(boardId, taskId, attachment.blob));
        }
    });
    await Promise.all(queries);
    //const json = await result.json();
    //return json;
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
    return {
        id: attachmentId,
        blob
    };
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
    if (result.status >= 400) {
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
    if (result.status >= 400) {
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

export const getTaskHistory = async (boardId, taskId, type) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}/history?type=${type}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
    });
    const json = await result.json();
    return json;
};

export const getTaskStatistic = async (boardId, taskId, type) => {
    const result = await fetch(baseUrl + `/boards/${boardId}/tasks/${taskId}/history/stats?type=${type}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
    });
    const json = await result.json();
    return json;
};
