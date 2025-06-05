var bookMarkInput  = document.getElementById('bookMarkName');
var bookUrlInput = document.getElementById('bookMarkURL');
var tableContent = document.getElementById('tableContent');
var currentUpdateIndex = null; // Track which product we're updating
var updateBtn = document.getElementById("updateBtn");
var submitBtn = document.getElementById("submitBtn");
var requirementList = document.querySelectorAll(".requirement-list li");
var requirementList2 = document.querySelectorAll(".requirements-list li");
var siteNameWarn = document.getElementById("siteNameWarn");
var siteURLWarn = document.getElementById("siteURLWarn");
var bookMarks;
var cancelBtn = document.getElementById("cancelBtn");


if(localStorage.getItem('bookMarker') != null){
    bookMarks = JSON.parse(localStorage.getItem('bookMarker'));
    displaySites();
}else{
    bookMarks = [];
}

//regex
var nameRegex =  /^[A-Z][a-zA-Z0-9 _]{2,}$/;
var urlRegex = /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;


bookMarkInput.addEventListener("keyup", function(e) {
    // Validate against the nameRegex
    var isValid = nameRegex.test(e.target.value);
    var allRequirementsMet = true;
    
    // Update requirement list visuals
    requirementList.forEach((item, index) => {
      var requirementMet = false;
      
      if (index === 0) { // At least 3 characters length
        requirementMet = e.target.value.length >= 3;
      } 
      else if (index === 1) { // Starts with 1 uppercase letter (A...Z)
        requirementMet = /^[A-Z]/.test(e.target.value);
      }
      
      if (requirementMet) {
        item.classList.add("valid");
        item.firstElementChild.className = "fa-solid fa-check";
      } else {
        item.classList.remove("valid");
        item.firstElementChild.className = "fa-solid fa-circle";
        allRequirementsMet = false;
      }
    });
    
    // Show/hide warning box and add/remove validation classes
    if (isValid && allRequirementsMet) {
      siteNameWarn.classList.add("d-none");
      bookMarkInput.classList.add("is-valid");
      bookMarkInput.classList.remove("is-invalid");
    } else {
      siteNameWarn.classList.remove("d-none");
      bookMarkInput.classList.add("is-invalid");
      bookMarkInput.classList.remove("is-valid");
    }
  });
bookUrlInput.addEventListener("keyup", function(e) {
    var value = e.target.value.trim();
    var isValid = urlRegex.test(value);
    var hasTLD = /\.([a-z]{2,})$/i.test(value); // Must have domain extension
    var allRequirementsMet = true; // Initialize as true
    
    // Update requirement list visuals
    requirementList2.forEach((item, index) => {
        var requirementMet = false;
        
        if (index === 0) { // At least 3 characters
            requirementMet = value.length >= 3;
        } 
        else if (index === 1) { // Proper URL format with TLD
            requirementMet = isValid && hasTLD;
        }
        
        // Update requirement item UI
        item.classList.toggle("valid", requirementMet);
        item.firstElementChild.className = requirementMet ? "fa-solid fa-check" : "fa-solid fa-circle";
        
        if (!requirementMet) {
            allRequirementsMet = false;
        }
    });
    
    // Final validation - must meet all requirements
    var finalIsValid = isValid && hasTLD && allRequirementsMet;
    
    // Update input field UI - Force add/remove classes
    if (finalIsValid) {
        bookUrlInput.classList.add("is-valid");
        bookUrlInput.classList.remove("is-invalid");
        siteURLWarn.classList.add("d-none");
    } else {
        bookUrlInput.classList.add("is-invalid");
        bookUrlInput.classList.remove("is-valid");
        siteURLWarn.classList.remove("d-none");
    }
});
function addBookMark(){
    if (
        bookMarkInput.value == null ||
        bookMarkInput.value == "" ||
        bookUrlInput.value == null ||
        bookUrlInput.value == ""
    ) {
        alert("Please make Sure you did fill up all fields ");
        return;
    }
    
    // Check if inputs are valid
    if (!nameRegex.test(bookMarkInput.value) || !urlRegex.test(bookUrlInput.value)) {
        alert("Please make sure all fields meet the requirements");
        return;
    }
    var siteObj = {
        name: bookMarkInput.value,
        url: bookUrlInput.value
    };

    bookMarks.push(siteObj);
    localStorage.setItem('bookMarker',JSON.stringify(bookMarks));
    clearInputs();
    displaySites();

}

