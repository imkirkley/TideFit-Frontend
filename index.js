const url = 'https://localhost:5000/api/activity'

const render = () => 
{
    console.log('test')
    getActivities()
}

const getActivities = function() 
{
    fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        populateTable(data); 
    })


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
    myActivities.forEach(function(activity, index) {
        if(!activity.deleted){
            html += `<tbody>
            <tr>
          <th scope="row">${activity.activityType}</th>
          <td>${activity.distance}</td>
          <td>${activity.dateCompleted}</td>
          <td><input type="checkbox" ${activity.pin ? 'checked' : ''} onchange=handlePinStatus(${myActivities}, ${index})></td>
          <td><button onclick=handleDelete(${myActivities}, ${index})>Delete</button></td>
            </tbody>` }
    
    });        
    html += `</table>`
    //pushes html to frontend 
    document.getElementById('maintable').innerHTML=html
}

//handles deleting by changing the "deleted" var
async function handleDelete (myActivities, index) {
    const exerciseID = myActivities[index].exerciseID;

    await fetch(`${url}/${exerciseID}`, {
        method: 'DELETE',
        body: JSON.stringify(myActivities[index]),
        headers: {
            accept: "*/*",
            "content-type": "application/json"
        }
        })

    render()
}

//handles whether to pin an activity to the top of the table
async function handlePinStatus (myActivities, index) {
    myActivities[index].pin = !myActivities[index].pin
    const exerciseID = myActivities[index].exerciseID

    await fetch(`${url}/${exerciseID}`, {
        method: 'PUT',
        body: JSON.stringify(myActivities[index]),
        headers: {
            accept: "*/*",
            "content-type": "application/json"
        }
        })

    render()
}

{
// Grabs the modal and buttons
    const modal = document.getElementById('myModal')
    const openModalBtn = document.getElementById('openFormBtn')
    const closeModalBtn = document.getElementById('closeModal')

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
async function handleModalSubmission(){
    //user input
    const activityType = document.getElementById('activityType').value
    const distance = document.getElementById('distance').value
    const dateCompleted = document.getElementById('dateCompleted').value
    const pin = document.getElementById('pin').checked
    
    //handle data
    let activity = {exerciseID: exerciseID, activityType: activityType, distance: distance, dateCompleted:dateCompleted, pin:pin, deleted:false }
    await fetch(url, {
        method: "POST",
        headers: {
            accept: "*/*",
            "content-type": "application/json",
        },
        body: JSON.stringify(activity),
    })
    render();

    //close modal and erases data submission form
    document.getElementById('activityType').value= ''
    document.getElementById('distance').value = ''
    document.getElementById('dateCompleted').value = ''
    document.getElementById('pin').checked = false
    modal.style.display = 'none'
    };
}