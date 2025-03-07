$(document).ready(function () {
  $('#load-users').click(function () {
    $.ajax({
      url: 'https://randomuser.me/api/?results=8',
      method: 'GET',
      success: function (response) {
        const users = response.results;
        $('#user-cards-container').empty();

        users.forEach((user) => {
          const userCard = `
                      <div class="user-card">
                          <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" />
                          <div class="user-card-info">
                              <h3>${user.name.first} ${user.name.last}</h3>
                              <p>Email: ${user.email}</p>
                              <p>Country: ${user.location.country}</p>
                          </div>
                      </div>
                  `;

          $('#user-cards-container').append(userCard);
        });

        $('.user-card').on('click', function () {
          $(this).toggleClass('active');
        });

        $('.user-card').on('click', function () {
          const card = $(this);
          const imgSrc = card.find('img').attr('src');
          const fullName = card.find('h3').text();
          const email = card.find('p').first().text().replace('Email: ', '');
          const country = card.find('p').last().text().replace('Country: ', '');

          $('#user-image').attr('src', imgSrc);
          $('#user-fullname').text(fullName);
          $('#user-email').text(email);
          $('#user-country').text(country);

          $.fancybox.open({
            src: '#user-detail-modal',
            type: 'inline',
          });
        });
      },
      error: function () {
        alert('Error occurred!');
      },
    });
  });
});
