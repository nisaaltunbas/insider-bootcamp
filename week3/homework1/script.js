const studentData = [
  { name: 'James', class: '11C' },
  { name: 'Rose', class: '9A' },
  { name: 'Peter', class: '12B' },
];

function updateTable() {
  const tableBody = $('#studentTable tbody');
  tableBody.empty();
  studentData.forEach((student, index) => {
    tableBody.append(
      `
            <tr data-index = "${index}">
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td><button class='deleteBtn'>Delete</button></td>
            </tr>
            `
    );
  });
}

$('#addStudent').click(function (e) {
  event.preventDefault();

  const name = $('#studentName').val();
  const studentClass = $('#studentClass').val();

  if (name && studentClass) {
    studentData.push({ name, class: studentClass });
    $('#studentName').val('');
    $('#studentClass').val('');
    updateTable();
  } else {
    alert('Please fill all fields!');
  }
});

$(document).on('click', '.deleteBtn', function () {
  const row = $(this).closest('tr').data('index');
  studentData.splice(row, 1);
  updateTable();
});

$(document).on('click', '#studentData tbody tr', function () {
  $(this).toggleClass('highlight');
});

$(document).on('dblclick', '#studentTable tbody tr td', function () {
  var $row = $(this).closest('tr');
  $row.css('background-color', 'yellow');
  setTimeout(() => {
    row.css('background-color', '');
  }, 1000);
});
updateTable();
