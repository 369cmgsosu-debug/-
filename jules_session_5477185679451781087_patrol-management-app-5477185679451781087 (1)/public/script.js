let currentPatrolId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchPatrols();
    fetchAlerts();

    document.getElementById('patrol-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('patrol-name').value;
        const date = document.getElementById('patrol-date').value;
        await fetch('/api/patrols', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, date })
        });
        document.getElementById('patrol-name').value = '';
        document.getElementById('patrol-date').value = '';
        fetchPatrols();
    });

    document.getElementById('issue-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = document.getElementById('issue-description').value;
        const person_in_charge = document.getElementById('issue-pic').value;
        await fetch(`/api/patrols/${currentPatrolId}/issues`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, person_in_charge })
        });
        document.getElementById('issue-description').value = '';
        document.getElementById('issue-pic').value = '';
        fetchIssues(currentPatrolId);
        fetchAlerts();
    });
});

async function fetchPatrols() {
    const response = await fetch('/api/patrols');
    const patrols = await response.json();
    const list = document.getElementById('patrol-list');
    list.innerHTML = '';
    patrols.forEach(patrol => {
        const li = document.createElement('li');
        
        const info = document.createElement('span');
        info.textContent = `${patrol.name} (${patrol.date})`;
        
        const btn = document.createElement('button');
        btn.textContent = 'View Issues';
        btn.onclick = () => selectPatrol(patrol.id, patrol.name);
        
        li.appendChild(info);
        li.appendChild(btn);
        list.appendChild(li);
    });
}

async function fetchAlerts() {
    const response = await fetch('/api/alerts');
    const alerts = await response.json();
    const list = document.getElementById('alert-list');
    list.innerHTML = '';
    alerts.forEach(alert => {
        const li = document.createElement('li');
        li.className = 'issue-item';
        
        const desc = document.createElement('strong');
        desc.textContent = alert.description;
        
        const pic = document.createElement('span');
        pic.textContent = `Assigned to: ${alert.person_in_charge}`;
        
        const status = document.createElement('span');
        status.className = `status-${alert.status.replace(' ', '-')}`;
        status.textContent = `Status: ${alert.status}`;
        
        li.appendChild(desc);
        li.appendChild(pic);
        li.appendChild(status);
        list.appendChild(li);
    });
}

async function selectPatrol(id, name) {
    currentPatrolId = id;
    document.getElementById('current-patrol-title').textContent = `Issues for Patrol: ${name}`;
    document.getElementById('issue-section').style.display = 'block';
    fetchIssues(id);
}

async function fetchIssues(patrolId) {
    const response = await fetch(`/api/patrols/${patrolId}/issues`);
    const issues = await response.json();
    const list = document.getElementById('issue-list');
    list.innerHTML = '';
    issues.forEach(issue => {
        const li = document.createElement('li');
        li.className = 'issue-item';
        
        const divInfo = document.createElement('div');
        const desc = document.createElement('strong');
        desc.textContent = issue.description;
        const pic = document.createElement('span');
        pic.textContent = `Assigned to: ${issue.person_in_charge}`;
        const statusSpan = document.createElement('span');
        statusSpan.className = `status-${issue.status.replace(' ', '-')}`;
        statusSpan.textContent = `Status: ${issue.status}`;
        
        divInfo.appendChild(desc);
        divInfo.appendChild(document.createElement('br'));
        divInfo.appendChild(pic);
        divInfo.appendChild(document.createElement('br'));
        divInfo.appendChild(statusSpan);
        
        const divActions = document.createElement('div');
        divActions.className = 'issue-actions';
        
        const select = document.createElement('select');
        ['open', 'in progress', 'done'].forEach(optVal => {
            const opt = document.createElement('option');
            opt.value = optVal;
            opt.textContent = optVal.charAt(0).toUpperCase() + optVal.slice(1);
            if (issue.status === optVal) opt.selected = true;
            select.appendChild(opt);
        });
        select.onchange = () => updateIssueStatus(issue.id, select.value);
        
        const inputPic = document.createElement('input');
        inputPic.type = 'text';
        inputPic.placeholder = 'Change PIC';
        inputPic.onchange = () => updateIssuePIC(issue.id, inputPic.value);
        
        divActions.appendChild(select);
        divActions.appendChild(inputPic);
        
        li.appendChild(divInfo);
        li.appendChild(divActions);
        list.appendChild(li);
    });
}

async function updateIssueStatus(id, status) {
    await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (currentPatrolId) fetchIssues(currentPatrolId);
    fetchAlerts();
}

async function updateIssuePIC(id, person_in_charge) {
    if (!person_in_charge) return;
    await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_in_charge })
    });
    if (currentPatrolId) fetchIssues(currentPatrolId);
    fetchAlerts();
}