// clear inputs function
function clearInputs(){
    bookMarkInput.value = '';
    bookUrlInput.value = '';
    bookMarkInput.classList.remove('is-valid', 'is-invalid');
    bookUrlInput.classList.remove('is-valid', 'is-invalid');
    siteNameWarn.classList.add('d-none');
    siteURLWarn.classList.add('d-none');
    
    // Reset requirement indicators
    requirementList.forEach(item => {
        item.classList.remove('valid');
        item.firstElementChild.className = 'fa-solid fa-circle';
    });
    requirementList2.forEach(item => {
        item.classList.remove('valid');
        item.firstElementChild.className = 'fa-solid fa-circle';
    });
}

// display all bookmarks function
function displaySites(){
    var box = ``;
    for( var i = 0; i < bookMarks.length ; i++){
        box += `    <tr>
              <td>${bookMarks[i].name}</td>
              <td>${bookMarks[i].url}</td>
              <td>
                <button class="btn btn-visit" onclick="visitWebsite(${i})">
                <i class="fa-solid fa-eye  pe-2"></i>Visit
              </button>
              </td>
              <td>
              <button class="btn btn-delete pe-2" onclick="deleteMark(${i})">
              <i class="fa-solid fa-trash-can "></i>
              Delete
            </button>
            <button class="btn btn-update btn-update2 pe-2" onclick="prepareDataForUpdate(${i})">
            <i class="fa-solid fa-pen-to-square "></i>
            Update
          </button>
              </td>
              
            </tr>`;
          }

tableContent.innerHTML = box;
}
// delete the specified bookmark function
function deleteMark(deleteIndex){
    bookMarks.splice(deleteIndex, 1);
    localStorage.setItem('bookMarker', JSON.stringify(bookMarks));
    displaySites();

}

// prepare data from specified bookmark function
function prepareDataForUpdate(updateIndex){
    currentUpdateIndex = updateIndex;
    var site = bookMarks[updateIndex];

    bookMarkInput.value = site.name;
    bookUrlInput.value = site.url;

    //toggle buttons
    submitBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
    cancelBtn.classList.remove('d-none');
}

// update when click on update button function
function sendUpdatedData(){
    if (currentUpdateIndex === null) return;
    
    // Check if inputs are valid
    if (!nameRegex.test(bookMarkInput.value) || !urlRegex.test(bookUrlInput.value)) {
        alert("Please make sure all fields meet the requirements");
        return;
    }
    bookMarks[currentUpdateIndex] ={
        name: bookMarkInput.value,
        url: bookUrlInput.value
    }

    localStorage.setItem('bookMarker', JSON.stringify(bookMarks));
    clearInputs();
    displaySites();
      // Reset buttons
      submitBtn.classList.remove('d-none');
      updateBtn.classList.add('d-none');
      cancelBtn.classList.add('d-none');
      currentUpdateIndex = null;
}

// search about name of bookmark function
function search(search) {
    var query = ``;
    for (let i = 0; i < bookMarks.length; i++) {
      if (bookMarks[i].name.toLowerCase().includes(search.toLowerCase())) {
        query += `
        <tr>
        <td>${bookMarks[i].name.replace(
          new RegExp(search, "ig"),
          "<span>" + search + "</span>"
        )}</td>
        <td>${bookMarks[i].url}</td>
        <td>
          <button class="btn btn-visit" onclick="visitWebsite(${i})">
          <i class="fa-solid fa-eye  pe-2"></i>Visit
        </button>
        </td>
        <td>
        <button class="btn btn-delete pe-2" onclick="deleteMark(${i})">
        <i class="fa-solid fa-trash-can "></i>
        Delete
      </button>
      <button class="btn btn-update btn-update2 pe-2" onclick="prepareDataForUpdate(${i})">
      <i class="fa-solid fa-pen-to-square "></i>
      Update
    </button>
        </td>
        
      </tr>
        `;
      }
    }
    tableContent.innerHTML = query;
  }

// cancel when there is no update function
function cancelUpdate() {
    clearInputs();
    submitBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');
    currentUpdateIndex = null;
}
cancelBtn.addEventListener('click', cancelUpdate);

// visit button function
function visitWebsite(index) {
    // Get the URL from bookmarks
    let url = bookMarks[index].url;
    
    // Add https:// if not present
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    
    // Open in new tab
    window.open(url, '_blank');
}