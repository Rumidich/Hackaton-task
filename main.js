
const API = "http://localhost:8001/students";

// getting necessary elements to add
let inpName = document.getElementById("inp-name");
let inpSurname = document.getElementById("inp-surname");
let inpPhone = document.getElementById("inp-phone");
let inpWeeklyKPI = document.getElementById('inp-week');
let inpMonthlyKPI = document.getElementById('inp-month');
let btnSubmit = document.getElementById("btn-submit");

// attached an event to save button
btnSubmit.addEventListener("click", async function () {
  let studentsList = {
    name: inpName.value,
    surname: inpSurname.value,
    phone: inpPhone.value,
    weeklyKPI:  inpWeeklyKPI.value,
    monthlyKPI: inpMonthlyKPI.value
  };
  // console.log(phoneBook);
  if (!inpName.value || !inpSurname.value || !inpPhone.value || !inpWeeklyKPI.value || !inpMonthlyKPI.value) {
    alert("Please fill all the requested fileds in");
    return;
  }
  // add request
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(studentsList),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  // Clearing all inputs after new data insertion
  inpName.value = "";
  inpSurname.value = "";
  inpPhone.value = "";
  inpWeeklyKPI.value = "";
  inpMonthlyKPI.value = "";
  getStudentsInfo();
});
//! SEARCH
let inpSearch = document.getElementById("inp-search");

inpSearch.addEventListener("input", function () {
  getStudentsInfo();
});

//!PAGINATION
let pagination = document.getElementById("pagination");
let page = 1;
// getting an element to display all contacts
let list = document.getElementById("list");

async function getStudentsInfo() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=4`
  )
    .then(res => res.json())
    .catch(err => console.log(err));

  let allContacts = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));

  let lastPage = Math.ceil(allContacts.length / 4);
  list.innerHTML = ""; // clearing div#list

  response.forEach(item => {
    let newElem = document.createElement('div');
    newElem.setAttribute('id', 'example', 'class', 'table table-striped')
    newElem.style.width = '100%'
    newElem.id = item.id;
    newElem.innerHTML = `
    <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Surname</th>
        <th>Phone</th>
        <th>Weekly KPI</th>
        <th>Monthly KPI</th>
      </tr>
    </thead>
      <tbody>
        <tr>
          <td>${item.name} </td>
          <td>${item.surname} </td>
          <td>${item.phone} </td>
          <td>${item.weeklyKPI} </td>
          <td>${item.monthlyKPI} </td>
        </tr>
      <tbody>
    </table>

      <button style="padding: 10px 20px; background-color: #3308f37c; border: none; border-radius: 20px" class="btn-delete">Delete</button>
      <button class="btn-edit">Edit</button>`;

    list.append(newElem);
  });

  // adding pagination
 pagination.innerHTML = `
<button id="btn-prev" style="padding: 10px 20px; background-color: #3308f37c; border: none; border-radius: 20px"  ${page === 1 ? "disabled": ""}>Prev</button>
<span>${page}</span>
<button style="padding: 10px 20px; background-color: #3308f37c; border: none; border-radius: 20px" ${page === lastPage ? "disabled" : ""} id="btn-next">Next</button>
`;
}
getStudentsInfo();

// Modal window elements for editing
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditName = document.getElementById("inp-edit-name");
let inpEditSurname = document.getElementById("inp-edit-surname");
let inpEditPhone = document.getElementById("inp-edit-phone");
let inpEditWeeklyKPI = document.getElementById("inp-edit-weeklyKPI");
let inpEditMonthlyKPI = document.getElementById("inp-edit-monthlyKPI");
let inpEditId = document.getElementById("inp-edit-id");
let btnSaveEdit = document.getElementById("btn-save-edit");

// console.log(inpEditName, inpEditSurname, inpEditPhone, inpeditId);

// Function for Modal Window closing
modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});
// Function for edited info saving
btnSaveEdit.addEventListener("click", async function () {
  let EditedContacts = {
    name: inpEditName.value,
    surname: inpEditSurname.value,
    phone: inpEditPhone.value,
    weeklyKPI: inpEditWeeklyKPI.value,
    monthlyKPI: inpEditMonthlyKPI.value,
  };
  let id = inpEditId.value;
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(EditedContacts),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  modalEdit.style.display = "none";
  getStudentsInfo();
});

document.addEventListener("click", async function (e) {
  //! Deletion of contact
  if (e.target.className === "btn-delete") {
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getStudentsInfo();
  }
  //! UPDATE (EDIT) Contact
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    inpEditName.value = response.name;
    inpEditSurname.value = response.surname;
    inpEditPhone.value = response.phone;
    inpEditId.value = response.id;
    inpEditWeeklyKPI.value = response.weeklyKPI;
    inpEditMonthlyKPI.value = response.monthlyKPI;
  }
  //! Pagination
  if (e.target.id === "btn-next") {
    page++;
    getStudentsInfo();
  }
  if (e.target.id === "btn-prev") {
    page--;
    getStudentsInfo();
  }
});