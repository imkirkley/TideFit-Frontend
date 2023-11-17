const url = 'http://localhost:5000/api/activity'

let myActivities = []

const render = () => 
{
    getActivities()
}

const getActivities = async function() 
{
    const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    myActivities = await response.json()
    populateTable(myActivities); 

}

function populateTable(myActivities) {
    //sorts by pin status and date, then gives descending order based on pin then date
    myActivities.sort((a, b) => {
        if (a.pin !== b.pin) {
          return b.pin ? 1 : -1;
        } else {
          return new Date(b.dateCompleted) - new Date(a.dateCompleted);
        }
      });
    //html for table and updating the table
    let html = `
    <table class="table table-sm">
    <thead>
    <tr>
        <th scope="col">Activity Type</th>
        <th scope="col">Distance</th>
        <th scope="col">Date Completed</th>
        <th scope="col">Pin/Unpin</th>
        <th scope="col">Delete</th>
    </tr>
    </thead>`;
   
    myActivities.forEach(function(activity) {
        if(!activity.deleted){
            html += `<tbody>
            <tr>
          <th scope="row">${activity.activityType}</th>
          <td>${activity.distance}</td>
          <td>${activity.dateCompleted}</td>
          <td><input type="checkbox" ${activity.pin ? 'checked' : ''} onchange="handlePinStatus('${activity.id}')"></td>
          <td><button onclick="handleDelete('${activity.id}')">Delete</button></td>
            </tbody>` }
    
    });        
    html += `</table>`
    //pushes html to frontend 
    document.getElementById('maintable').innerHTML=html
}

//handles deleting by changing the "deleted" var
async function handleDelete (activityID) {
    const exerciseID = activityID;
    await fetch(`${url}/${exerciseID}`, {
        method: 'DELETE',
        headers: {
            accept: "*/*",
            "content-type": "application/json"
        }
        })

    render()

}

//handles whether to pin an activity to the top of the table
async function handlePinStatus (id) {
    const activity = myActivities.find(act => act.id === id)
    const findId= activity.id
    const changedActivity = {
                      id: activity.id, 
                      ActivityType: activity.ActivityType, 
                      Distance: activity.Distance, 
                      DateCompleted: activity.dateCompleted, 
                      Pin: !activity.pin, 
                      Deleted:activity.deleted,
    }
    
    await fetch(`${url}/${findId}`, {
        method: 'PUT',
        body: JSON.stringify(changedActivity),
        headers: {
            accept: "*/*",
            "content-type": "application/json"
        }
        })

    render()
}


// Grabs the modal and buttons
    const modal = document.getElementById('myModal')
    const openModalBtn = document.getElementById('openFormBtn')
    const closeModalBtn = document.getElementById('closeModal')
    document.getElementById('activityForm').addEventListener('submit', handleModalSubmission);

// Opens modal when the button is clicked
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block'
    });

// Closes modal when the close button is clicked
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none'
    });

// Closes modal when the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none'
    }
    });

// Handle form submission
async function handleModalSubmission(event){
    event.preventDefault()
    //user input
    const activityType = document.getElementById('activityType').value
    const distance = document.getElementById('distance').value
    const dateCompleted = document.getElementById('dateCompleted').value
    const pin = document.getElementById('pin').checked
    
    //handle data
    const activity = {ActivityType: activityType, Distance: distance, DateCompleted: dateCompleted, Pin:pin, Deleted:false }
    const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(activity),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Re-render the table or UI
        render();

    //close modal and erases data submission form
    document.getElementById('activityType').value= ''
    document.getElementById('distance').value = ''
    document.getElementById('dateCompleted').value = ''
    document.getElementById('pin').checked = false
    modal.style.display = 'none'
    };
