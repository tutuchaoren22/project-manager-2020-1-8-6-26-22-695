const API_ROOT = "http://localhost:3000/projects";

let confirmPage = document.getElementsByClassName("confirm-page")[0];
let deleteId;
let newData;

function getListData() {
    let options = {
        url: API_ROOT,
        method: "GET",
        success: function(res) {
            updatePage(res);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    };
    ajax(options);
}

function updatePage(data) {
    newData = data;
    renderUserList(data);
    changeStatus();
    let taskCount = calculateNumber(data);
    changeNumber(taskCount);
}

function renderUserList(data) {
    if (!Array.isArray(data) && !data instanceof Array) {
        return false;
    }
    let itemList = document.getElementsByClassName('item-list')[0];
    itemList.innerHTML = data.reduce((acc, cur) => {
        return acc += `<tr dataid='${cur.id}'>
                  <td>${cur.name}</td>
                  <td ><div class="description">${cur.description}</div></td>
                  <td>${cur.endTime}</td>
                  <td class='status'>${cur.status}</td>
                  <td><button class='delete-button'>删除</button></td>
              </tr>`;
    }, '');
}

function changeStatus() {
    let status = document.getElementsByClassName('status');
    for (let i = 0; i < status.length; i++) {
        switch (status[i].innerHTML) {
            case 'ACTIVE':
                status[i].style.color = '#666666';
                break;
            case 'PENDING':
                status[i].style.color = '#ee706d';
                break;
            case 'CLOSED':
                status[i].style.color = '#f7da47';
                break;
        }
    }

}

function calculateNumber(data) {
    let activeCount = 0;
    let pendingCount = 0;
    let closedCount = 0;
    data.forEach(task => {
        switch (task.status) {
            case 'ACTIVE':
                activeCount += 1;
                break;
            case 'PENDING':
                pendingCount += 1;
                break;
            case 'CLOSED':
                closedCount += 1;
                break;
        }

    });
    let allCount = activeCount + pendingCount + closedCount;
    let taskCount = [allCount, activeCount, pendingCount, closedCount];
    return taskCount;
}


function changeNumber(taskCount) {
    let cardNumbers = document.getElementsByClassName('card-number');
    taskCount.forEach(
        (count, index) => {
            if (index === 0) {
                cardNumbers[index].innerHTML = `<span class="number">${count}</span>`;
            } else {
                cardNumbers[index].innerHTML = `<span class="number">${count}</span>
                    <span class="percent">${taskCount[0]===0 ? 0 : Math.round((count / taskCount[0]) * 100)}% </span>`; //
            }
        }

    )
}


function clickEvent(event) {
    let eventTarget = event.target;
    switch (eventTarget.className) {
        case 'delete-button':
            deleteId = eventTarget.parentElement.parentElement.getAttribute('dataid');
            deleteConfirmPage();
            break;
        case 'icon-cancle':
            canclePage();
            break;
        case 'confirm':
            deleteItemData(deleteId);
            newData = newData.filter(item => {
                return item.id != deleteId;
            });
            changeNumber(calculateNumber(newData));
            canclePage();
            break;
        case 'cancel':
            canclePage();
            break;
        default:
            break;
    }
}


function deleteConfirmPage() {
    confirmPage.style.display = "block";
}

function canclePage() {
    confirmPage.style.display = "none";
}

function deleteItem(id) {
    let itemList = document.getElementsByClassName('item-list')[0];
    let item = document.querySelector(`tr[dataid='${id}']`);
    itemList.removeChild(item);
}

function deleteItemData(id) {
    let options = {
        url: API_ROOT + "/" + id,
        method: "DELETE",
        success: function(res) {
            deleteItem(id);
        },
        fail: function(error) {
            console.log('ERROR');
        }
    };
    ajax(options);
}

getListData();