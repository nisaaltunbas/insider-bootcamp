$(document).ready(function () {
  let start = 0,
    limit = 10,
    loading = false;

  function loadPosts() {
    if (loading) return;
    loading = true;

    $('#loading').show();
    $('#error').hide();

    setTimeout(fetchPosts, 1000);
  }

  function fetchPosts() {
    $.get(
      `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`
    )
      .done(renderPosts)
      .fail(() => $('#error').show())
      .always(() => {
        loading = false;
        $('#loading').hide();
      });
  }

  function renderPosts(data) {
    data.forEach((post) => {
      $('#postContainer').append(`
        <div class="post">
          <h3>${post.title}</h3>
          <p>${post.body}</p>
        </div>
      `);
    });
    start += limit;
  }

  function checkScroll() {
    if (
      $(window).scrollTop() + $(window).height() >=
      $(document).height() - 100
    ) {
      loadPosts();
    }
  }

  loadPosts();
  $(window).on('scroll', checkScroll);
});
