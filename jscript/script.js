$(function () {
    const FINNKINO_API_URL = 'https://www.finnkino.fi/xml/Schedule/';
    const THEATRES_API_URL = 'https://www.finnkino.fi/xml/TheatreAreas/';

    // Hakee teatterit
    function fetchTheaters() {
        $.ajax({
            url: THEATRES_API_URL,
            method: 'GET',
            success: function (response) {
                const theaters = $(response).find('TheatreArea');
                theaters.each(function () {
                    const id = $(this).find('ID').text();
                    const name = $(this).find('Name').text();
                    $('#theaterSelect').append(`<option value="${id}">${name}</option>`);
                });
            },
            error: function () {
                console.error('Teatterien haku epäonnistui.');
            }
        });
    }

    // Hakee elokuvat valitusta teatterista
    function fetchMovies(theaterId) {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('fi-FI');
        const url = `${FINNKINO_API_URL}?area=${theaterId}&dt=${formattedDate}`;

        $.ajax({
            url: url,
            method: 'GET',
            beforeSend: function () {
                $('#resultContainer').fadeOut(200, function () {
                    $(this).empty();
                });
            },
            success: function (response) {
                const movies = $(response).find('Show');
                if (movies.length === 0) {
                    $('#resultContainer').html('<p class="text-center">Ei näytöksiä valitussa teatterissa.</p>').fadeIn();
                    return;
                }
                movies.each(function () {
                    const title = $(this).find('Title').text();
                    const showtime = new Date($(this).find('dttmShowStart').text()).toLocaleString();
                    const imageUrl = $(this).find('EventSmallImagePortrait').text();

                    const movieCard = `
                        <div class="col-md-4">
                            <div class="movie-card">
                                <img src="${imageUrl}" alt="${title} Poster">
                                <div class="movie-info">
                                    <h5>${title}</h5>
                                    <p>Näytösaika: ${showtime}</p>
                                </div>
                            </div>
                        </div>`;
                    $('#resultContainer').append(movieCard);
                });
                $('#resultContainer').fadeIn(400);
            },
            error: function () {
                console.error('Elokuvien haku epäonnistui.');
            }
        });
    }

    // Event listener teatterin vaihtamiseen
    $('#theaterSelect').on('change', function () {
        const theaterId = $(this).val();
        if (theaterId) {
            fetchMovies(theaterId);
        } else {
            $('#resultContainer').fadeOut(200, function () {
                $(this).empty();
            });
        }
    });

    // Alustetaan teatterien haku
    fetchTheaters();
});
